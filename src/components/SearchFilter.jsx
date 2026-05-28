import React, { useState } from 'react';
import '../css/SearchFilter.css';

const SearchFilter = ({ onSearch }) => {
    // Filtros agrupados por categorías
    const filterGroups = {
        especie: [
            { id: 1, name: 'Gato' },
            { id: 2, name: 'Perro' },
            { id: 5, name: 'Otros' }
        ],
        edad: [
            { id: 3, name: 'Cachorros' },  // 0 - 2 años
            { id: 4, name: 'Jovenes' },  // 2 - 5 años
            { id: 5, name: 'Adultos' },  // 5 - 10 años   
        ],
        tamanio: [
            { id: 5, name: 'Pequeño' },
            { id: 6, name: 'Mediano' },
            { id: 7, name: 'Grande' }
        ],
        espacioRequerido: [
            { id: 8, name: 'Casa' },
            { id: 9, name: 'Apartamento' }
        ]
    };

    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleFilterSelect = (filterName) => {
        setSelectedFilters(prev => {
            const isSelected = prev.includes(filterName);
            const newFilters = isSelected
                ? prev.filter(f => f !== filterName)
                : [...prev, filterName];

            // Llamar a la función de búsqueda del padre
            if (onSearch) {
                onSearch('', { filters: newFilters });
            }

            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters([]);
        if (onSearch) {
            onSearch('', { filters: [] });
        }
    };

    return (
        <div className="search-filter-container">
            <div className="filter-header">
                <h3>Filtros</h3>
                {selectedFilters.length > 0 && (
                    <button
                        type="button"
                        className="clear-filters"
                        onClick={clearAllFilters}
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* Grupo: Especie */}
            <div className="filter-group">
                <div className="filter-group-title">Especie</div>
                <div className="filter-buttons">
                    {filterGroups.especie.map((filter) => (
                        <button
                            key={filter.id}
                            className={`filter-btn ${selectedFilters.includes(filter.name) ? 'active' : ''}`}
                            onClick={() => handleFilterSelect(filter.name)}
                        >
                            <span className="filter-icon">{filter.icon}</span>
                            {filter.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grupo: Edad */}
            <div className="filter-group">
                <div className="filter-group-title">Edad</div>
                <div className="filter-buttons">
                    {filterGroups.edad.map((filter) => (
                        <button
                            key={filter.id}
                            className={`filter-btn ${selectedFilters.includes(filter.name) ? 'active' : ''}`}
                            onClick={() => handleFilterSelect(filter.name)}
                        >
                            <span className="filter-icon">{filter.icon}</span>
                            {filter.name}
                        </button>
                    ))}
                </div>
            </div>
            {/* Grupo: tamanio */}
            <div className="filter-group">
                <div className="filter-group-title">Tamaño</div>
                <div className="filter-buttons">
                    {filterGroups.tamanio.map((filter) => (
                        <button
                            key={filter.id}
                            className={`filter-btn ${selectedFilters.includes(filter.name) ? 'active' : ''}`}
                            onClick={() => handleFilterSelect(filter.name)}
                        >
                            <span className="filter-icon">{filter.icon}</span>
                            {filter.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grupo: espacio Requerido */}
            <div className="filter-group">
                <div className="filter-group-title">Espacio Requerido</div>
                <div className="filter-buttons">
                    {filterGroups.espacioRequerido.map((filter) => (
                        <button
                            key={filter.id}
                            className={`filter-btn ${selectedFilters.includes(filter.name) ? 'active' : ''}`}
                            onClick={() => handleFilterSelect(filter.name)}
                        >
                            <span className="filter-icon">{filter.icon}</span>
                            {filter.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
