const Input = ({ id, name, label, type = "text", className = "", ...rest }) => {
  return (
    <label
      className={`input-field${className ? ` ${className}` : ""}`}
      htmlFor={id}
    >
      <span>{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        {...rest}
      />
    </label>
  );
};

export default Input;
