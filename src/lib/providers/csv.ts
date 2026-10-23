import type { ProspectCandidate, ProspectProvider } from "./types";
import { ProviderUnavailableError } from "./types";

/**
 * Importação por CSV. O operador é responsável pela procedência e pelas bases
 * legais do arquivo enviado — a Sanle não raspa diretórios nem contorna bloqueios.
 */

export function parseCsv(text: string): { rows: Record<string, string>[]; columns: string[]; errors: string[] } {
  const errors: string[] = [];
  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  if (!clean) return { rows: [], columns: [], errors: ["Arquivo vazio."] };

  const delimiter = (clean.split("\n")[0]?.match(/;/g)?.length ?? 0) > (clean.split("\n")[0]?.match(/,/g)?.length ?? 0) ? ";" : ",";

  const lines = clean.split("\n").filter((l) => l.trim().length);
  const headerLine = lines.shift();
  if (!headerLine) return { rows: [], columns: [], errors: ["Sem cabeçalho."] };

  const columns = splitCsvLine(headerLine, delimiter).map((c) => normalizeHeader(c));

  const rows: Record<string, string>[] = [];
  for (let i = 0; i < lines.length; i++) {
    const values = splitCsvLine(lines[i] ?? "", delimiter);
    if (values.length !== columns.length) {
      errors.push(`Linha ${i + 2}: ${values.length} colunas (esperado ${columns.length}).`);
      continue;
    }
    const row: Record<string, string> = {};
    columns.forEach((c, idx) => (row[c] = (values[idx] ?? "").trim()));
    if (Object.values(row).some((v) => v.length)) rows.push(row);
  }
  return { rows, columns, errors };
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

const HEADER_ALIASES: Record<string, string> = {
  empresa: "companyName",
  nome: "companyName",
  razaoocial: "companyName",
  "razão social": "companyName",
  fantasia: "tradeName",
  nomefantasia: "tradeName",
  categoria: "category",
  segmento: "segment",
  cidade: "city",
  municipio: "city",
  uf: "uf",
  estado: "uf",
  endereco: "address",
  "endereço": "address",
  site: "website",
  website: "website",
  telefone: "phone",
  fone: "phone",
  email: "email",
  "e-mail": "email",
  linkedin: "linkedin",
  observacoes: "notes",
  "observações": "notes",
  notas: "notes",
  hipotese: "hypothesis",
  "hipótese": "hypothesis",
  contato: "contactName"
};

function normalizeHeader(h: string): string {
  const key = h.trim().toLowerCase();
  return HEADER_ALIASES[key] ?? key.replace(/\s+/g, "");
}

export function csvRowsToCandidates(
  rows: Record<string, string>[],
  fallback: { city?: string; uf?: string; category?: string }
): ProspectCandidate[] {
  return rows
    .map((row, i): ProspectCandidate | null => {
      const name = row.companyName || row.tradeName;
      if (!name) return null;
      const facts: string[] = [];
      if (row.website) facts.push("Site informado no arquivo importado.");
      if (row.phone) facts.push("Telefone informado no arquivo importado.");
      if (row.email) facts.push("E-mail informado no arquivo importado.");
      return {
        externalId: `csv/${i}-${name}`,
        companyName: name,
        tradeName: row.tradeName ?? null,
        category: row.category ?? fallback.category ?? null,
        address: row.address ?? null,
        city: row.city ?? fallback.city ?? null,
        uf: row.uf ?? fallback.uf ?? null,
        website: row.website ?? null,
        phone: row.phone ?? null,
        email: row.email ?? null,
        linkedin: row.linkedin ?? null,
        lat: null,
        lon: null,
        source: {
          provider: "csv",
          providerId: `csv/${i}`,
          collectedAt: new Date().toISOString(),
          note: "Importação manual de CSV — procedência declarada pelo operador."
        },
        facts,
        hypotheses: row.hypothesis ? [row.hypothesis] : []
      } satisfies ProspectCandidate;
    })
    .filter((c): c is ProspectCandidate => Boolean(c));
}

export const csvProvider: ProspectProvider = {
  id: "csv",
  label: "Importar planilha (CSV)",
  requiresApproval: false,
  configured: () => true,
  note: "Importa uma lista que você já possui. A responsabilidade pela base legal é sua.",
  capabilities: {
    free: true,
    requiresKey: false,
    paid: false,
    serverOnly: true,
    supportsImport: true
  },
  async search(): Promise<ProspectCandidate[]> {
    throw new ProviderUnavailableError("CSV não executa busca: use o upload de arquivo.");
  }
};
