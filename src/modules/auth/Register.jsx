import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.username);
      navigate("/intro");
    } catch (error) {
      const message = error.message || "Registration failed. Please try again.";
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
      setApiError(error.message || "Google sign-up failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Join Secrizz Valley</h1>
          <p className="auth-subtitle">Create your new account</p>

          {apiError && <div className="auth-error-banner">{apiError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              id="username"
              name="username"
              type="text"
              label="Username"
              placeholder="Choose a name"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="auth-submit"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </Button>
          </form>

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
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
