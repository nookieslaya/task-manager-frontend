const Button = ({ children, type = "button", disabled = false, onClick }) => {
  return (
    <button
      className="button"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
