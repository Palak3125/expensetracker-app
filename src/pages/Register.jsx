import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, facebookProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please log in instead.");
        navigate("/login");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else {
        alert(error.message);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      alert("Google sign-up failed: " + error.message);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      navigate("/");
    } catch (error) {
      alert("Facebook sign-up failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h1 className="login-brand">ExpenseTrack</h1>

        <label className="heading">Email</label>
        <input
          type="email"
          placeholder="mail@johndoe.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="heading">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">Sign Up</button>

        <p className="forgot" onClick={() => navigate("/login")}>
          Already have an account? <strong>Login</strong>
        </p>

        <div className="divider"><span></span>OR<span></span></div>

        <button type="button" className="google-btn" onClick={handleGoogleSignup}>
          <img src="/google.png" alt="Google" /> Sign up with Google
        </button>

        <button type="button" className="fb-btn" onClick={handleFacebookSignup}>
          <img src="/facebook.jpeg" alt="Facebook" /> Sign up with Facebook
        </button>
      </form>
    </div>
  );
};

export default Register;
