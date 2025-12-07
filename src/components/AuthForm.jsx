import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import "./AuthForm.css";

export default function AuthForm({ onSubmit, buttonText = "Submit", isLoading = false }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, setErrors);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
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
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
        className="auth-submit"
      >
        {isLoading ? "Processing..." : buttonText}
      </Button>
    </form>
  );
}
