import styled from "styled-components";
import MainLogo from "../assets/images.jpg";
import { useNavigate } from "react-router";
import Logo from "../assets/progression.png";

type Size = string | number;

type DashboardCardProps = {
  title: string;
  data: string;
  hint?: string;
};

interface ImgProps {
  w: Size;
  h: Size;
}

const toCssSize = (v?: Size) =>
  v === undefined ? undefined : typeof v === "number" ? `${v}px` : v;

/* ============== Layout ============== */

const Page = styled.div`
  min-height: 100vh;
  padding: 28px 18px;
  background:
    radial-gradient(1200px 600px at 15% 20%, rgba(255,255,255,0.18), transparent 60%),
    linear-gradient(135deg, #2b3a67 0%, #4b53c7 55%, #7b6cff 100%);
`;

const Shell = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
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
  font-weight: 800;
  letter-spacing: 0.2px;
  color: rgba(255,255,255,0.92);
`;

const TopActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

/* ============== Hero ============== */

const HeroTitle = styled.h1`
  margin: 18px 0 0;
  font-size: clamp(34px, 4.2vw, 54px);
  line-height: 1.05;
  letter-spacing: -0.8px;
  font-weight: 950;
  color: #fff;
`;

const HeroSubtitle = styled.p`
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
  max-width: 720px;
`;

const CTArow = styled.div`
  margin-top: 18px;
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
  font-weight: 900;
  color: #111827;
  background: linear-gradient(90deg, #ffffff, #e9eeff);
  box-shadow: 0 14px 35px rgba(0,0,0,0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 45px rgba(0,0,0,0.32);
  }
  &:active { transform: translateY(0px); }
`;

const SecondaryBtn = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  color: rgba(255,255,255,0.92);
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.20);
  transition: background 0.15s ease;

  &:hover { background: rgba(255,255,255,0.16); }
`;

const MiniNote = styled.div`
  margin-top: 10px;
  color: rgba(255,255,255,0.72);
  font-size: 12.5px;
`;

/* ============== Main Grid ============== */

const DashboardWrapper = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  gap: 18px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* ============== Stat Cards ============== */

const DashboardCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardCardContainer = styled.div`
  background: rgba(255,255,255,0.96);
  border: 1px solid rgba(255,255,255,0.55);
  border-radius: 16px;
  padding: 14px 14px;
  box-shadow: 0 18px 55px rgba(0,0,0,0.18);
  backdrop-filter: blur(10px);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 22px 65px rgba(0,0,0,0.22);
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const DashboardCardTitle = styled.div`
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.2px;
  color: rgba(17, 24, 39, 0.70);
  text-transform: uppercase;
`;

const DashboardCardData = styled.div`
  font-size: 24px;
  font-weight: 950;
  color: #111827;
  line-height: 1.05;
`;

const DashboardCardHint = styled.div`
  font-size: 12.5px;
  color: rgba(17, 24, 39, 0.65);
`;

const CardBadge = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(79, 70, 229, 0.10);
  border: 1px solid rgba(79, 70, 229, 0.18);
  display: grid;
  place-items: center;
  font-weight: 950;
  color: #3730a3;
`;

/* ============== Features ============== */

const FeaturesRow = styled.div`
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
  font-weight: 950;
  font-size: 14px;
  color: rgba(255,255,255,0.95);
`;

const FeatureText = styled.div`
  margin-top: 3px;
  font-size: 13px;
  line-height: 1.45;
  color: rgba(255,255,255,0.78);
`;

/* ============== Right Panel ============== */

const RightPanel = styled.div`
  border-radius: 22px;
  background: rgba(255,255,255,0.94);
  color: #111827;
  border: 1px solid rgba(255,255,255,0.55);
  box-shadow: 0 30px 80px rgba(0,0,0,0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  position: sticky;
  top: 18px;

  @media (max-width: 980px) {
    position: static;
  }
`;

const PanelTop = styled.div`
  padding: 16px 18px;
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
  font-size: 15px;
  font-weight: 950;
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

/* ============== Components ============== */

const DashboardCard: React.FC<DashboardCardProps> = ({ title, data, hint }) => {
  return (
    <DashboardCardContainer>
      <CardText>
        <DashboardCardTitle>{title}</DashboardCardTitle>
        <DashboardCardData>{data}</DashboardCardData>
        {hint ? <DashboardCardHint>{hint}</DashboardCardHint> : null}
      </CardText>
      <CardBadge>↗</CardBadge>
    </DashboardCardContainer>
  );
};

/* ============== Page ============== */

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <Shell>
        <TopBar>
          <BrandRow>
            <BrandIcon src={Logo} alt="Brand" />
            <BrandText>Payroll Suite</BrandText>
          </BrandRow>

          <TopActions>
            <SecondaryBtn type="button" onClick={() => navigate("/reports")}>
              Reports
            </SecondaryBtn>
            <PrimaryBtn type="button" onClick={() => navigate("/employees")}>
              Open Employees →
            </PrimaryBtn>
          </TopActions>
        </TopBar>

        <HeroTitle>
          Employee Payroll <br /> Management System
        </HeroTitle>

        <HeroSubtitle>
          Manage employees, run payroll, generate deductions, export reports, and produce professional
          payslips — faster and with fewer errors.
        </HeroSubtitle>

        <MiniNote>Secure • Accurate payroll • Exports • PDF Payslips</MiniNote>

        <DashboardWrapper>
          <LeftColumn>
            <DashboardCardWrapper>
              <DashboardCard title="Total Employees" data="138" hint="Active workforce" />
              <DashboardCard title="Departments" data="12" hint="Across teams" />
              <DashboardCard title="Payroll Runs" data="5" hint="This month" />
              <DashboardCard title="Pending Approvals" data="2" hint="Needs review" />
            </DashboardCardWrapper>

            <CTArow>
              <PrimaryBtn type="button" onClick={() => navigate("/employees")}>
                Get Started →
              </PrimaryBtn>
              <SecondaryBtn type="button" onClick={() => navigate("/reports")}>
                View Reports
              </SecondaryBtn>
            </CTArow>

            <FeaturesRow>
              <FeatureCard>
                <FeatureIcon src={Logo} alt="feature" />
                <div>
                  <FeatureTitle>Smart Payroll</FeatureTitle>
                  <FeatureText>
                    Auto-calculates gross, deductions, and net salary with a clear breakdown.
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
          </LeftColumn>

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

              <div style={{ fontWeight: 950, color: "#111827" }}>Payroll Suite</div>
            </PanelTop>

            <Divider />

            <PanelBody>
              <PanelHeading>A case study preview</PanelHeading>
              <PanelSub>
                See how a clean dashboard looks with employee list, payroll run, and reports.
              </PanelSub>

              <HeroImageWrap>
                <HeroImage src={MainLogo} alt="Preview" w="100%" h={240} />
              </HeroImageWrap>
            </PanelBody>
          </RightPanel>
        </DashboardWrapper>
      </Shell>
    </Page>
  );
}
