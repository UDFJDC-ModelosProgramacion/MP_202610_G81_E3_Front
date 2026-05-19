import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shelterService } from "../services/ShelterService";
import "../css/EditShelter.css";

function EditShelter() {
    const navigate = useNavigate();

    const [shelters, setShelters] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: "",
        email: "",
        image: ""
    });
    useEffect(() => {
        loadShelters();
    }, []);

    const loadShelters = async () => {
        const result = await shelterService.getShelters();
        if (result.success) {
            setShelters(result.shelters);
        } else {
            console.error(result.mensaje);
        }
    };

    // Guardar informacion
    const handleSelectShelter = async (id) => {
        setSelectedId(id);
        if (!id) return;
        try {
            const result = await shelterService.getShelter(id);
            if (!result.success) {
                return;
            }
            const data = result.shelter;
            setFormData({
                name: data.name || "",
                city: data.city || "",
                address: data.address || "",
                email: data.email || "",
                image: data.image || ""
            });
            setErrors({});
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };
    
    // Enviar datos
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage("");

        // Validación front
        let newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "El nombre es obligatorio.";
        }
        if (!formData.city.trim()) {
            newErrors.city = "La ciudad es obligatoria.";
        }
        if (!formData.address.trim()) {
            newErrors.address = "La dirección es obligatoria.";
        }
        if (!formData.email.trim()) {
            newErrors.email = "El correo es obligatorio.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (!selectedId) {
            setMessage("Error: Debe seleccionar un refugio primero.");
            return;
        }

        try {
            const result = await shelterService.updateShelter(
                selectedId,
                formData
            );
            const response = {
                ok: result.ok
            };
            const data = result.data;

        // Manejo errores back.
        if (!response.ok) {
            const serverMsg =
                data.apierror?.message ||
                data.message ||
                data.detail ||
                "Error en la validación";
            let newErrors = {};

            const errorMap = [
                {
                    includes: "already a shelter with that name",
                    field: "name",
                    text: "Ya existe un refugio con ese nombre."
                },
                {
                    includes: "already a shelter with that email",
                    field: "email",
                    text: "Ya existe un refugio con ese correo."
                },
                {
                    includes: "name isn't valid",
                    field: "name",
                    text: "El nombre es obligatorio."
                },
                {
                    includes: "city isn't valid",
                    field: "city",
                    text: "La ciudad es obligatoria."
                },
                {
                    includes: "adress isn't valid",
                    field: "address",
                    text: "La dirección es obligatoria."
                },
                {
                    includes: "email isn't valid",
                    field: "email",
                    text: "El correo es obligatorio."
                },
                {
                    includes: "email format isn't valid",
                    field: "email",
                    text: "El formato del correo es inválido."
                }
            ];

            const foundError = errorMap.find(error =>
                serverMsg.toLowerCase().includes(error.includes)
            );
            if (foundError) {
                newErrors[foundError.field] = foundError.text;
                setErrors(newErrors);
            }
            else {
                setMessage(serverMsg);
            }
            return;
        }
                //Mensaje exito/error
                setMessage("Se ha actualizado el refugio. Redirigiendo a la pantalla de gestion...");
                setTimeout(() => navigate("/gestion"), 2000);
            } catch (error) {
                console.error(error);
                setMessage("Error: No se pudo conectar con el servidor.");
            }
        };

    return (
        <div className="edit-shelter-container">
            <h1>Actualizar información del refugio</h1>

            {/*Seleccionar refugio*/}
            <div className="form-group">
                <select
                    className="shelter-select-top"
                    value={selectedId}
                    onChange={(e) => handleSelectShelter(e.target.value)}
                >
                    <option value="">Seleccione el refugio</option>
                    {shelters.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {/*Formulario*/}
            <div className="edit-shelter-card">
                <form onSubmit={handleSubmit} noValidate>
                    <div className="edit-shelter-grid">
                        <div className="form-group">

                            <label>Nombre del refugio</label>
                            <input
                                type="text"
                                name="name"
                                className={errors.name ? "input-error" : ""}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                className={errors.city ? "input-error" : ""}
                                value={formData.city}
                                onChange={handleChange}
                            />
                            {errors.city && <span className="error-text">{errors.city}</span>}
                        </div>

                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                type="text"
                                name="address"
                                className={errors.address ? "input-error" : ""}
                                value={formData.address}
                                onChange={handleChange}
                            />
                            {errors.address && <span className="error-text">{errors.address}</span>}
                        </div>

                        <div className="form-group">
                            <label>Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className={errors.email ? "input-error" : ""}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        {/*Me falta mejorar esto de la imagen*/}
                        <div className="form-group full-width">
                            <label>URL de imagen</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="edit-shelter-actions">
                        <button type="button" className="btn-cancel" 
                        onClick={() => navigate(-1)}>Cancelar</button>
                        <button type="submit" className="btn-save" 
                        disabled={!selectedId}>Guardar Cambios</button>
                    </div>
                </form>

                {/*Mensaje final*/}
                {message && (
                    <div className={`status-message ${message.includes("Error") ? "error" : "success"}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditShelter;