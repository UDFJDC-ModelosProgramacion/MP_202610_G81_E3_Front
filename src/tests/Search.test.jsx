import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Search from '../pages/Search';

// Mocks.
vi.mock('../services/petService', () => ({
    petService: {
        obtenerTodas: vi.fn(),
        buscar: vi.fn(),
        buscarPorNombre: vi.fn(),
        buscarPorFiltros: vi.fn(),
    },
}));

vi.mock('../components/ShelterCard', () => ({
    default: ({ refugio, onVerMas }) => (
        <div data-testid="shelter-card">
            <span>{refugio.name}</span>
            <button onClick={onVerMas}>Ver más</button>
        </div>
    ),
}));

vi.mock('../components/PetCard', () => ({
    default: ({ mascota, onVerMas }) => (
        <div data-testid="pet-card">
            <span>{mascota.name}</span>
            <button onClick={onVerMas}>Ver más</button>
        </div>
    ),
}));

vi.mock('../components/SearchFilter', () => ({
    default: ({ onSearch }) => (
        <div data-testid="search-filter">
            <button onClick={() => onSearch(undefined, { filters: ['Perro'] })}>
                Filtrar Perros
            </button>
        </div>
    ),
}));

vi.mock('../css/Search.css', () => ({}));

import { petService } from '../services/petService';

// Datos de prueba.
const sheltersMock = [
    { id: 1, name: 'Huellitas', city: 'Bogotá', email: 'h@test.com', address: 'Calle 1', image: '' },
    { id: 2, name: 'Patitas Felices', city: 'Medellín', email: 'p@test.com', address: 'Calle 2', image: '' },
];

const petsMock = [
    { id: 1, name: 'Bruno', species: 'Perro', breed: 'Labrador', sex: 'Macho', age: 3, size: 'Grande', image: '' },
    { id: 2, name: 'Michi', species: 'Gato', breed: 'Siamés', sex: 'Hembra', age: 2, size: 'Pequeño', image: '' },
];

const renderComponent = () =>
    render(
        <MemoryRouter>
            <Search />
        </MemoryRouter>
    );

