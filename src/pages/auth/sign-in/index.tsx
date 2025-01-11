import React, { useContext, useEffect } from "react";
import styles from "./styles.module.sass";
import { ApiService } from "../../../api/api.service";
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
    <div className={styles.SignIn}>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <p className={styles.Title}>Sign In</p>
        <div className={styles.Item}>
          <label htmlFor="email">Email *</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            type="email"
            id="email"
          />
        </div>

        <div className={styles.Item}>
          <label htmlFor="password">Password *</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="●●●●●●●●●●"
            type="password"
            id="password"
          />
        </div>
        <button className={styles.Button} type="submit">
          Sign in
        </button>
        <p className={styles.SignUpLink}>
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </form>
      <p className={styles.OrContinue}>or continue with</p>
      <button className={styles.Google}>
        <a href="/sign-up">
          <GoogleIcon />
          Google
        </a>
      </button>
    </div>
  );
}
