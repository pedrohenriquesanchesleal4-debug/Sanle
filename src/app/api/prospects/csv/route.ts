import { failure, guard, handleError, ok, requireAdmin } from "@/lib/api";
import { csvRowsToCandidates, parseCsv } from "@/lib/providers/csv";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const limited = guard(req, "prospect-csv", 10, 10 * 60_000);
  if (limited) return limited;

  try {
    const form = await req.formData().catch(() => null);
    if (!form) return failure("Envie um arquivo CSV (multipart/form-data).", 400);
    const file = form.get("file");
    if (!(file instanceof File)) return failure("Campo 'file' ausente.", 400);
    if (file.size > MAX_BYTES) return failure("Arquivo maior que 2MB.", 413);

    const text = await file.text();
    const { rows, columns, errors } = parseCsv(text);
    if (!rows.length) return failure(errors[0] ?? "Nenhuma linha válida encontrada.", 422);

    const city = String(form.get("city") ?? "") || undefined;
    const uf = String(form.get("uf") ?? "") || undefined;
    const category = String(form.get("category") ?? "") || undefined;

    const candidates = csvRowsToCandidates(rows, { city, uf, category });

    return ok({
      columns,
      parsedRows: rows.length,
      candidates,
      errors: errors.slice(0, 20),
      window: { city: city ?? null, uf: uf ?? null, category: category ?? null }
    });
  } catch (err) {
    return handleError(err);
  }
}
