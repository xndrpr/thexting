import React, { useContext, useEffect, useState } from "react";
import m from "./SignUp.module.sass";
import { ApiService } from "../../../api/api.service";
import { Context } from "../../../app";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@assets/icons/google.svg?react";

export default function SignUp() {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [birthday, setBirthday] = React.useState("");

  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedOption(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = {
      email,
      password,
      nickname,
      dateOfBirth: birthday,
      gender: selectedOption === "Male" ? 0 : 1,
    };
    const res = await ApiService.signUp(body);
    if (res) {
      localStorage.setItem("token", res.data);
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
    <div className={m.SignUp}>
      <form className={m.Form} onSubmit={handleSubmit}>
        <p className={m.Title}>Sign Up</p>
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
          <label htmlFor="email">Nickname *</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname..."
            type="text"
            id="email"
          />
        </div>
        <div className={m.Items}>
          <div className={m.Item}>
            <label htmlFor="birthday">Date of birthday *</label>
            <input
              type="date"
              id="birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              }
            />
          </div>
          <div className={m.Item}>
            <label htmlFor="gender">Gender*</label>
            <div className={m.Gender} id="gender">
              <label
                className={`${selectedOption === "Male" ? m.CheckedM : m.M}`}
              >
                <input
                  type="radio"
                  value="Male"
                  checked={selectedOption === "Male"}
                  onChange={onValueChange}
                />
                Male
              </label>
              <label
                className={`${selectedOption === "Female" ? m.CheckedF : m.F}`}
              >
                <input
                  type="radio"
                  value="Female"
                  checked={selectedOption === "Female"}
                  onChange={onValueChange}
                />
                Female
              </label>
            </div>
          </div>
        </div>
        <div className={m.Items}>
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
          <div className={m.Item}>
            <label htmlFor="confirm">Confirm Password *</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="●●●●●●●●●●"
              type="password"
              id="confirm"
            />
          </div>
        </div>
        <button className={m.Button} type="submit">
          Create My Account
        </button>
        <p className={m.SignInLink}>
          Already have an account? <a href="/sign-in">Sign In</a>
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
