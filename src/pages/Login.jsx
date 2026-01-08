import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import AuthForm from "../components/AuthForm.jsx";
import Input from "../components/Input.jsx";
import { login, fetchMe, setToken } from "../api/auth.js";

const Login = ({ onAuth }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(formState);
      setToken(data.token);
      const me = await fetchMe(data.token);
      console.log("Authenticated user:", me);
      if (onAuth) {
        onAuth(me.user);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageBadge="Productivity Suite"
      imageTitle="Plan projects with confidence."
      imageSubtitle="Secure access, smart ownership, and a clean workflow that scales with your team."
      imageHighlights={[
        "Role-based access",
        "Project ownership",
        "Shared task boards",
      ]}
    >
      <AuthForm
        title="Welcome back"
        subtitle="Sign in to manage your projects and tasks."
        onSubmit={handleSubmit}
        buttonText="Sign in"
        isLoading={isLoading}
        error={error}
        footer={
          <p>
            New here? <Link to="/register">Create an account</Link>
          </p>
        }
      >
        <Input
          id="login-email"
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
          id="login-password"
          name="password"
          label="Password"
          type="password"
          value={formState.password}
          onChange={handleChange}
          placeholder="Minimum 8 characters"
          autoComplete="current-password"
          minLength={8}
          required
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;
