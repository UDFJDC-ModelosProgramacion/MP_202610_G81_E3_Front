import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petService } from '../services/PetService.js';
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
        requiredSpace: '',
        temperament: '',
        arriveToShelterDate: '',
        specificRequirements: ''
    });

    useEffect(() => {
        const fetchRefugios = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/shelters');
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

        // Estrudtura del Pet DTO
        const petToSave = {
            name: formData.name,
            species: formData.species,
            breed: formData.breed,
            age: parseInt(formData.age),
            sex: formData.sex,
            size: formData.size,
            requiredSpace : formData.requiredSpace,
            arriveToShelterDate: formData.arriveToShelterDate,
            temperament: formData.temperament,
            specificRequirements: formData.specificRequirements,
            shelter: {
                id: parseInt(refugioSeleccionado)
            },
            image: imagePreview
        };

        try {
            await petService.crear(petToSave);
            alert("¡Registro guardado exitosamente!");
            navigate(-1);
        } catch (error) {
            console.error("Detalle del fallo al guardar:", error);
            alert(`Error: No se pudo registrar la mascota. ${error.message}`);
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
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    {errors.shelter && 
                    <span className="error-text">{errors.shelter}</span>}
                </div>
            </div>

            <form className="add-pet-form" onSubmit={handleSave} noValidate>
                {/* Sección de carga de imagen */}
                <div className="image-upload-section">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    // Base64 para preview.
                                    setImagePreview(reader.result);
                                    setErrors({...errors, image: null});
                                };
                                reader.readAsDataURL(file);
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
                        <label>Nombre de la mascota <span className="required-star">*</span></label>
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

                {/* Información General */}
                <div className="form-data-grid">
                    <h3 className="form-section-title">Información General</h3>
                    
                    <div className="input-group">
                        <label>Especie <span className="required-star">*</span></label>
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
                        <label>Raza <span className="required-star">*</span></label>
                        <input type="text" name="breed" 
                        className={errors.breed ? 'input-error' : ''} 
                        value={formData.breed} 
                        onChange={handleChange} 
                        placeholder="Raza" />
                        {errors.breed && 
                        <span className="error-text">{errors.breed}</span>}
                    </div>

                    <div className="input-group">
                        <label>Sexo <span className="required-star">*</span></label>
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
                        <label>Edad (años) <span className="required-star">*</span></label>
                        <input type="number" name="age" 
                        className={errors.age ? 'input-error' : ''} 
                        value={formData.age} 
                        onChange={handleChange} min="0" max="50" placeholder="0" />
                        {errors.age && 
                        <span className="error-text">{errors.age}</span>}
                    </div>

                    <div className="input-group">
                        <label>Tamaño <span className="required-star">*</span></label>
                        <select
                            name="size"
                            className={errors.size ? 'input-error' : ''}
                            value={formData.size}
                            onChange={handleChange}
                        >
                            <option value="" disabled hidden>Seleccionar tamaño</option>
                            <option value="Pequeño">Pequeño</option>
                            <option value="Mediano">Mediano</option>
                            <option value="Grande">Grande</option>
                        </select>
                        {errors.size && 
                        <span className="error-text">{errors.size}</span>}
                    </div>

                    <div className="input-group">
                        <label>Espacio Requerido <span className="required-star">*</span></label>
                        <select
                            name="requiredSpace"
                            className={errors.requiredSpace ? 'input-error' : ''}
                            value={formData.requiredSpace}
                            onChange={handleChange}
                        >
                            <option value="" disabled hidden>Seleccionar espacio</option>
                            <option value="Casa">Casa</option>
                            <option value="Apartamento">Apartamento</option>
                        </select>
                        {errors.requiredSpace && 
                        <span className="error-text">{errors.requiredSpace}</span>}
                    </div>

                    <div className="input-group">
                        <label>Fecha de llegada <span className="required-star">*</span></label>
                        <input type="date" name="arriveToShelterDate" 
                        className={errors.arriveToShelterDate ? 'input-error' : ''} 
                        value={formData.arriveToShelterDate} 
                        onChange={handleChange} max={today} />
                        {errors.arriveToShelterDate && 
                        <span className="error-text">{errors.arriveToShelterDate}</span>}
                    </div>

                    <h3 className="form-section-title">Personalidad y Cuidados</h3>

                    <div className="input-group full-width">
                        <label>Temperamento <span className="required-star">*</span></label>
                        <input type="text" name="temperament" 
                        className={errors.temperament ? 'input-error' : ''} 
                        value={formData.temperament} 
                        onChange={handleChange} 
                        placeholder="Ej: Tranquilo, juguetón..." />
                        {errors.temperament && <span className="error-text">{errors.temperament}</span>}
                    </div>

                    <div className="input-group full-width">
                        <label>Requerimientos específicos <span className="required-star">*</span></label>
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