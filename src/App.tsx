import { useAuth } from "@/lib/auth";
import { CookieNotice } from "@/components/CookieNotice";
import { LegalPage } from "@/components/LegalPage";
import { LoginScreen } from "@/components/LoginScreen";
import { MpsCrmApp } from "@/components/MpsCrmApp";

function isLegalPath() {
  return window.location.pathname.replace(/\/+$/, "") === "/legal";
}

export default function App() {
  const { ready, user } = useAuth();

  if (isLegalPath()) {
    return (
      <>
        <LegalPage />
        <CookieNotice />
      </>
    );
  }

  if (!ready) {
    return (
      <div className="mps-crm mps-bg flex min-h-screen items-center justify-center text-sm text-[var(--ink-muted)]">
        Cargando sesión…
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginScreen />
        <CookieNotice />
      </>
    );
  }

  return (
    <>
      <MpsCrmApp />
      <CookieNotice />
    </>
  );
}
