import { useEffect, useState } from "react";
import { getAdoptions, updateAdoptionStatus } from "../services/adoptionService";
import "../css/GestionAdopciones.css";

const estadoLabel = {
  IN_TRIAL: "Pendiente",
  COMPLETED: "Aprobado",
  RETURNED: "Devuelto",
  CANCELLED: "Cancelado",
};

const GestionAdopciones = () => {
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarAdopciones();
  }, []);

  const cargarAdopciones = async () => {
    try {
      setLoading(true);
      const data = await getAdoptions();
      setAdopciones(data);
    } catch (err) {
      setError("Error al cargar las adopciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEstado = async (id, nuevoEstado) => {
    try {
      await updateAdoptionStatus(id, nuevoEstado);
      await cargarAdopciones();
      alert("Estado actualizado correctamente");
    } catch (err) {
      alert("Error al actualizar el estado");
    }
  };

  const adopcionesFiltradas = adopciones.filter((a) =>
    String(a.id).includes(busqueda) ||
    (a.adoptionDate && a.adoptionDate.includes(busqueda))
  );

  if (loading) return <p className="gestion-empty">Cargando adopciones...</p>;
  if (error) return <p className="gestion-empty">{error}</p>;

  return (
    <div className="gestion-wrapper">
      <div className="gestion-header">
        <h1 className="gestion-titulo">Gestión de Solicitudes</h1>
        <input
          className="gestion-buscador"
          placeholder="🔍 Buscar por mascota o adoptante..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="gestion-tabla-wrapper">
        {adopcionesFiltradas.length === 0 ? (
          <p className="gestion-empty">No hay adopciones registradas.</p>
        ) : (
          <table className="gestion-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Acción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {adopcionesFiltradas.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.adoptionDate}</td>
                  <td>{estadoLabel[a.status] || a.status}</td>
                  <td>
                    <select
                      className="gestion-select"
                      defaultValue={a.status}
                      onChange={(e) => handleEstado(a.id, e.target.value)}
                    >
                      <option value="IN_TRIAL">Pendiente</option>
                      <option value="COMPLETED">Aprobado</option>
                      <option value="RETURNED">Devuelto</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GestionAdopciones;