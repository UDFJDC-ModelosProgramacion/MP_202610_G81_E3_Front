import './../css/adoption.css';

const AdoptionForm = () => {
  return (
    <div className="adoption-wrapper">
      <div className="adoption-container">
        <h1 className="title">Solicitud de Adopción</h1>
        <p className="subtitle">
          Completa la información para aplicar a la adopción de esta
          mascota.
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
            <p>Refugio : ejemplo1</p>
          </div>

          {/* DERECHA */}
          <div className="right">
            <h2 className="form-title">Datos del Adoptante</h2>

            <input placeholder="Nombre completo" />
            <input placeholder="Correo electrónico" />
            <input placeholder="Teléfono de contacto" />
            <input placeholder="Dirección de residencia" />
            <textarea placeholder="Motivo de la adopción"></textarea>

            <div className="checkbox">
              <input type="checkbox" />
              <span>
                Acepto los términos y el compromiso de adopción.
              </span>
            </div>

            <div className="buttons">
              <button className="cancel">cancelar</button>
              <button className="submit">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionForm;
