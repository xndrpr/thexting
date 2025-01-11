import React, { useContext, useEffect } from "react";
import m from "./SignIn.module.sass";
import { ApiService } from "../../../services/ApiService";
import { Context } from "../../..";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@assets/icons/google-icon.svg?react";

export default function SignIn() {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = {
      email,
      password,
    };
    const res = await ApiService.signIn(body);
    if (res) {
      localStorage.setItem("token", res.data.data);
      navigate("/app");
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await ApiService.getSession();

        if (session) {
          store.setAuth(true);
          store.setUser({
            email: session.data.data.email,
            id: session.data.data.id,
            nickname: session.data.data.nickname,
          });
          navigate("/app");
        } else {
          store.setAuth(false);
        }
      } catch (e: any) {
        store.setAuth(false);
      }
    };
    checkAuth();
  }, [navigate, store]);

  return (
    <div className={m.SignIn}>
      <form className={m.Form} onSubmit={handleSubmit}>
        <p className={m.Title}>Sign In</p>
        <div className={m.Item}>
          <label htmlFor="email">Email *</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            type="email"
            id="email"
          />
        </div>

        <div className={m.Item}>
          <label htmlFor="password">Password *</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="●●●●●●●●●●"
            type="password"
            id="password"
          />
        </div>
        <button className={m.Button} type="submit">
          Sign in
        </button>
        <p className={m.SignUpLink}>
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </form>
      <p className={m.OrContinue}>or continue with</p>
      <button className={m.Google}>
        <a href="/sign-up">
          <GoogleIcon />
          Google
        </a>
      </button>
    </div>
  );
}
