const AuthImagePanel = ({
  title,
  subtitle,
  badge,
  highlights = [],
  className = "",
}) => {
  return (
    <aside
      className={`auth-panel auth-panel--visual${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="auth-visual">
        {badge ? <span className="auth-visual__badge">{badge}</span> : null}
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {highlights.length ? (
          <div className="auth-visual__highlights">
            {highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default AuthImagePanel;
