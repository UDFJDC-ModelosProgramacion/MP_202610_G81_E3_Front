import React, { useState } from 'react';
import '../css/MedicalEvents.css';

const MedicalEvents = () => {
    // Estado para el formulario
    const [event, setEvent] = useState({
        tipo: '',
        veterinario: '',
        fecha: '',
        observaciones: ''
    });

    // Fecha máxima permitida (Hoy)
    const today = new Date().toISOString().split('T')[0];

    const handleSave = (e) => {
        e.preventDefault();
        // Criterio 4: Impedir fechas futuras
        if (event.fecha > today) {
            alert("Error: No se pueden registrar eventos con fechas futuras.");
            return;
        }
        console.log("Evento guardado y estado de salud actualizado a 'Al día'", event);
        alert("Evento médico registrado exitosamente.");
    };

    return (
        <div className="medical-container">
            <h2 className="medical-title">Registro de evento medicos</h2>
            
            <div className="medical-box">
                <div className="pet-sidebar">
                    <img src="https://via.placeholder.com/150" alt="Mascota" className="pet-img" />
                    <p className="label-blue">Nombre</p>
                    <div className="pet-name-badge">Lucas</div>
                </div>

                <form className="medical-form" onSubmit={handleSave}>
                    <div className="form-row-top">
                        <select 
                            className="select-custom" 
                            required 
                            onChange={(e) => setEvent({...event, tipo: e.target.value})}
                        >
                            <option value="">Tipo de evento (Vacuna, Consulta...)</option>
                            <option value="Vacuna">Vacuna</option>
                            <option value="Desparasitacion">Desparasitación</option>
                            <option value="Consulta General">Consulta General</option>
                        </select>
                    </div>

                    <div className="form-main-grid">
                        <div className="input-group">
                            <label className="label-blue">Veterinario</label>
                            <select 
                                className="input-field" 
                                required
                                onChange={(e) => setEvent({...event, veterinario: e.target.value})}
                            >
                                <option value="">Seleccione el veterinario</option>
                                <option value="Dr. Maldonado">Dr. Maldonado</option>
                                <option value="Dra. Lucia Hernández">Dra. Lucía Hernández</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="label-blue">Fecha de vacunación</label>
                            <input 
                                type="date" 
                                className="input-field" 
                                max={today} 
                                required 
                                onChange={(e) => setEvent({...event, fecha: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="observations-section">
                        <h3 className="label-blue">Observaciones</h3>
                        <textarea 
                            placeholder="Escribe alguna observación durante el proceso" 
                            className="text-area-custom"
                            onChange={(e) => setEvent({...event, observaciones: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="timeline-section">
                        <h3 className="label-blue">Timeline de Lucas</h3>
                        <div className="timeline-item">
                            <span>💉 10/04/2026 Rabia - Dr Maldonado</span>
                        </div>
                        <div className="timeline-item">
                            <span>🏥 11/03/2026 - Control General</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-save-medical">Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default MedicalEvents;