import React from "react";
import "./Input.css";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  label = "",
  required = false,
  id = "",
  name = "",
}) {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input ${error ? "input--error" : ""}`}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
