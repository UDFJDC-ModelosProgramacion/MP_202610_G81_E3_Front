// ActualizarMascota.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { petService } from "../services/petService";
import {
  FormField,
  TextInput,
  SelectInput,
  TextareaInput,
  ReadOnlyField,
  StatusMessage,
} from "../components/PetForm";
import "../css/ActualizarMascota.css";

// ─── Opciones de los selects ───────────────────────────────────────────────
const SPECIES_OPTIONS = [
  { value: "Perro", label: "Perro" },
  { value: "Gato", label: "Gato" },
  { value: "Conejo", label: "Conejo" },
  { value: "Ave", label: "Ave" },
  { value: "Reptil", label: "Reptil" },
  { value: "Otro", label: "Otro" },
];

const SEX_OPTIONS = [
  { value: "Macho", label: "Macho" },
  { value: "Hembra", label: "Hembra" },
];

const SIZE_OPTIONS = [
  { value: "Pequeño", label: "Pequeño" },
  { value: "Mediano", label: "Mediano" },
  { value: "Grande", label: "Grande" },
];

const TEMPERAMENT_OPTIONS = [
  { value: "Tranquilo", label: "Tranquilo" },
  { value: "Juguetón", label: "Juguetón" },
  { value: "Agresivo", label: "Agresivo" },
  { value: "Tímido", label: "Tímido" },
  { value: "Sociable", label: "Sociable" },
  { value: "Independiente", label: "Independiente" },
];

// ─── Estado inicial del formulario ────────────────────────────────────────
const INITIAL_FORM = {
  name: "",
  species: "",
  breed: "",
  age: "",
  sex: "",
  size: "",
  temperament: "",
  specificRequirements: "",
};

// ─── Validaciones ──────────────────────────────────────────────────────────
const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "El nombre es obligatorio.";
  if (!form.species) errors.species = "La especie es obligatoria.";
  if (form.age !== "" && (isNaN(form.age) || Number(form.age) < 0))
    errors.age = "La edad debe ser un número positivo.";
  return errors;
};

// ─── Componente principal ──────────────────────────────────────────────────
export default function ActualizarMascota() {
  const { id } = useParams();           // /mascotas/:id/editar
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [arriveDate, setArriveDate] = useState(null); // solo lectura
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ── Carga inicial de la mascota ──────────────────────────────────────────
  const loadPet = useCallback(async () => {
    try {
      setLoading(true);
      const pet = await petService.obtenerPorId(id);
      setArriveDate(pet.arriveToShelterDate);
      setForm({
        name: pet.name ?? "",
        species: pet.species ?? "",
        breed: pet.breed ?? "",
        age: pet.age ?? "",
        sex: pet.sex ?? "",
        size: pet.size ?? "",
        temperament: pet.temperament ?? "",
        specificRequirements: pet.specificRequirements ?? "",
      });
    } catch (err) {
      setStatus({ type: "error", message: `No se pudo cargar la mascota: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPet();
  }, [loadPet]);

  // ── Manejador de cambios ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al editar
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ── Envío del formulario ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        age: form.age !== "" ? Number(form.age) : null,
      };
      await petService.actualizar(id, payload);
      setStatus({ type: "success", message: "¡Mascota actualizada correctamente!" });
      // Opcional: redirigir después de 1.5 s
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setStatus({ type: "error", message: `Error al actualizar: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Renderizado ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="am-loading">
        <span className="am-spinner" />
        Cargando información de la mascota…
      </div>
    );
  }

  return (
    <div className="am-page">
      <div className="am-card">
        {/* Encabezado */}
        <header className="am-header">
          <button className="am-back-btn" onClick={() => navigate(-1)} aria-label="Volver">
            &#8592;
          </button>
          <div>
            <h1 className="am-title">Actualizar mascota</h1>
            <p className="am-subtitle">Modifica la información del perfil</p>
          </div>
        </header>

        {/* Mensaje de estado global */}
        <StatusMessage type={status.type} message={status.message} />

        <form onSubmit={handleSubmit} noValidate className="am-form">
          {/* ── Sección: Información básica ── */}
          <section className="am-section">
            <h2 className="am-section-title">Información básica</h2>
            <div className="am-grid am-grid--2">
              <FormField label="Nombre" id="name" error={errors.name} required>
                <TextInput
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Firulais"
                />
              </FormField>

              <FormField label="Especie" id="species" error={errors.species} required>
                <SelectInput
                  id="species"
                  name="species"
                  value={form.species}
                  onChange={handleChange}
                  options={SPECIES_OPTIONS}
                />
              </FormField>

              <FormField label="Raza" id="breed" error={errors.breed}>
                <TextInput
                  id="breed"
                  name="breed"
                  value={form.breed}
                  onChange={handleChange}
                  placeholder="Ej: Labrador"
                />
              </FormField>

              <FormField label="Edad (años)" id="age" error={errors.age}>
                <TextInput
                  id="age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  min={0}
                  max={50}
                />
              </FormField>
            </div>
          </section>

          {/* ── Sección: Características físicas ── */}
          <section className="am-section">
            <h2 className="am-section-title">Características físicas</h2>
            <div className="am-grid am-grid--2">
              <FormField label="Sexo" id="sex" error={errors.sex}>
                <SelectInput
                  id="sex"
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  options={SEX_OPTIONS}
                />
              </FormField>

              <FormField label="Tamaño" id="size" error={errors.size}>
                <SelectInput
                  id="size"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  options={SIZE_OPTIONS}
                />
              </FormField>
            </div>
          </section>

          {/* ── Sección: Comportamiento y cuidados ── */}
          <section className="am-section">
            <h2 className="am-section-title">Comportamiento y cuidados</h2>
            <div className="am-grid am-grid--2">
              <FormField label="Temperamento" id="temperament" error={errors.temperament}>
                <SelectInput
                  id="temperament"
                  name="temperament"
                  value={form.temperament}
                  onChange={handleChange}
                  options={TEMPERAMENT_OPTIONS}
                />
              </FormField>

              {/* Campo de solo lectura */}
              <ReadOnlyField
                label="Fecha de ingreso al refugio"
                value={arriveDate}
              />
            </div>

            <FormField
              label="Requerimientos específicos"
              id="specificRequirements"
              error={errors.specificRequirements}
            >
              <TextareaInput
                id="specificRequirements"
                name="specificRequirements"
                value={form.specificRequirements}
                onChange={handleChange}
                placeholder="Dieta especial, medicamentos, alergias, necesidades de espacio…"
                rows={4}
              />
            </FormField>
          </section>

          {/* ── Acciones ── */}
          <div className="am-actions">
            <button
              type="button"
              className="am-btn am-btn--secondary"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="am-btn am-btn--primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="am-spinner am-spinner--sm" />
                  Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}