/** Chunking por parágrafo com sobreposição leve, respeitando limites. */
export type RawChunk = { ordinal: number; content: string };

export function chunkText(text: string, maxChars = 900, overlapChars = 120): RawChunk[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const paragraphs = clean.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  const pushCurrent = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };

  for (const p of paragraphs) {
    if ((current + "\n\n" + p).length > maxChars && current) {
      pushCurrent();
      // sobreposição: começa o próximo com o fim do anterior
      if (overlapChars > 0 && chunks.length) {
        const prev = chunks[chunks.length - 1] ?? "";
        current = prev.slice(-overlapChars) + "\n\n";
      }
    }
    current += (current ? "\n\n" : "") + p;

    // parágrafo isolado maior que o limite: quebra em janelas
    while (current.length > maxChars) {
      const slice = current.slice(0, maxChars);
      chunks.push(slice.trim());
      current = current.slice(maxChars - overlapChars);
    }
  }
  pushCurrent();

  return chunks.map((content, ordinal) => ({ ordinal, content }));
}
