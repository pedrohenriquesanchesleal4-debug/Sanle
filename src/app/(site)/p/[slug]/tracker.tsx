"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ProspectPageTracker({
  slug,
  empresa,
  nicho
}: {
  slug: string;
  empresa: string;
  nicho: string;
}) {
  useEffect(() => {
    trackEvent(
      "pagina_personalizada_vista",
      { empresa, nicho },
      { prospectSlug: slug }
    );
  }, [slug, empresa, nicho]);

  return null;
}
