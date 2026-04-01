import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthForm from "../../components/AuthForm";
import Button from "../../components/Button";
import "./auth.css";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (formData, setErrors) => {
    setIsLoading(true);
    setApiError("");

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await signIn(formData.email, formData.password);
      navigate("/intro");
    } catch (error) {
      const message = error.message || "Login failed. Please try again.";
      setApiError(message);
      setErrors({ email: message });
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate("/intro");
    } catch (error) {
      setApiError(error.message || "Google sign-in failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Login to Secrizz Valley</h1>
          <p className="auth-subtitle">Welcome back, adventurer!</p>

          {apiError && <div className="auth-error-banner">{apiError}</div>}

          <AuthForm onSubmit={handleSubmit} buttonText="Login" isLoading={isLoading} />

          <div className="auth-divider"></div>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="auth-google-btn"
          >
            Continue with Google
          </Button>

          <div className="auth-divider"></div>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
