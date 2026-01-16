import styled from "styled-components";
import MainLogo from "../assets/images.jpg";
import Logo from "../assets/progression.png";
import { useNavigate } from "react-router-dom";

type Size = string | number;

interface ImgProps {
  w?: Size;
  h?: Size;
}

const toCssSize = (v?: Size) =>
  v === undefined ? undefined : typeof v === "number" ? `${v}px` : v;

const Page = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #fff;
  position: relative;

  background: radial-gradient(1200px 600px at 15% 20%, rgba(255,255,255,0.18), transparent 60%),
              linear-gradient(135deg, #2b3a67 0%, #4b53c7 55%, #7b6cff 100%);
`;

const Shell = styled.div`
  height: 100vh;
  display: flex;
  overflow: hidden;
  /* align-items: center; */
    justify-content: space-between; 

  gap: 40px;
  padding: 48px 56px;
`;

const Left = styled.div`
  flex: 1;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BrandRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  width: fit-content;
`;

const BrandIcon = styled.img`
  width: 26px;
  height: 26px;
  object-fit: contain;
`;

const BrandText = styled.span`
  font-weight: 700;
  letter-spacing: 0.2px;
`;

const HeroTitle = styled.h1`
  margin: 18px 0 0;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 1.05;
  letter-spacing: -0.6px;
  font-weight: 900;
`;

const HeroSubtitle = styled.p`
  margin: 16px 0 0;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
  max-width: 640px;
`;

const CTArow = styled.div`
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  color: #111827;
  background: linear-gradient(90deg, #ffffff, #e9eeff);
  box-shadow: 0 14px 35px rgba(0,0,0,0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 45px rgba(0,0,0,0.32);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const SecondaryBtn = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  color: rgba(255,255,255,0.92);
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.20);
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255,255,255,0.16);
  }
`;

const MiniNote = styled.div`
  margin-top: 12px;
  color: rgba(255,255,255,0.72);
  font-size: 13px;
`;

const FeaturesRow = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: 14px 14px;
  border-radius: 16px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.16);
  backdrop-filter: blur(12px);
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const FeatureIcon = styled.img`
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 10px;
  background: rgba(255,255,255,0.14);
  padding: 6px;
`;

const FeatureTitle = styled.div`
  font-weight: 900;
  font-size: 14px;
`;

const FeatureText = styled.div`
  margin-top: 3px;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255,255,255,0.78);
`;

const RightPanel = styled.div`
  width: 420px;
  height: calc(100vh - 200px);
  border-radius: 22px;
  background: rgba(255,255,255,0.94);
  color: #111827;
  border: 1px solid rgba(255,255,255,0.55);
  box-shadow: 0 30px 80px rgba(0,0,0,0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 980px) {
    display: none;
  }
`;

const PanelTop = styled.div`
  padding: 18px 18px;
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
  background: #eef2ff;
  border: 1px solid #e5e7eb;
  font-weight: 800;
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
  font-weight: 900;
`;

const PanelSub = styled.div`
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
`;

const HeroImageWrap = styled.div`
  margin-top: 6px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const HeroImage = styled.img<ImgProps>`
  width: ${({ w }) => toCssSize(w) ?? "100%"};
  height: ${({ h }) => toCssSize(h) ?? "auto"};
  display: block;
  object-fit: cover;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
`;

const PanelStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
`;

const StatBox = styled.div`
  padding: 12px;
  border-radius: 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  font-weight: 700;
`;

const StatValue = styled.div`
  margin-top: 6px;
  font-weight: 900;
  font-size: 16px;
`;

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <Shell>
        {/* LEFT SIDE (Hero) */}
        <Left>
          <BrandRow>
            <BrandIcon src={Logo} alt="Brand" />
            <BrandText>EmpMonitor</BrandText>
          </BrandRow>

          <HeroTitle>
            Employee Payroll <br /> Management System
          </HeroTitle>

          <HeroSubtitle>
            A modern system to manage employees, run monthly payroll, generate deductions,
            export reports, and produce professional payslips — faster and with fewer errors.
          </HeroSubtitle>

          <CTArow>
            <PrimaryBtn type="button" onClick={() => navigate("/employees")}>
              Get Started →
            </PrimaryBtn>
            <SecondaryBtn type="button" onClick={() => navigate("/reports")}>
              View Reports
            </SecondaryBtn>
          </CTArow>

          <MiniNote>Secure • Accurate payroll • Reports • PDF Payslips</MiniNote>

          {/* FEATURES */}
          <FeaturesRow>
            <FeatureCard>
              <FeatureIcon src={Logo} alt="feature" />
              <div>
                <FeatureTitle>Smart Payroll</FeatureTitle>
                <FeatureText>
                  Auto calculates gross, deductions and net salary with transparent breakdown.
                </FeatureText>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon src={Logo} alt="feature" />
              <div>
                <FeatureTitle>Reports & Export</FeatureTitle>
                <FeatureText>
                  Department-wise summary + CSV export for payroll runs in one click.
                </FeatureText>
              </div>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon src={Logo} alt="feature" />
              <div>
                <FeatureTitle>PDF Payslips</FeatureTitle>
                <FeatureText>
                  Download payslips instantly for employees with month/year pay period.
                </FeatureText>
              </div>
            </FeatureCard>
          </FeaturesRow>
        </Left>

        {/* RIGHT SIDE (Preview Panel) */}
        <RightPanel>
          <PanelTop>
            <PanelBadge>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#22c55e", display: "inline-block" }} />
              Live Preview
            </PanelBadge>

            <div style={{ fontWeight: 900, color: "#111827" }}>Payroll Suite</div>
          </PanelTop>

          <Divider />

          <PanelBody>
            <PanelHeading>A case study preview</PanelHeading>
            <PanelSub>
              See how a clean dashboard looks with employee list, payroll run and reports.
            </PanelSub>

            <HeroImageWrap>
              <HeroImage src={MainLogo} alt="Preview" w="100%" h={240} />
            </HeroImageWrap>

            <PanelStats>
              <StatBox>
                <StatLabel>Employees</StatLabel>
                <StatValue>120</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>Departments</StatLabel>
                <StatValue>08</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>Payroll Runs</StatLabel>
                <StatValue>24</StatValue>
              </StatBox>
            </PanelStats>
          </PanelBody>
        </RightPanel>
      </Shell>
    </Page>
  );
}
