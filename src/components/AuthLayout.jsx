import AuthImagePanel from "./AuthImagePanel.jsx";

const AuthLayout = ({
  children,
  imageTitle,
  imageSubtitle,
  imageBadge,
  imageHighlights = [],
}) => {
  return (
    <main className="auth-shell">
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
