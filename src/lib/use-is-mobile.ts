import { useEffect, useState } from "react";

/** Breakpoint alineado a “móvil / tablet estrecha” (CRM desktop sidebar no cabe bien). */
export const MOBILE_MQ = "(max-width: 767px)";

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_MQ).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return mobile;
}
