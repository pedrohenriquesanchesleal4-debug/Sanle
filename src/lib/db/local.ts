import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Armazenamento local em arquivo JSON — permite rodar a aplicação inteira sem
 * Supabase nem qualquer chave. Em desenvolvimento local fica em `.data/` (gitignored).
 * Em ambientes serverless (Vercel / AWS Lambda onde `/var/task` é somente-leitura),
 * utiliza automaticamente `os.tmpdir()` (`/tmp/sanle-data`) com fallback em memória.
 */

export function resolveDataDir(opts?: { isServerless?: boolean; cwd?: string }): string {
  const cwd = opts?.cwd ?? process.cwd();
  const isServerless =
    opts?.isServerless ??
    Boolean(
      process.env.VERCEL ||
        process.env.AWS_LAMBDA_FUNCTION_NAME ||
        process.env.LAMBDA_TASK_ROOT ||
        cwd.startsWith("/var/task")
    );
  if (isServerless) {
    return path.join(os.tmpdir(), "sanle-data");
  }
  return path.join(cwd, ".data");
}

let activeDataDir = resolveDataDir();
const BUNDLED_DB_FILE = path.join(process.cwd(), ".data", "sanle.json");

export type LocalDB = {
  version: number;
  leads: unknown[];
  activities: unknown[];
  drafts: unknown[];
  reminders: unknown[];
  conversations: unknown[];
  messages: unknown[];
  knowledge: unknown[];
  chunks: unknown[];
  aiRuns: unknown[];
  audits: unknown[];
  searches: unknown[];
  leadSources: unknown[];
  adminUsers: unknown[];
  leadsInbound: unknown[];
  landingEvents: unknown[];
  prospectPages: unknown[];
};

const EMPTY: LocalDB = {
  version: 4,
  leads: [],
  activities: [],
  drafts: [],
  reminders: [],
  conversations: [],
  messages: [],
  knowledge: [],
  chunks: [],
  aiRuns: [],
  audits: [],
  searches: [],
  leadSources: [],
  adminUsers: [],
  leadsInbound: [],
  landingEvents: [],
  prospectPages: []
};

let cache: LocalDB | null = null;
let writeQueue: Promise<void> = Promise.resolve();

export async function readDB(): Promise<LocalDB> {
  if (cache) return cache;
  const dbFile = path.join(activeDataDir, "sanle.json");
  try {
    const raw = await fs.readFile(dbFile, "utf8");
    const parsed = JSON.parse(raw) as LocalDB;
    cache = { ...EMPTY, ...parsed };
    return cache;
  } catch {
    if (dbFile !== BUNDLED_DB_FILE) {
      try {
        const bundledRaw = await fs.readFile(BUNDLED_DB_FILE, "utf8");
        const bundledParsed = JSON.parse(bundledRaw) as LocalDB;
        cache = { ...EMPTY, ...bundledParsed };
        return cache;
      } catch {
        // Sem arquivo pré-empacotado; segue com banco inicial vazio
      }
    }
    cache = structuredClone(EMPTY);
    return cache;
  }
}

export async function writeDB(mutator: (db: LocalDB) => void): Promise<void> {
  const db = await readDB();
  mutator(db);
  writeQueue = writeQueue.then(async () => {
    const payload = JSON.stringify(db, null, 2);
    try {
      await fs.mkdir(activeDataDir, { recursive: true });
      const dbFile = path.join(activeDataDir, "sanle.json");
      const tmp = `${dbFile}.tmp`;
      await fs.writeFile(tmp, payload, "utf8");
      await fs.rename(tmp, dbFile);
    } catch {
      // Fallback imediato para os.tmpdir() caso o diretório atual seja somente leitura (ex: /var/task na Vercel)
      try {
        activeDataDir = path.join(os.tmpdir(), "sanle-data");
        await fs.mkdir(activeDataDir, { recursive: true });
        const fallbackFile = path.join(activeDataDir, "sanle.json");
        await fs.writeFile(fallbackFile, payload, "utf8");
      } catch (err) {
        console.warn("[LocalDB] Sistema de arquivos somente-leitura; mantendo dados em memória:", err);
      }
    }
  });
  await writeQueue;
}

export function newId(prefix = ""): string {
  const id = crypto.randomUUID();
  return prefix ? `${prefix}_${id}` : id;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function resetCache() {
  cache = null;
}
