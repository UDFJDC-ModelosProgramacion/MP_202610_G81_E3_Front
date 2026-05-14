import { useState } from "react";
import { createAdoption } from "../services/adoptionService";
import "./../css/Adoption.css";

const AdoptionForm = () => {
  const [formData, setFormData] = useState({
    adopterId: "",
    petId: 1,
    status: "IN_TRIAL",
    adoptionDate: new Date().toISOString().split("T")[0],
    trialEndDate: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.adopterId) {
      alert("Por favor ingresa el ID del adoptante");
      return;
    }

    try {
      const payload = {
        ...formData,
        adopterId: Number(formData.adopterId),
        petId: Number(formData.petId),
      };

      const response = await createAdoption(payload);
      console.log("Adopción creada:", response);
      alert("Solicitud registrada correctamente");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error al registrar adopción: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="adoption-wrapper">
      <div className="adoption-container">
        <h1 className="title">Solicitud de Adopción</h1>
        <p className="subtitle">
          Completa la información para aplicar a la adopción de esta mascota.
        </p>

        <div className="card">
          {/* IZQUIERDA */}
          <div className="left">
            <img
              src="https://images.unsplash.com/photo-1619983081563-430f63602796"
              alt="Perro"
              className="pet-image"
            />
            <h2 className="pet-name">Lucas</h2>
            <p>Perro</p>
            <p>Golden Retriever</p>
            <p>Refugio: ejemplo1</p>
          </div>

          {/* DERECHA */}
          <div className="right">
            <h2 className="form-title">Datos del Adoptante</h2>

            <input
              name="adopterId"
              placeholder="ID del adoptante"
              value={formData.adopterId}
              onChange={handleChange}
            />

            <input name="email" placeholder="Correo electrónico" />
            <input name="phone" placeholder="Teléfono de contacto" />
            <input name="address" placeholder="Dirección de residencia" />
            <textarea name="reason" placeholder="Motivo de la adopción" />

            <div className="checkbox">
              <input type="checkbox" />
              <span>Acepto los términos y el compromiso de adopción.</span>
            </div>

            <div className="buttons">
              <button className="cancel">Cancelar</button>
              <button className="submit" onClick={handleSubmit}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionForm;