import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AddPet.css';

function AddPet() {
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [refugios, setRefugios] = useState([]);
    const [refugioSeleccionado, setRefugioSeleccionado] = useState("");
    const [errors, setErrors] = useState({});

    const today = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        sex: '',
        size: '',
        temperament: '',
        arriveToShelterDate: '',
        specificRequirements: ''
    });

    useEffect(() => {
        const fetchRefugios = async () => {
            try {
                const response = await fetch('http://localhost:8999/api/shelters');
                const data = await response.json();
                setRefugios(data);
            } catch (error) {
                console.error("Error al conectar con la API:", error);
            }
        };
        fetchRefugios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        
        if (!imagePreview) newErrors.image = "La fotografía es obligatoria";
        if (!refugioSeleccionado) newErrors.shelter = "Seleccione un refugio";
        
        // Validación de todos los campos del formulario.
        Object.keys(formData).forEach(key => {
            if (!formData[key]) {
                newErrors[key] = "Campo requerido";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const petToSave = {
            ...formData,
            age: parseInt(formData.age),
            size: parseFloat(formData.size),
            shelterName: refugioSeleccionado
        };

        try {
            const response = await fetch('http://localhost:8999/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petToSave)
            });

            if (response.ok) {
                alert("Registro guardado exitosamente.");
                navigate(-1);
            } else {
                alert("Error: No se pudo guardar la información en el servidor.");
            }
        } catch (error) {
            alert("Error de red: Verifique la conexión.");
        }
    };

    return (
        <div className="add-pet-container">
            <div className="add-pet-header">
                <div className="title-section">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        ← Regresar
                    </button>
                    <h1>Agregar mascota</h1>
                </div>

                <div className="shelter-selection">
                    <select 
                        className={`shelter-select ${errors.shelter ? 'input-error' : ''}`}
                        value={refugioSeleccionado} 
                        onChange={(e) => {
                            setRefugioSeleccionado(e.target.value);
                            setErrors({...errors, shelter: null});
                        }}
                    >
                        <option value="" disabled hidden>Seleccione el refugio asociado</option>
                        {refugios.map((r) => (
                            <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                    </select>
                    {errors.shelter && 
                    <span className="error-text">{errors.shelter}</span>}
                </div>
            </div>

            <form className="add-pet-form" onSubmit={handleSave} noValidate>
                {/*Identidad*/}
                <div className="image-upload-section">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setImagePreview(URL.createObjectURL(file));
                                setErrors({...errors, image: null});
                            }
                        }} 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                    />
                    <div 
                        className={`upload-box ${errors.image ? 'box-error' : ''}`} 
                        onClick={() => fileInputRef.current.click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} className="preview-img" alt="Vista previa" />
                        ) : (
                            <div className="upload-placeholder">
                                <span className="upload-icon">⬆</span>
                                <p>Cargar imagen</p>
                            </div>
                        )}
                    </div>
                    {errors.image && 
                    <span className="error-text">{errors.image}</span>}

                    <div className="main-name-input">
                        <label>Nombre de la mascota 
                          <span className="required-star">*</span>
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            className={errors.name ? 'input-error' : ''} 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Ej. Bruno, Michi" 
                        />
                        {errors.name && 
                        <span className="error-text">{errors.name}</span>}
                    </div>
                </div>

                <hr className="form-divider" />

                {/*Datos completos*/}
                <div className="form-data-grid">
                    <h3 className="form-section-title">Información General</h3>
                    
                    <div className="input-group">
                        <label>Especie 
                          <span className="required-star">*
                          </span>
                        </label>
                        <select name="species" 
                        className={errors.species ? 'input-error' : ''} 
                        value={formData.species} 
                        onChange={handleChange}>
                            <option value="" disabled hidden>Seleccionar especie</option>
                            <option>Perro</option>
                            <option>Gato</option>
                            <option>Conejo</option>
                            <option>Ave</option>
                            <option>Otro</option>
                        </select>
                        {errors.species && 
                        <span className="error-text">{errors.species}</span>}
                    </div>

                    <div className="input-group">
                        <label>Raza 
                          <span className="required-star">*</span>
                        </label>
                        <input type="text" name="breed" 
                        className={errors.breed ? 'input-error' : ''} 
                        value={formData.breed} 
                        onChange={handleChange} 
                        placeholder="Raza" />
                        {errors.breed && 
                        <span className="error-text">{errors.breed}</span>}
                    </div>

                    <div className="input-group">
                        <label>Sexo 
                          <span className="required-star">*</span>
                        </label>
                        <select name="sex" className={errors.sex ? 'input-error' : ''} 
                        value={formData.sex}
                        onChange={handleChange}>
                            <option value="" disabled hidden>Seleccionar sexo</option>
                            <option>Macho</option>
                            <option>Hembra</option>
                        </select>
                        {errors.sex && 
                        <span className="error-text">{errors.sex}</span>}
                    </div>

                    <div className="input-group">
                        <label>Edad (años) 
                          <span className="required-star">*</span>
                        </label>
                        <input type="number" name="age" 
                        className={errors.age ? 'input-error' : ''} 
                        value={formData.age} 
                        onChange={handleChange} min="0" max="50" placeholder="0" />
                        {errors.age && 
                        <span className="error-text">{errors.age}</span>}
                    </div>

                    <div className="input-group">
                        <label>Tamaño (cm) 
                          <span className="required-star">*</span>
                        </label>
                        <input type="number" name="size" 
                        className={errors.size ? 'input-error' : ''} 
                        value={formData.size} 
                        onChange={handleChange} step="0.1" min="1" max="250" placeholder="0.0" />
                        {errors.size && 
                        <span className="error-text">{errors.size}</span>}
                    </div>

                    <div className="input-group">
                        <label>Fecha de llegada 
                          <span className="required-star">*</span>
                        </label>
                        <input type="date" name="arriveToShelterDate" 
                        className={errors.arriveToShelterDate ? 'input-error' : ''} 
                        value={formData.arriveToShelterDate} 
                        onChange={handleChange} max={today} />
                        {errors.arriveToShelterDate && 
                        <span className="error-text">{errors.arriveToShelterDate}</span>}
                    </div>

                    <h3 className="form-section-title">Personalidad y Cuidados</h3>

                    <div className="input-group full-width">
                        <label>Temperamento 
                          <span className="required-star">*</span>
                        </label>
                        <input type="text" name="temperament" 
                        className={errors.temperament ? 'input-error' : ''} 
                        value={formData.temperament} 
                        onChange={handleChange} 
                        placeholder="Ej: Tranquilo, juguetón..." />
                        {errors.temperament && <span className="error-text">{errors.temperament}</span>}
                    </div>

                    <div className="input-group full-width">
                        <label>Requerimientos específicos 
                          <span className="required-star">*</span>
                        </label>
                        <textarea name="specificRequirements" 
                        className={errors.specificRequirements ? 'input-error' : ''} 
                        value={formData.specificRequirements} 
                        onChange={handleChange} 
                        placeholder="Requerimientos especiales..." />
                        {errors.specificRequirements && 
                        <span className="error-text">{errors.specificRequirements}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-save">Guardar registro</button>
                </div>
            </form>
        </div>
    );
}

export default AddPet;