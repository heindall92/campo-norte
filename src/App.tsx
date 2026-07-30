import { useAuth } from "@/lib/auth";
import { LoginScreen } from "@/components/LoginScreen";
import { MpsCrmApp } from "@/components/MpsCrmApp";

export default function App() {
  const { ready, user } = useAuth();

  if (!ready) {
    return (
      <div className="mps-crm mps-bg flex min-h-screen items-center justify-center text-sm text-[var(--ink-muted)]">
        Cargando sesión…
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <MpsCrmApp />;
}
