// FormField.jsx — campo de texto genérico con label y error
export const FormField = ({ label, id, error, required, children }) => (
  <div className="form-field">
    <label htmlFor={id} className="form-label">
      {label}
      {required && <span className="required-mark">*</span>}
    </label>
    {children}
    {error && <span className="field-error">{error}</span>}
  </div>
);

// TextInput.jsx — <input type="text" | "number">
export const TextInput = ({
  id,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  min,
  max,
  disabled = false,
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    max={max}
    disabled={disabled}
    className="form-input"
  />
);

// SelectInput.jsx — <select> con opciones
export const SelectInput = ({ id, name, value, onChange, options, disabled = false }) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="form-input form-select"
  >
    <option value="">-- Seleccionar --</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// TextareaInput.jsx — <textarea>
export const TextareaInput = ({
  id,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  disabled = false,
}) => (
  <textarea
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    disabled={disabled}
    className="form-input form-textarea"
  />
);

// ReadOnlyField.jsx — campo de solo lectura (para arriveToShelterDate)
export const ReadOnlyField = ({ label, value }) => (
  <div className="form-field form-field--readonly">
    <span className="form-label">{label}</span>
    <span className="form-input form-input--readonly">{value ?? "—"}</span>
  </div>
);

// StatusMessage.jsx — mensaje de éxito o error global
export const StatusMessage = ({ type, message }) => {
  if (!message) return null;
  return (
    <div className={`status-message status-message--${type}`} role="alert">
      <span className="status-icon">{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
};