describe('Search Component Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => sheltersMock,
        });
        
        petService.obtenerTodas.mockResolvedValue(petsMock);
    });

    describe('Renderizado inicial', () => {

        it('muestra el título de la sección', async () => {
            renderComponent();
            expect(screen.getByText('Sección de búsqueda')).toBeInTheDocument();
        });

        it('muestra el select de tipo de búsqueda con opciones Refugios y Mascotas', async () => {
            renderComponent();
            expect(screen.getByText('Refugios')).toBeInTheDocument();
            expect(screen.getByText('Mascotas')).toBeInTheDocument();
        });

        it('muestra el input de búsqueda', async () => {
            renderComponent();
            expect(screen.getByPlaceholderText(/buscar refugio/i)).toBeInTheDocument();
        });

        it('carga y muestra refugios al iniciar', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Huellitas')).toBeInTheDocument();
                expect(screen.getByText('Patitas Felices')).toBeInTheDocument();
            });
        });

        it('muestra tarjetas de refugio por defecto', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getAllByTestId('shelter-card').length).toBe(2);
            });
        });
    });

    describe('Cambio de tipo de búsqueda', () => {

        it('cambia el placeholder al cambiar a Mascotas', async () => {
            renderComponent();
            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');
            expect(screen.getByPlaceholderText(/buscar mascota/i)).toBeInTheDocument();
        });

        it('muestra el filtro lateral al cambiar a Mascotas', async () => {
            renderComponent();
            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');
            await waitFor(() =>
                expect(screen.getByTestId('search-filter')).toBeInTheDocument()
            );
        });

        it('carga mascotas al cambiar a tipo Mascota', async () => {
            renderComponent();
            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');
            await waitFor(() => {
                expect(screen.getByText('Bruno')).toBeInTheDocument();
                expect(screen.getByText('Michi')).toBeInTheDocument();
            });
        });

        it('muestra tarjetas de mascota al cambiar a tipo Mascota', async () => {
            renderComponent();
            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');
            await waitFor(() => {
                expect(screen.getAllByTestId('pet-card').length).toBe(2);
            });
        });

        it('limpia los resultados al cambiar de tipo', async () => {
            renderComponent();
            await waitFor(() => expect(screen.getAllByTestId('shelter-card').length).toBe(2));

            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');

            await waitFor(() =>
                expect(screen.queryAllByTestId('shelter-card').length).toBe(0)
            );
            await waitFor(() => expect(screen.getAllByTestId('pet-card').length).toBe(2));
        });
    });

    describe('Búsqueda de refugios', () => {

        it('llama a la API con el keyword al escribir', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({ ok: true, json: async () => sheltersMock })
                .mockResolvedValueOnce({ ok: true, json: async () => [sheltersMock[0]] });

            renderComponent();
            await waitFor(() => expect(screen.getAllByTestId('shelter-card').length).toBe(2));

            const input = screen.getByPlaceholderText(/buscar refugio/i);
            await userEvent.type(input, 'Huellitas');

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('keyword=Huellitas')
                );
            });
        });

        it('muestra mensaje cuando no hay resultados', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({ ok: true, json: async () => sheltersMock })
                .mockResolvedValueOnce({ ok: true, json: async () => [] });

            renderComponent();
            await waitFor(() => expect(screen.getAllByTestId('shelter-card').length).toBe(2));

            const input = screen.getByPlaceholderText(/buscar refugio/i);
            await userEvent.type(input, 'XYZ');

            await waitFor(() =>
                expect(screen.getByText(/no se encontraron resultados/i)).toBeInTheDocument()
            );
        });

        it('muestra spinner mientras carga', async () => {
            let resolveFetch;
            global.fetch = vi.fn().mockImplementation(() =>
                new Promise((resolve) => { resolveFetch = resolve; })
            );

            renderComponent();
            expect(screen.getByText('Cargando resultados...')).toBeInTheDocument();

            resolveFetch({ ok: true, json: async () => sheltersMock });
            await waitFor(() =>
                expect(screen.queryByText('Cargando resultados...')).not.toBeInTheDocument()
            );
        });

        it('muestra mensaje de base de datos vacía si no hay refugios', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => [],
            });

            renderComponent();
            await waitFor(() =>
                expect(screen.getByText(/no hay refugios registrados en el sistema/i)).toBeInTheDocument()
            );
        });
    });

    describe('Búsqueda de mascotas', () => {

        const switchToMascotas = async () => {
            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');
            await waitFor(() => expect(screen.getAllByTestId('pet-card').length).toBe(2));
        };

        it('llama a buscarPorNombre al escribir en modo Mascota', async () => {
            petService.buscarPorNombre.mockResolvedValue([petsMock[0]]);
            renderComponent();
            await switchToMascotas();

            const input = screen.getByPlaceholderText(/buscar mascota/i);
            await userEvent.type(input, 'Bruno');

            await waitFor(() =>
                expect(petService.buscarPorNombre).toHaveBeenCalledWith('Bruno')
            );
        });

        it('llama a buscarPorFiltros al aplicar filtros sin keyword', async () => {
            petService.buscarPorFiltros.mockResolvedValue([petsMock[0]]);
            renderComponent();
            await switchToMascotas();

            await userEvent.click(screen.getByText('Filtrar Perros'));

            await waitFor(() =>
                expect(petService.buscarPorFiltros).toHaveBeenCalledWith(['Perro'])
            );
        });

        it('llama a buscar con keyword y filtros combinados', async () => {
            petService.buscarPorNombre.mockResolvedValue([petsMock[0]]);
            petService.buscar.mockResolvedValue([petsMock[0]]);
            renderComponent();
            await switchToMascotas();

            const input = screen.getByPlaceholderText(/buscar mascota/i);
            await userEvent.type(input, 'Bruno');
            await waitFor(() => expect(petService.buscarPorNombre).toHaveBeenCalled());

            // Al hacer clic, el mock pasará query=undefined y mantendrá el texto 'Bruno'
            await userEvent.click(screen.getByText('Filtrar Perros'));

            await waitFor(() =>
                expect(petService.buscar).toHaveBeenCalledWith('Bruno', ['Perro'])
            );
        });

        it('muestra mensaje de base de datos vacía si no hay mascotas', async () => {
            petService.obtenerTodas.mockResolvedValueOnce([]);
            renderComponent();

            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');

            await waitFor(() =>
                expect(screen.getByText(/no hay mascotas registrados en el sistema/i)).toBeInTheDocument()
            );
        });
    });

    describe('Modal de refugio', () => {

        it('abre el modal al hacer clic en Ver más de un refugio', async () => {
            renderComponent();
            await waitFor(() => expect(screen.getAllByTestId('shelter-card').length).toBe(2));

            await userEvent.click(screen.getAllByText('Ver más')[0]);

            await waitFor(() =>
                expect(screen.getByText('📧 Correo:')).toBeInTheDocument()
            );
        });

        it('cierra el modal al hacer clic en Cerrar', async () => {
            renderComponent();
            await waitFor(() => expect(screen.getAllByTestId('shelter-card').length).toBe(2));

            await userEvent.click(screen.getAllByText('Ver más')[0]);
            await waitFor(() => expect(screen.getByText('Cerrar')).toBeInTheDocument());

            await userEvent.click(screen.getByText('Cerrar'));
            await waitFor(() =>
                expect(screen.queryByText('Cerrar')).not.toBeInTheDocument()
            );
        });

        it('cierra el modal al hacer clic en el overlay', async () => {
            renderComponent();
            await waitFor(() => expect(screen.getAllByTestId('shelter-card').length).toBe(2));

            await userEvent.click(screen.getAllByText('Ver más')[0]);
            await waitFor(() => expect(screen.getByText('Cerrar')).toBeInTheDocument());

            const overlay = document.querySelector('.modal-overlay');
            await userEvent.click(overlay);

            await waitFor(() =>
                expect(screen.queryByText('Cerrar')).not.toBeInTheDocument()
            );
        });
    });

    describe('Modal de mascota', () => {

        const switchToMascotas = async () => {
            const select = screen.getByRole('combobox');
            await userEvent.selectOptions(select, 'Mascota');
            await waitFor(() => expect(screen.getAllByTestId('pet-card').length).toBe(2));
        };

        it('abre el modal al hacer clic en Ver más de una mascota', async () => {
            renderComponent();
            await switchToMascotas();

            await userEvent.click(screen.getAllByText('Ver más')[0]);

            await waitFor(() =>
                expect(screen.getByText('Volver a la búsqueda')).toBeInTheDocument()
            );
        });

        it('cierra el modal al hacer clic en Volver a la búsqueda', async () => {
            renderComponent();
            await switchToMascotas();

            await userEvent.click(screen.getAllByText('Ver más')[0]);
            await waitFor(() => expect(screen.getByText('Volver a la búsqueda')).toBeInTheDocument());

            await userEvent.click(screen.getByText('Volver a la búsqueda'));
            await waitFor(() =>
                expect(screen.queryByText('Volver a la búsqueda')).not.toBeInTheDocument()
            );
        });
    });
});