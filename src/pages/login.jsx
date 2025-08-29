import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, facebookProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); 
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); 
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-brand">ExpenseTrack</h1>

        <label className="heading">Email</label>
        <input
          type="email"
          placeholder="mail@johndoe.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="heading">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-btn">Login</button>

        <p className="forgot">Forgot Password?</p>

        <div className="divider"><span></span>OR<span></span></div>

        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          <img src="/google.png" alt="Google" /> Sign in with Google
        </button>

        <button type="button" className="fb-btn" onClick={handleFacebookLogin}>
          <img src="/facebook.jpeg" alt="Facebook" /> Sign in with Facebook
        </button>

        <p className="forgot" onClick={() => navigate("/register")}>
          Don’t have an account? Sign up
        </p>
      </form>
    </div>
  );
};

export default Login;
