import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SeleccionarMascota from '../pages/SeleccionarMascota';

vi.mock('../services/petService.js', () => ({
    petService: {
        obtenerTodas: vi.fn(),
    },
}));

vi.mock('../css/SeleccionarMascota.css', () => ({}));

vi.mock('../components/PetCard', () => ({
    default: ({ mascota, onVerMas }) => (
        <div data-testid="pet-card">
            <span>{mascota.name}</span>
            <button onClick={() => onVerMas(mascota)}>Ver detalles</button>
        </div>
    ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

import { petService } from '../services/petService.js';

const mascotasMock = [
    { id: 1, name: 'Bruno' },
    { id: 2, name: 'Luna' },
    { id: 3, name: 'Max' },
];

const renderComponent = () =>
    render(
        <MemoryRouter>
            <SeleccionarMascota />
        </MemoryRouter>
    );

const getSearchInput = () => screen.getByPlaceholderText(/buscar por nombre/i);

describe('SeleccionarMascota', () => {

    let user;

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
    });

    describe('Carga inicial', () => {

        it('muestra el spinner mientras carga las mascotas', () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            expect(screen.getByText(/cargando mascotas/i)).toBeInTheDocument();
        });

        it('llama a petService.obtenerTodas al montar el componente', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => {
                expect(petService.obtenerTodas).toHaveBeenCalledTimes(1);
            });
        });

        it('muestra el título y subtítulo tras cargar', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Editar mascota')).toBeInTheDocument();
                expect(screen.getByText(/selecciona la mascota/i)).toBeInTheDocument();
            });
        });

        it('muestra una card por cada mascota cargada', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getAllByTestId('pet-card')).toHaveLength(3);
            });
        });

        it('muestra el nombre de cada mascota', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Bruno')).toBeInTheDocument();
                expect(screen.getByText('Luna')).toBeInTheDocument();
                expect(screen.getByText('Max')).toBeInTheDocument();
            });
        });

        it('no muestra el spinner tras cargar', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.queryByText(/cargando mascotas/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Manejo de errores', () => {

        it('muestra mensaje de error si obtenerTodas falla', async () => {
            petService.obtenerTodas.mockRejectedValue(new Error('Fallo de red'));
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText(/no se pudieron cargar las mascotas/i)).toBeInTheDocument();
            });
        });

        it('no muestra cards si la carga falla', async () => {
            petService.obtenerTodas.mockRejectedValue(new Error('Fallo de red'));
            renderComponent();
            await waitFor(() => {
                expect(screen.queryByTestId('pet-card')).not.toBeInTheDocument();
            });
        });

        it('no muestra el buscador si la carga falla', async () => {
            petService.obtenerTodas.mockRejectedValue(new Error('Fallo de red'));
            renderComponent();
            await waitFor(() => {
                expect(screen.queryByPlaceholderText(/buscar por nombre/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Contador de mascotas', () => {

        it('muestra el total de mascotas registradas sin filtro activo', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('3 mascotas registradas')).toBeInTheDocument();
            });
        });

        it('muestra el contador filtrado al buscar', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            await user.type(getSearchInput(), 'B');
            expect(screen.getByText('1 de 3 mascotas')).toBeInTheDocument();
        });
    });

    describe('Búsqueda y filtrado', () => {

        it('muestra el input de búsqueda', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => {
                expect(getSearchInput()).toBeInTheDocument();
            });
        });

        it('filtra las mascotas al escribir en el buscador', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            await user.type(getSearchInput(), 'Luna');
            expect(screen.getAllByTestId('pet-card')).toHaveLength(1);
            expect(screen.getByText('Luna')).toBeInTheDocument();
        });

        it('el filtro no distingue mayúsculas de minúsculas', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            await user.type(getSearchInput(), 'luna');
            expect(screen.getByText('Luna')).toBeInTheDocument();
        });

        it('muestra el estado vacío si no hay resultados', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            await user.type(getSearchInput(), 'XYZ');
            expect(screen.queryByTestId('pet-card')).not.toBeInTheDocument();
            expect(screen.getByText(/no se encontraron mascotas con ese nombre/i)).toBeInTheDocument();
        });

        it('muestra el botón limpiar cuando hay texto en el buscador', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            await user.type(getSearchInput(), 'Bruno');
            expect(screen.getByLabelText('Limpiar')).toBeInTheDocument();
        });

        it('no muestra el botón limpiar cuando el buscador está vacío', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            expect(screen.queryByLabelText('Limpiar')).not.toBeInTheDocument();
        });

        it('limpia el filtro al hacer clic en el botón limpiar', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            await user.type(getSearchInput(), 'Bruno');
            expect(screen.getAllByTestId('pet-card')).toHaveLength(1);

            await user.click(screen.getByLabelText('Limpiar'));
            expect(getSearchInput().value).toBe('');
            expect(screen.getAllByTestId('pet-card')).toHaveLength(3);
        });

        it('restaura todas las mascotas al borrar el texto del buscador', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getByPlaceholderText(/buscar por nombre/i));

            await user.type(getSearchInput(), 'Luna');
            expect(screen.getAllByTestId('pet-card')).toHaveLength(1);

            await user.clear(getSearchInput());
            expect(screen.getAllByTestId('pet-card')).toHaveLength(3);
        });
    });

    describe('Selección de mascota', () => {

        it('navega a /mascotas/:id/editar al hacer clic en Ver detalles', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getAllByText('Ver detalles'));

            await user.click(screen.getAllByText('Ver detalles')[0]);
            expect(mockNavigate).toHaveBeenCalledWith('/mascotas/1/editar');
        });

        it('navega con el id correcto de cada mascota', async () => {
            petService.obtenerTodas.mockResolvedValue(mascotasMock);
            renderComponent();
            await waitFor(() => screen.getAllByText('Ver detalles'));

            await user.click(screen.getAllByText('Ver detalles')[1]);
            expect(mockNavigate).toHaveBeenCalledWith('/mascotas/2/editar');
        });
    });
});