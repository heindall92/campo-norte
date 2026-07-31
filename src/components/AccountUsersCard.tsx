import {
  ASSIGNABLE_ROLES,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  canManageCrmUsers,
  createCrmUser,
  listCrmUsersSafe,
  updateCrmUserRole,
  useAuth,
  type AppUser,
  type UserRole,
} from "@/lib/auth";
import type { Lang } from "@/lib/i18n";
import { Card } from "@/components/CrmChrome";
import { cn } from "@/lib/utils";
import { Lock, Pencil, Plus, RefreshCw, ShieldAlert } from "lucide-react";
import { useCallback, useState, type FormEvent } from "react";

export function AccountUsersCard({
  lang,
  fieldCls,
  labelCls,
}: {
  lang: Lang;
  fieldCls: string;
  labelCls: string;
}) {
  const { user, signOut, supabaseReady } = useAuth();
  const canManage = canManageCrmUsers(user?.role);
  const localUsersMode = !supabaseReady;

  const [users, setUsers] = useState<AppUser[]>(() => listCrmUsersSafe());
  const [flash, setFlash] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("booking");
  const [createError, setCreateError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setUsers(listCrmUsersSafe());
  }, []);

  function onCreate(e: FormEvent) {
    e.preventDefault();
    setCreateError(null);
    if (!localUsersMode) {
      setCreateError(
        lang === "es"
          ? "Con Supabase Auth, crea usuarios en el dashboard de Supabase."
          : "With Supabase Auth, create users in the Supabase dashboard.",
      );
      return;
    }
    try {
      createCrmUser({ email: newEmail, password: newPassword, role: newRole });
      setNewEmail("");
      setNewPassword("");
      setNewRole("booking");
      refresh();
      setFlash(
        lang === "es"
          ? "Usuario creado · sesión limitada según rol"
          : "User created · session limited by role",
      );
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : String(err));
    }
  }

  function onRoleChange(id: string, role: UserRole) {
    if (!localUsersMode) return;
    try {
      updateCrmUserRole(id, role);
      setEditingId(null);
      refresh();
      setFlash(
        lang === "es"
          ? `Rol actualizado · ${ROLE_LABEL[role]}`
          : `Role updated · ${ROLE_LABEL[role]}`,
      );
    } catch (err) {
      setFlash(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <Card
      className="h-full lg:col-span-2"
      title={lang === "es" ? "Cuenta y usuarios" : "Account & users"}
      subtitle={
        lang === "es"
          ? "Tu sesión y gestión de accesos al panel. Usuarios del CRM solo visibles para Admin / CEO / founder."
          : "Your session and panel access. CRM users visible only to Admin / CEO / founder."
      }
    >
      <div className="space-y-5">
        {/* Sesión actual — siempre dentro de la tarjeta */}
        <div className="rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] p-4">
          <p className={labelCls}>
            {lang === "es" ? "Sesión actual" : "Current session"}
          </p>
          {user ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-bold text-white">
                  {user.avatarInitial}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-[family-name:var(--mps-display)] text-lg text-[var(--ink)]">
                    {user.name}
                  </p>
                  <p className="truncate text-sm font-semibold text-[var(--ink)]">
                    {user.email}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                    {user.roleLabel} ·{" "}
                    {user.provider === "supabase" ? "Supabase Auth" : "Demo local"}
                    {" · "}
                    {ROLE_DESCRIPTION[user.role][lang === "es" ? "es" : "en"]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="shrink-0 rounded-xl border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--danger)]"
              >
                {lang === "es" ? "Cerrar sesión" : "Sign out"}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">—</p>
          )}
        </div>

        {/* Cambio de contraseña — visible, deshabilitado */}
        <div className="rounded-xl border border-dashed border-[var(--field-border)] p-4 opacity-80">
          <div className="mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-[var(--ink-muted)]" />
            <p className="text-sm font-semibold text-[var(--ink)]">
              {lang === "es"
                ? "Nueva contraseña (tu cuenta)"
                : "New password (your account)"}
            </p>
            <span className="rounded-md border border-[var(--field-border)] bg-[var(--field-bg)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">
              {lang === "es" ? "Próximamente" : "Soon"}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className={cn(labelCls, "min-w-0 flex-1")}>
              <span className="sr-only">
                {lang === "es" ? "Nueva contraseña" : "New password"}
              </span>
              <input
                type="password"
                disabled
                value="••••••••"
                readOnly
                className={cn(fieldCls, "cursor-not-allowed opacity-70")}
                title={
                  lang === "es"
                    ? "Cambio de contraseña deshabilitado por ahora"
                    : "Password change disabled for now"
                }
              />
            </label>
            <button
              type="button"
              disabled
              className="mps-choice cursor-not-allowed rounded-lg px-4 py-2 text-sm font-semibold opacity-60"
            >
              {lang === "es" ? "Cambiar" : "Change"}
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            {lang === "es"
              ? "Visible para el administrador, pero deshabilitado hasta activar el flujo seguro de cambio de contraseña."
              : "Visible to the admin, but disabled until the secure password-change flow is enabled."}
          </p>
        </div>

        {/* Usuarios del panel — solo Admin / CEO / founder */}
        {canManage ? (
          <div className="rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {lang === "es" ? "Usuarios del panel" : "Panel users"}
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  {lang === "es"
                    ? "Cada rol limita el menú y la información sensible (sesión multicapa)."
                    : "Each role limits the menu and sensitive data (layered session)."}
                </p>
              </div>
              <button
                type="button"
                onClick={refresh}
                className="rounded-lg border border-[var(--field-border)] p-2 text-[var(--ink)] hover:border-[var(--accent)]"
                title={lang === "es" ? "Actualizar" : "Refresh"}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <ul className="mb-4 space-y-2">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--field-border)] bg-[var(--glass-strong)] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">
                      {u.email}
                    </p>
                    {editingId === u.id && localUsersMode ? (
                      <select
                        className={cn(fieldCls, "mt-1 max-w-[12rem]")}
                        value={u.role}
                        onChange={(e) =>
                          onRoleChange(u.id, e.target.value as UserRole)
                        }
                      >
                        {ASSIGNABLE_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs text-[var(--ink-muted)]">
                        {ROLE_LABEL[u.role]}
                        {u.id === user?.id
                          ? lang === "es"
                            ? " · tú"
                            : " · you"
                          : ""}
                      </p>
                    )}
                  </div>
                  {localUsersMode && (
                    <button
                      type="button"
                      title={lang === "es" ? "Editar rol" : "Edit role"}
                      onClick={() =>
                        setEditingId((id) => (id === u.id ? null : u.id))
                      }
                      className="rounded-full border border-[var(--field-border)] p-2 text-[var(--ink)] hover:border-[var(--accent)]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <form
              onSubmit={onCreate}
              className="rounded-xl border border-dashed border-[var(--field-border)] bg-[var(--glass-strong)] p-4"
            >
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <Plus className="h-4 w-4" />
                {lang === "es" ? "Crear usuario" : "Create user"}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className={labelCls}>
                  Email
                  <input
                    type="email"
                    required
                    disabled={!localUsersMode}
                    className={fieldCls}
                    value={newEmail}
                    placeholder="email"
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </label>
                <label className={labelCls}>
                  {lang === "es" ? "Contraseña (mín. 6)" : "Password (min. 6)"}
                  <input
                    type="password"
                    required
                    minLength={6}
                    disabled={!localUsersMode}
                    className={fieldCls}
                    value={newPassword}
                    placeholder={lang === "es" ? "Contraseña (mín. 6)" : "Password (min. 6)"}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
                <label className={labelCls}>
                  {lang === "es" ? "Rol" : "Role"}
                  <select
                    className={fieldCls}
                    disabled={!localUsersMode}
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                  >
                    {ASSIGNABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {!localUsersMode && (
                <p className="mt-2 flex items-start gap-2 text-xs text-[var(--warn-ink)]">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {lang === "es"
                    ? "Supabase Auth activo: la creación de cuentas se gestiona en Supabase (metadata role). Aquí ves el modelo de roles del CRM."
                    : "Supabase Auth on: account creation is managed in Supabase (role metadata). Role model is shown here."}
                </p>
              )}
              {createError && (
                <p className="mt-2 text-sm text-[var(--danger)]">{createError}</p>
              )}
              <button
                type="submit"
                disabled={!localUsersMode}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {lang === "es" ? "Crear usuario" : "Create user"}
              </button>
            </form>

            {flash && <p className="mt-3 text-sm text-[var(--accent)]">{flash}</p>}
          </div>
        ) : (
          <p className="rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] px-3 py-2 text-xs text-[var(--ink-muted)]">
            {lang === "es"
              ? "La base de usuarios del CRM y la asignación de roles solo están disponibles para Admin / CEO / founder."
              : "CRM user directory and role assignment are only available to Admin / CEO / founder."}
          </p>
        )}
      </div>
    </Card>
  );
}
