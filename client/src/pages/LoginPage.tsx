import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const Shell = styled.div`
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial,
    sans-serif;
  color: #fff;
  position: relative;

  background: radial-gradient(
      1200px 600px at 15% 20%,
      rgba(255, 255, 255, 0.18),
      transparent 60%
    ),
    linear-gradient(135deg, #2b3a67 0%, #4b53c7 55%, #7b6cff 100%);
`;

const LoginContent = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
`;

const Card = styled.div`
  width: 560px;
  max-width: 100%;
  padding: 28px 28px 26px;
  background: rgba(255, 255, 255, 0.11);
  border-radius: 18px;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

const Badge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 20px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.2px;
`;

const Subtitle = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
`;

const Divider = styled.div`
  height: 1px;
  margin: 18px 0 16px;
  background: rgba(255, 255, 255, 0.12);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
`;

const Input = styled.input`
  height: 46px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.16);
  color: #fff;
  font-size: 15px;
  outline: none;
  width: 90%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus {
    border-color: rgba(123, 108, 255, 0.9);
    box-shadow: 0 0 0 3px rgba(123, 108, 255, 0.22);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
    width: 90%;
`;

const PasswordInput = styled(Input)`
  /* padding-right: 44px; space for icon */
  width: 100%;
`;

const IconButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);

  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.12);

  cursor: pointer;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.85);

  &:hover {
    opacity: 0.9;
  }
`;

const ErrorBox = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 92, 92, 0.35);
  background: rgba(255, 92, 92, 0.12);
  color: rgba(255, 255, 255, 0.92);
  font-size: 13px;
`;

const Button = styled.button`
  height: 46px;
  border-radius: 12px;
  border: none;
  cursor: pointer;

  background: linear-gradient(135deg, #7b6cff, #4b53c7);
  color: #fff;
  font-weight: 800;
  font-size: 15px;

  &:hover {
    opacity: 0.95;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const FooterRow = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`;

const LinkBtn = styled.button`
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-weight: 700;
  padding: 0;

  &:hover {
    opacity: 0.85;
    text-decoration: underline;
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const canSubmit = useMemo(() => {
    return form.username.trim().length > 0 && form.password.length > 0 && !loading;
  }, [form.username, form.password, loading]);

  async function login() {
    setErr("");

    if (!form.username.trim() || !form.password) {
      setErr("Please enter your username/email and password.");
      return;
    }

    setLoading(true);
    try {
      // ✅ If your backend route is /api/login, change to "/api/login"
      const res = await api.post("/login", {
        email: form.username,      // treat username input as email
        password: form.password,
        username: form.username,
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(res.data.user || {}));
      if (res.data.token) localStorage.setItem("token", res.data.token);

      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr(
        e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <LoginContent>
        <Card>
          <HeaderRow>
            <Badge>🔐</Badge>
            <div>
              <Title>Sign in</Title>
              <Subtitle>
                Login to access Employees, Payroll and Reports.
              </Subtitle>
            </div>
          </HeaderRow>

          <Divider />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            {err ? <ErrorBox>{err}</ErrorBox> : null}

            <Field>
              <Label htmlFor="username">Email / Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="you@company.com"
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                autoComplete="username"
              />
            </Field>

            <Field>
              <Label htmlFor="password">Password</Label>
              <PasswordWrapper>
                <PasswordInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  autoComplete="current-password"
                />
                <IconButton
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </IconButton>
              </PasswordWrapper>
            </Field>

            <Button type="submit" disabled={!canSubmit}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <FooterRow>
              <span>Use your admin account credentials.</span>
              
            </FooterRow>
          </Form>
        </Card>
      </LoginContent>
    </Shell>
  );
}

/* Icons */
function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M6.4 6.4C3.6 8.6 1.5 12 1.5 12S5.5 19 12 19c1.8 0 3.4-.4 4.8-1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M14.9 5.2C13.9 5 13 5 12 5c-1.1 0-2.1.2-3 .5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
