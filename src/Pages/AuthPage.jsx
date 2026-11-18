

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import heroImage from "../assets/1000_F_545401328_b4dkjsn5CCNpwF5fLmIeSI7zHeFGLB90.jpg";
import "../Style/Auth.css";

import {
  registerUser,
  loginUser
} from "../services/authService";

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
  const handleSubmit = (event) => {
  event.preventDefault();

  setMessage("");

  if (isLogin) {
    const result = loginUser(email, password);

   if (result.success) {
  setMessage("Login successful! Welcome to Bharat Bytes.");
  setMessageType("success");

  setTimeout(() => {
    navigate("/");
  }, 3500);
} else {
      setMessage(result.message);
      setMessageType("error");
    }

  } else {
    const result = registerUser(name, email, password);

    if (result.success) {
      setMessage("Account created successfully! Please login.");
      setMessageType("success");

      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setMessage(result.message);
      setMessageType("error");
    }
  }
};
  return (
    <div className="auth-page">

      {/* Left side: Heritage branding */}
      <section className="auth-visual">

  <div className="brand">
    <h1>Bharat Bytes</h1>
    <p>Digital Heritage Explorer</p>
  </div>

  <div className="visual-content">
    <h2>
      Our Heritage
      <br />
      Our Stories
      <br />
      <span>Your Journey</span>
    </h2>

    <p>
      Discover India's rich cultural heritage
      through immersive stories, stunning
      places and timeless traditions.
    </p>

    <div className="feature">
      <span>⌂</span>
      <div>
        <h3>Explore</h3>
        <p>Iconic monuments & hidden gems</p>
      </div>
    </div>

    <div className="feature">
      <span>▤</span>
      <div>
        <h3>Learn</h3>
        <p>Stories, history & culture</p>
      </div>
    </div>

    <div className="feature">
      <span>❋</span>
      <div>
        <h3>Preserve</h3>
        <p>Our heritage for future generations</p>
      </div>
    </div>
  </div>

  <div className="heritage-image">
    <img src={heroImage} alt="Indian heritage temple" />
  </div>

</section>

      {/* Right side: Login and Register */}
      <section className="auth-form-side">
        <div className="auth-top">
          New here?{" "}
          <button
            onClick={() => setIsLogin(false)}
          >
            Create an account →
          </button>
        </div>

        <div className="auth-card">
          <div className="ornament">❀</div>

          <h2>
            {isLogin ? "Welcome Back!" : "Create Account"}
          </h2>

          <p className="auth-subtitle">
            {isLogin
              ? "Login to continue your heritage journey."
              : "Join us to explore India's heritage."}
          </p>

          <div className="auth-tabs">
            <button
               type="button"
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

        <form onSubmit={handleSubmit}>
        {message && (
  <div className={`auth-message ${messageType}`}>

    {messageType === "success" ? (
      <>
        <div className="success-icon">✓</div>

        <h3>Welcome to Bharat Bytes!</h3>

        <p>Login Successful</p>

        <small>
          Your heritage journey begins here.
          Explore India's stories and traditions.
        </small>
      </>
    ) : (
      <p>{message}</p>
    )}

  </div>
)}
            {!isLogin && (
                <input
                 type="text"
                 placeholder="Full name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 required
               />
              )}

          <input
  type="email"
  placeholder="Email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

            <div className="password-field">
             <input
  type={showPassword ? "text" : "password"}
  placeholder="Password (min. 8 characters)"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  minLength={8}
  required
/>

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {isLogin && (
              <div className="form-options">
                <label>
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() =>
                    alert("Password reset will be added later.")
                  }
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button className="submit-btn" type="submit">
              {isLogin ? "Login →" : "Create Account →"}
            </button>
          </form>

          <div className="or-divider">
            <span></span>
            OR
            <span></span>
          </div>

          <button
            className="google-btn"
            type="button"
            onClick={() =>
              alert("Google login will be added later.")
            }
          >
            <strong>G</strong> Continue with Google
          </button>

          <div className="security-note">
            <span>🛡️</span>
            <div>
              <p>Your data is safe with us.</p>
              <small>
                We keep your information secure and private.
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AuthPage;
