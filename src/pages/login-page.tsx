import { FormEvent, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname;

  if (user) {
    return <Navigate to={redirectTo || "/overview"} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(email, password);
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : "Unable to sign in.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Admin Access</p>
        <h1>Marketing Boost Planner</h1>
        <p className="auth-copy">
          Sign in with your Firebase Auth admin account to access businesses,
          ideas, production, and calendar operations.
        </p>

        <form className="entry-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="status-text">{error}</p> : null}
          <button className="ghost-button auth-button" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
