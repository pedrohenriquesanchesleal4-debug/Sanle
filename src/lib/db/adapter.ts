import { readDB, writeDB, newId, nowISO, type LocalDB } from "./local";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { env } from "@/lib/env";

/**
 * Adaptador de tabela com duas implementações:
 *  - LocalTable: arrays dentro de um JSON em `.data/` (roda sem nenhuma chave).
 *  - SupabaseTable: tabelas Postgres via service role (produção), com fallback resiliente para LocalTable.
 *
 * O repositório não sabe qual está por baixo. Conversão camelCase <-> snake_case
 * garante que o domínio em TS não depende do formato do Postgres.
 */

export type Collection =
  | "leads"
  | "activities"
  | "drafts"
  | "reminders"
  | "conversations"
  | "messages"
  | "knowledge"
  | "chunks"
  | "aiRuns"
  | "audits"
  | "searches"
  | "leadSources"
  | "adminUsers"
  | "leadsInbound"
  | "landingEvents"
  | "prospectPages";

export interface Row {
  id: string;
  [key: string]: unknown;
}

export interface Table<T extends Row> {
  all(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  insert(data: Omit<T, "id"> & { id?: string }): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  remove(id: string): Promise<void>;
  removeWhere(pred: (row: T) => boolean): Promise<void>;
  count(): Promise<number>;
}

/* ----------------------- camelCase <-> snake_case ----------------------- */

function toSnakeKey(k: string): string {
  return k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
}
function toCamelKey(k: string): string {
  return k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function mapKeys<T extends Record<string, unknown>>(
  obj: T,
  fn: (k: string) => string
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) out[fn(k)] = v;
  return out;
}

export const __test = { toSnakeKey, toCamelKey, mapKeys };

/* ----------------------------- Local table ------------------------------ */

function localKey(collection: Collection): keyof LocalDB {
  return collection as keyof LocalDB;
}

export class LocalTable<T extends Row> implements Table<T> {
  constructor(private collection: Collection) {}

  async all(): Promise<T[]> {
    const db = await readDB();
    return (db[localKey(this.collection)] as unknown as T[]) ?? [];
  }

  async get(id: string): Promise<T | null> {
    const rows = await this.all();
    return rows.find((r) => r.id === id) ?? null;
  }

  async insert(data: Omit<T, "id"> & { id?: string }): Promise<T> {
    const row = { id: data.id ?? newId(), ...data } as T;
    await writeDB((db) => {
      const arr = db[localKey(this.collection)] as unknown as T[];
      arr.push(row);
    });
    return row;
  }

  async update(id: string, patch: Partial<T>): Promise<T | null> {
    let updated: T | null = null;
    await writeDB((db) => {
      const arr = db[localKey(this.collection)] as unknown as T[];
      const idx = arr.findIndex((r) => r.id === id);
      if (idx >= 0) {
        arr[idx] = { ...arr[idx], ...patch, id } as T;
        updated = arr[idx];
      }
    });
    return updated;
  }

  async remove(id: string): Promise<void> {
    await writeDB((db) => {
      const arr = db[localKey(this.collection)] as unknown as T[];
      const idx = arr.findIndex((r) => r.id === id);
      if (idx >= 0) arr.splice(idx, 1);
    });
  }

  async removeWhere(pred: (row: T) => boolean): Promise<void> {
    await writeDB((db) => {
      const arr = db[localKey(this.collection)] as unknown as T[];
      const kept = arr.filter((r) => !pred(r));
      (db[localKey(this.collection)] as unknown as T[]).length = 0;
      (db[localKey(this.collection)] as unknown as T[]).push(...kept);
    });
  }

  async count(): Promise<number> {
    return (await this.all()).length;
  }
}

/* --------------------------- Supabase table ----------------------------- */

type SupabaseAdmin = Awaited<ReturnType<typeof getSupabaseAdmin>>;

export class SupabaseTable<T extends Row> implements Table<T> {
  private localFallback: LocalTable<T>;

  constructor(
    private table: string,
    private admin: NonNullable<SupabaseAdmin>,
    private collection: Collection
  ) {
    this.localFallback = new LocalTable<T>(collection);
  }

  private isTableUnavailableError(error: unknown): boolean {
    if (!error) return false;
    const msg = String((error as { message?: string })?.message || error).toLowerCase();
    const code = String((error as { code?: string })?.code || "");
    return (
      msg.includes("schema cache") ||
      msg.includes("does not exist") ||
      msg.includes("could not find the table") ||
      msg.includes("invalid api key") ||
      msg.includes("unauthorized") ||
      msg.includes("failed to fetch") ||
      code === "PGRST205" ||
      code === "PGRST116" ||
      code === "42P01"
    );
  }

  private toRow(input: Record<string, unknown>): Record<string, unknown> {
    return mapKeys(input, toSnakeKey);
  }
  private fromRow(input: Record<string, unknown>): T {
    return mapKeys(input, toCamelKey) as T;
  }

