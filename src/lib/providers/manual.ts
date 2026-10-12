import type { ProspectCandidate, ProspectProvider } from "./types";

/** Cadastro manual: a fonte mais honesta quando não há API/arquivo. */
export const manualProvider: ProspectProvider = {
  id: "manual",
  label: "Cadastro manual",
  requiresApproval: false,
  configured: () => true,
  note: "Você digita os dados da empresa. Nada é inferido além do que você informar.",
  capabilities: {
    free: true,
    requiresKey: false,
    paid: false,
    serverOnly: false,
    supportsImport: false
  },
  async search(): Promise<ProspectCandidate[]> {
    return [];
  }
};
