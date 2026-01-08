import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import AuthForm from "../components/AuthForm.jsx";
import Input from "../components/Input.jsx";
import { register } from "../api/auth.js";

const Register = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await register(formState);
      setSuccess("Account created. You can sign in now.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageBadge="Team-ready Security"
      imageTitle="Invite teammates with precision."
      imageSubtitle="Admins can assign project access instantly while every action stays traceable."
      imageHighlights={[
        "Admin approvals",
        "Shared access",
        "Audit friendly",
      ]}
    >
      <AuthForm
        title="Create your account"
        subtitle="Start organizing projects in minutes."
        onSubmit={handleSubmit}
        buttonText="Create account"
        isLoading={isLoading}
        error={error}
        success={success}
        footer={
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        }
      >
        <Input
          id="register-name"
          name="name"
          label="Name"
          type="text"
          value={formState.name}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
          required
        />
        <Input
          id="register-email"
          name="email"
          label="Email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
        <Input
          id="register-password"
          name="password"
          label="Password"
          type="password"
          value={formState.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Register;
