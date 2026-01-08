import AuthImagePanel from "./AuthImagePanel.jsx";

const AuthLayout = ({
  children,
  imageTitle,
  imageSubtitle,
  imageBadge,
  imageHighlights = [],
  className = "",
}) => {
  return (
    <main className={`auth-shell${className ? ` ${className}` : ""}`}>
      <section className="auth-card">
        <div className="auth-panel auth-panel--form">{children}</div>
        <AuthImagePanel
          title={imageTitle}
          subtitle={imageSubtitle}
          badge={imageBadge}
          highlights={imageHighlights}
        />
      </section>
    </main>
  );
};

export default AuthLayout;
