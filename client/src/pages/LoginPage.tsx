import { useState } from "react";
import styled from "styled-components";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const Shell = styled.div`
 height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: "Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #fff;
  position: relative;

  background: radial-gradient(1200px 600px at 15% 20%, rgba(255,255,255,0.18), transparent 60%),
              linear-gradient(135deg, #2b3a67 0%, #4b53c7 55%, #7b6cff 100%);
`;
const LoginContent = styled.div`
  height: 100vh;
  display: flex;
  overflow: hidden;
  align-items: center;
    justify-content: center; 

  gap: 40px;
  padding: 48px 56px;
`;
const LoginBox = styled.div`
  width: 700px;
  padding: 40px;
  height:500px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;
const Input = styled.input`
  padding: 12px  ;
  border-radius: 8px;
  border: solid 1px #ccc;
  font-size: 16px;
  color: aliceblue;
  
`;
const PasswordInput = styled(Input)`
  padding-right: 44px;      /* ✅ space for icon */
  flex: 1;                  /* ✅ stretch inside flex wrapper */
`;
const Button = styled.button`
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  background-color: #fcfcfc;
  color: #0b37b9;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #fbfbfb;
    opacity: 0.8;
    border: 1px solid #0b37b9;
  }
`;
const PasswordWrapper = styled.div`
  position: relative;
  display: flex;    
  border-radius: 8px;
  align-items: center;
  width: 100%;
  flex-direction: row;
`;
const IconButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0b37b9;

  &:hover {
    opacity: 0.75;
  }
`;
export default function LoginPage() {
      const navigate = useNavigate();

    const [showPassowrd, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: "",
        password: "",
        email:""
    });

    async function login() {
        if (!form.username || !form.password) {
            alert("Username and password are required");
            return;
        }
        console.log("shshshssh", form);
        setLoading(true);
        try {
            const  res  = await api.post("/login", {
      username: form.username,
      email:form.username,
      password: form.password,
    });

    localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("user", JSON.stringify(res.data.user));
navigate("/dashboard", { replace: true });
        } catch (e) {
            

            alert(
                e?.response?.data?.error?.message ||
                e?.response?.data?.error ||
                "Failed to load employees"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Shell>
            <LoginContent>
                <LoginBox>
                    <h1>Enter your credentials</h1>
                    <div style={{ height: "40px" }}></div>
                    <LoginForm onSubmit={(e) => {
                        e.preventDefault();

                        console.log("Login form submitted", e.target.name.value, e.target.password.value);

                        login();
                    }}>
                        <Input name="username" type="text" placeholder="Username" onChange={(e) =>
                            setForm((prev) => ({ ...prev, username: e.target.value }))
                        } />
                        <PasswordWrapper>
                            <PasswordInput name="password" type={showPassowrd ? "text" : "password"} placeholder="Password" onChange={(e) =>
                                setForm((prev) => ({ ...prev, password: e.target.value }))
                            } />
                            <IconButton
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassowrd ? "Hide password" : "Show password"}
                            >
                                {showPassowrd ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </IconButton>
                        </PasswordWrapper>
                        <div style={{ height: "80px" }}></div>
                        <Button type="submit">{loading ? "Loading ...." : "Login"}</Button>
                    </LoginForm>
                </LoginBox>
            </LoginContent>
        </Shell>
    );



}

function EyeOpenIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
                d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function EyeClosedIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
                d="M3 3l18 18"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M6.4 6.4C3.6 8.6 1.5 12 1.5 12S5.5 19 12 19c1.8 0 3.4-.4 4.8-1"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M14.9 5.2C13.9 5 13 5 12 5c-1.1 0-2.1.2-3 .5"
                stroke="currentColor"
                strokeWidth="1.6"
            />
        </svg>
    );
}
function setToast(arg0: any) {
    throw new Error("Function not implemented.");
}

