import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Armazenamento local em arquivo JSON — permite rodar a aplicação inteira sem
 * Supabase nem qualquer chave. Fica em `.data/` (gitignored).
 *
 * Não é um banco de produção: é o modo gratuito/honesto de desenvolvimento.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "sanle.json");

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
};

const EMPTY: LocalDB = {
  version: 2,
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
  leadSources: []
};

let cache: LocalDB | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readDB(): Promise<LocalDB> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as LocalDB;
    cache = { ...EMPTY, ...parsed };
  } catch {
    cache = structuredClone(EMPTY);
  }
  return cache;
}

export async function writeDB(mutator: (db: LocalDB) => void): Promise<void> {
  const db = await readDB();
  mutator(db);
  writeQueue = writeQueue.then(async () => {
    await ensureDir();
    const tmp = `${DB_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await fs.rename(tmp, DB_FILE);
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
