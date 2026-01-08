const Modal = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  className = "",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`modal${className ? ` ${className}` : ""}`} role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__card">
        <header className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" type="button" onClick={onClose}>
            X
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
};

export default Modal;