  async all(): Promise<T[]> {
    try {
      const { data, error } = await this.admin.from(this.table).select("*").limit(10000);
      if (error) {
        if (this.isTableUnavailableError(error)) {
          console.warn(`[Supabase Fallback] Tabela "${this.table}" indisponível no Supabase (${error.message}). Consultando LocalTable.`);
          return await this.localFallback.all();
        }
        throw new Error(`Supabase ${this.table}: ${error.message}`);
      }
      return (data ?? []).map((r) => this.fromRow(r as Record<string, unknown>));
    } catch (err) {
      if (this.isTableUnavailableError(err)) {
        return await this.localFallback.all();
      }
      throw err;
    }
  }

  async get(id: string): Promise<T | null> {
    try {
      const { data, error } = await this.admin.from(this.table).select("*").eq("id", id).maybeSingle();
      if (error) {
        if (this.isTableUnavailableError(error)) {
          return await this.localFallback.get(id);
        }
        throw new Error(`Supabase ${this.table}: ${error.message}`);
      }
      return data ? this.fromRow(data as Record<string, unknown>) : null;
    } catch (err) {
      if (this.isTableUnavailableError(err)) {
        return await this.localFallback.get(id);
      }
      throw err;
    }
  }

  async insert(input: Omit<T, "id"> & { id?: string }): Promise<T> {
    try {
      const row = { id: input.id ?? newId(), ...input } as Record<string, unknown>;
      const { data, error } = await this.admin.from(this.table).insert(this.toRow(row)).select("*").single();
      if (error) {
        if (this.isTableUnavailableError(error)) {
          console.warn(`[Supabase Fallback] Tabela "${this.table}" indisponível no Supabase (${error.message}). Gravando no LocalTable.`);
          return await this.localFallback.insert(input);
        }
        throw new Error(`Supabase ${this.table}: ${error.message}`);
      }
      return this.fromRow(data as Record<string, unknown>);
    } catch (err) {
      if (this.isTableUnavailableError(err)) {
        console.warn(`[Supabase Fallback] Exceção em "${this.table}". Gravando no LocalTable.`);
        return await this.localFallback.insert(input);
      }
      throw err;
    }
  }

  async update(id: string, patch: Partial<T>): Promise<T | null> {
    try {
      const { data, error } = await this.admin
        .from(this.table)
        .update(this.toRow(patch as Record<string, unknown>))
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) {
        if (this.isTableUnavailableError(error)) {
          return await this.localFallback.update(id, patch);
        }
        throw new Error(`Supabase ${this.table}: ${error.message}`);
      }
      return data ? this.fromRow(data as Record<string, unknown>) : null;
    } catch (err) {
      if (this.isTableUnavailableError(err)) {
        return await this.localFallback.update(id, patch);
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const { error } = await this.admin.from(this.table).delete().eq("id", id);
      if (error) {
        if (this.isTableUnavailableError(error)) {
          return await this.localFallback.remove(id);
        }
        throw new Error(`Supabase ${this.table}: ${error.message}`);
      }
    } catch (err) {
      if (this.isTableUnavailableError(err)) {
        return await this.localFallback.remove(id);
      }
      throw err;
    }
  }

  async removeWhere(_pred: (row: T) => boolean): Promise<void> {
    try {
      const rows = await this.all();
      const ids = rows.filter(_pred).map((r) => r.id);
      if (!ids.length) return;
      const { error } = await this.admin.from(this.table).delete().in("id", ids);
      if (error) {
        if (this.isTableUnavailableError(error)) {
          return await this.localFallback.removeWhere(_pred);
        }
        throw new Error(`Supabase ${this.table}: ${error.message}`);
      }
    } catch (err) {
      if (this.isTableUnavailableError(err)) {
        return await this.localFallback.removeWhere(_pred);
      }
      throw err;
    }
  }

  async count(): Promise<number> {
    try {
      const { count, error } = await this.admin
        .from(this.table)
        .select("id", { count: "exact", head: true });
      if (error) {
        if (this.isTableUnavailableError(error)) {
          return await this.localFallback.count();
        }
        throw new Error(`Supabase ${this.table}: ${error.message}`);
      }
      return count ?? 0;
    } catch (err) {
      if (this.isTableUnavailableError(err)) {
        return await this.localFallback.count();
      }
      throw err;
    }
  }
}

/* ------------------------------- Factory -------------------------------- */

const TABLE_NAMES: Record<Collection, string> = {
  leads: "leads",
  activities: "lead_activities",
  drafts: "outreach_drafts",
  reminders: "reminders",
  conversations: "conversations",
  messages: "conversation_messages",
  knowledge: "knowledge_documents",
  chunks: "knowledge_chunks",
  aiRuns: "ai_runs",
  audits: "audit_logs",
  searches: "saved_searches",
  leadSources: "lead_sources",
  adminUsers: "admin_users",
  leadsInbound: "leads_inbound",
  landingEvents: "landing_events",
  prospectPages: "prospect_pages"
};

export async function table<T extends Row>(collection: Collection): Promise<Table<T>> {
  if (env.supabase.admin) {
    const admin = await getSupabaseAdmin();
    if (admin) return new SupabaseTable<T>(TABLE_NAMES[collection], admin, collection);
  }
  return new LocalTable<T>(collection);
}

export { newId, nowISO };
