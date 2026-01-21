import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import MainLogo from "../assets/images.jpg";
import Logo from "../assets/progression.png";

/* ============= Background / Shell ============= */

const Shell = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #fff;
  position: relative;

  /* keep your gradient */
  background: radial-gradient(1200px 600px at 15% 20%, rgba(255, 255, 255, 0.18), transparent 60%),
    linear-gradient(135deg, #2b3a67 0%, #4b53c7 55%, #7b6cff 100%);
`;

/* background image layer */
const BgImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${MainLogo});
  background-size: cover;
  background-position: center;
  opacity: 0.18;
  filter: saturate(1.1) contrast(1.05);
  transform: scale(1.03);
`;

/* overlay to make text readable */
const BgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(900px 500px at 25% 20%, rgba(0,0,0,0.25), transparent 60%),
    linear-gradient(180deg, rgba(0,0,0,0.32), rgba(0,0,0,0.18));
`;

/* ============= Layout ============= */

const Container = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1120px;
  margin: 0 auto;
  padding: 22px 18px 40px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
`;

const BrandIcon = styled.img`
  width: 26px;
  height: 26px;
  object-fit: contain;
`;

const BrandText = styled.span`
  font-weight: 900;
  letter-spacing: 0.2px;
`;

const HelpText = styled.div`
  font-size: 13px;
  color: rgba(255,255,255,0.80);
`;

const Grid = styled.div`
  margin-top: 26px;
  display: grid;
  grid-template-columns: 560px 1fr;
  gap: 50px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

/* ============= Left (login) ============= */

const Card = styled.div`
  width: 560px;
  max-width: 100%;
  padding: 26px 26px 22px;
  margin-right: 20px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.20);
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
  font-weight: 950;
  letter-spacing: 0.2px;
`;

const Subtitle = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
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
  width: 90%;
  gap: 7px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.88);
`;

const Input = styled.input`
  height: 46px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.18);
  color: #fff;
  font-size: 15px;
  outline: none;
  width: 100%;

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
  width: 100%;
  
`;

const PasswordInput = styled(Input)`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 7px;
`;

const IconButton = styled.button`
  position: absolute;
  top: 50%;
  right: -10px; /* ✅ fix: keep inside input */
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
  font-weight: 900;
  font-size: 15px;

  &:hover { opacity: 0.95; }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const FooterRow = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`;

/* ============= Right panel (visual fill) ============= */

const RightPanel = styled.div`
  border-radius: 22px;
   margin-left: 50px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(12px);
  overflow: hidden;
  box-shadow: 0 28px 90px rgba(0,0,0,0.25);

  @media (max-width: 980px) {
    display: none;
  }
`;

const PanelTop = styled.div`
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  font-weight: 900;
  font-size: 12px;
`;

const PanelBody = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const PanelHeading = styled.div`
  font-size: 16px;
  font-weight: 950;
`;

const PanelSub = styled.div`
  font-size: 13px;
  color: rgba(255,255,255,0.80);
  line-height: 1.55;
`;

const HeroImageWrap = styled.div`
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.18);
`;

const HeroImage = styled.img`
  width: 100%;
  height: 240px;
  display: block;
  object-fit: cover;
`;

const MiniStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

const Stat = styled.div`
  padding: 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.16);
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.72);
  font-weight: 800;
`;

const StatValue = styled.div`
  margin-top: 6px;
  font-weight: 950;
  font-size: 16px;
`;

const DividerSoft = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.12);
`;

/* ============= Page ============= */

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ username: "", password: "" });

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
      const res = await api.post("/login", {
        email: form.username,
        password: form.password,
        username: form.username,
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(res.data.user || {}));
      if (res.data.token) localStorage.setItem("token", res.data.token);

      navigate("/dash", { replace: true });
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
      <BgImage />
      <BgOverlay />

      <Container>
        <TopBar>
          <Brand>
            <BrandIcon src={Logo} alt="Brand" />
            <BrandText>Payroll Suite</BrandText>
          </Brand>
          <HelpText>Secure access • Admin credentials required</HelpText>
        </TopBar>

        <Grid>
          <Card>
            <HeaderRow>
              <Badge>🔐</Badge>
              <div>
                <Title>Sign in</Title>
                <Subtitle>Login to access Employees, Payroll and Reports.</Subtitle>
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
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  autoComplete="username"
                />
              </Field>

            
                <Label htmlFor="password">Password</Label>
                <PasswordWrapper>
                  <PasswordInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
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
              

              <Button type="submit" disabled={!canSubmit}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <FooterRow>
                <span>Use your admin account credentials.</span>
                <span style={{ opacity: 0.75 }}>v1.0</span>
              </FooterRow>
            </Form>
          </Card>

          <RightPanel>
            <PanelTop>
              <PanelBadge>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                Live Preview
              </PanelBadge>
              <div style={{ fontWeight: 950 }}>Payroll Suite</div>
            </PanelTop>

            <DividerSoft />

            <PanelBody>
              <PanelHeading>Fast, accurate payroll in minutes</PanelHeading>
              <PanelSub>
                Track employees, run payroll, generate reports and export payslips — all in one place.
              </PanelSub>

              <HeroImageWrap>
                <HeroImage src={MainLogo} alt="Preview" />
              </HeroImageWrap>

              <MiniStats>
                <Stat>
                  <StatLabel>Employees</StatLabel>
                  <StatValue>120</StatValue>
                </Stat>
                <Stat>
                  <StatLabel>Departments</StatLabel>
                  <StatValue>08</StatValue>
                </Stat>
                <Stat>
                  <StatLabel>Payroll Runs</StatLabel>
                  <StatValue>24</StatValue>
                </Stat>
              </MiniStats>
            </PanelBody>
          </RightPanel>
        </Grid>
      </Container>
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
