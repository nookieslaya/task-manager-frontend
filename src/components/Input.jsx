const Input = ({ id, name, label, type = "text", ...rest }) => {
  return (
    <label className="input-field" htmlFor={id}>
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
