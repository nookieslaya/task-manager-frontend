import Button from "./Button.jsx";

const AuthForm = ({
  title,
  subtitle,
  onSubmit,
  buttonText,
  isLoading,
  error,
  success,
  children,
  footer,
  className = "",
}) => {
  return (
    <form
      className={`auth-form${className ? ` ${className}` : ""}`}
      onSubmit={onSubmit}
      noValidate
    >
      <header className="auth-form__header">
        <p className="auth-form__eyebrow">Task Manager</p>
        <h1>{title}</h1>
        <p className="auth-form__subtitle">{subtitle}</p>
      </header>

      <div className="auth-form__fields">{children}</div>

      {error ? <div className="auth-form__error">{error}</div> : null}
      {success ? <div className="auth-form__success">{success}</div> : null}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Please wait..." : buttonText}
      </Button>

      {footer ? <div className="auth-form__footer">{footer}</div> : null}
    </form>
  );
};

export default AuthForm;
