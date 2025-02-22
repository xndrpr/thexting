import m from "./main.module.sass";

export default function Main() {
  return (
    <div className={m.Main}>
      <div className={m.HeaderContainer}>
        <div className={m.Header}>
          <p className={m.Logo}>
            <span className={m.Highlight}>The</span>xting
          </p>
          <div className={m.Auth}>
            <a href="/sign-in">
              <button className={m.SignInBtn}>Sign in</button>
            </a>

            <a href="/sign-up">
              <button className={m.SignUpBtn}>Sign Up</button>
            </a>
          </div>
        </div>
      </div>
      <div className={m.Content}>
        <div className={m.Title}>
          <h1>Tired of Lorem?</h1>
        </div>
        <div className={m.Text}>
          <p>
            Try thexting. <b>A modern way of texting</b>, Lorem ipsum dolor sit
            amet consectetur adipisicing elit.
          </p>
        </div>
        <a className={m.GetStartedBtnLink} href="/sign-up">
          <button className={m.GetStartedBtn}>Get started </button>
        </a>
      </div>
      <div className={m.Footer}>
        <p className={m.Text}>
          <span className={m.Highlight}>The</span>xting &copy; 2024
        </p>
      </div>
    </div>
  );
}
