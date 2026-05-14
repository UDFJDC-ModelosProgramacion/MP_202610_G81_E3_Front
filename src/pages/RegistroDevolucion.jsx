import { useState, useEffect } from "react";
import { createReturn } from "../services/returnPetService";
import { getAdoptions } from "../services/adoptionService";
import "../css/RegistroDevolucion.css";

const RegistroDevolucion = () => {
  const [adopciones, setAdopciones] = useState([]);
  const [formData, setFormData] = useState({
    adoptionId: "",
    returnDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAdoptions().then(setAdopciones).catch(console.error);
  }, []);

  const validar = () => {
    const nuevosErrors = {};
    if (!formData.adoptionId) nuevosErrors.adoptionId = "Selecciona una adopción";
    if (!formData.returnDate) nuevosErrors.returnDate = "La fecha es obligatoria";
    if (!formData.reason.trim()) nuevosErrors.reason = "El motivo es obligatorio";

    const hoy = new Date().toISOString().split("T")[0];
    if (formData.returnDate > hoy) nuevosErrors.returnDate = "La fecha no puede ser futura";

    setErrors(nuevosErrors);
    return Object.keys(nuevosErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    try {
      await createReturn({
        adoptionId: Number(formData.adoptionId),
        returnDate: formData.returnDate,
        reason: formData.reason,
      });
      alert("Devolución registrada correctamente");
      setFormData({ adoptionId: "", returnDate: "", reason: "" });
      setErrors({});
    } catch (error) {
      alert("Error al registrar la devolución: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="devolucion-wrapper">
      <h1 className="devolucion-titulo">Registro de Devolución</h1>
      <p className="devolucion-subtitulo">
        Localice la adopción original para registrar el retorno de la mascota.
      </p>

      <div className="devolucion-card">
        <select
          name="adoptionId"
          className={`devolucion-select ${errors.adoptionId ? "input-error" : ""}`}
          value={formData.adoptionId}
          onChange={handleChange}
        >
          <option value="">Seleccionar Adopción</option>
          {adopciones.map((a) => (
            <option key={a.id} value={a.id}>
              Adopción #{a.id} — {a.adoptionDate}
            </option>
          ))}
        </select>
        {errors.adoptionId && <span className="error-msg">{errors.adoptionId}</span>}

        <h2 className="devolucion-subtitulo-card">Detalles de la devolución</h2>

        <input
          type="date"
          name="returnDate"
          className={`devolucion-input ${errors.returnDate ? "input-error" : ""}`}
          value={formData.returnDate}
          onChange={handleChange}
        />
        {errors.returnDate && <span className="error-msg">{errors.returnDate}</span>}

        <input
          type="text"
          name="healthStatus"
          placeholder="Estado de salud"
          className="devolucion-input"
          onChange={handleChange}
        />

        <textarea
          name="reason"
          placeholder="Motivo de la devolución"
          className={`devolucion-textarea ${errors.reason ? "input-error" : ""}`}
          value={formData.reason}
          onChange={handleChange}
        />
        {errors.reason && <span className="error-msg">{errors.reason}</span>}

        <div className="devolucion-botones">
          <button className="btn-cancelar" onClick={() => setFormData({ adoptionId: "", returnDate: "", reason: "" })}>
            Cancelar
          </button>
          <button className="btn-registrar" onClick={handleSubmit}>
            Registrar Devolución
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroDevolucion;