import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import EditShelter from '../pages/EditShelter';

vi.mock('../services/ShelterService', () => ({
    shelterService: {
        getShelters: vi.fn(),
        getShelter: vi.fn(),
        updateShelter: vi.fn(),
    },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../css/EditShelter.css', () => ({}));

import { shelterService } from '../services/ShelterService';

const sheltersMock = [
    { id: 1, name: 'Huellitas' },
    { id: 2, name: 'Patitas Felices' },
];

const shelterDetailMock = {
    id: 1,
    name: 'Huellitas',
    city: 'Bogotá',
    address: 'Calle 123',
    email: 'huellitas@test.com',
    image: 'data:image/png;base64,abc123',
};

const renderComponent = () =>
    render(
        <MemoryRouter>
            <EditShelter />
        </MemoryRouter>
    );

const getInput = (name) => document.querySelector(`input[name="${name}"]`);

const selectShelter = async (user) => {
    await waitFor(() => screen.getByText('Huellitas'));
    const select = screen.getAllByRole('combobox')[0];
    await user.selectOptions(select, '1');
    await waitFor(() => {
        expect(getInput('name').value).toBe('Huellitas');
    });
};

describe('EditShelter', () => {

    let user;

    beforeEach(() => {
        vi.clearAllMocks();
        user = userEvent.setup();
        shelterService.getShelters.mockResolvedValue({
            success: true,
            shelters: sheltersMock,
        });
        shelterService.getShelter.mockResolvedValue({
            success: true,
            shelter: shelterDetailMock,
        });
    });

    describe('Renderizado inicial', () => {

        it('muestra el título correctamente', () => {
            renderComponent();
            expect(screen.getByText('Actualizar información del refugio')).toBeInTheDocument();
        });

        it('carga y muestra la lista de refugios en el select', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Huellitas')).toBeInTheDocument();
                expect(screen.getByText('Patitas Felices')).toBeInTheDocument();
            });
        });

        it('el botón Guardar Cambios está deshabilitado si no hay refugio seleccionado', () => {
            renderComponent();
            expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeDisabled();
        });

        it('muestra el placeholder de imagen cuando no hay preview', () => {
            renderComponent();
            expect(screen.getByText('Cargar imagen')).toBeInTheDocument();
        });
    });

    describe('Selección de refugio', () => {

        it('carga los datos del refugio al seleccionarlo', async () => {
            renderComponent();
            await selectShelter(user);

            expect(getInput('name').value).toBe('Huellitas');
            expect(getInput('city').value).toBe('Bogotá');
            expect(getInput('address').value).toBe('Calle 123');
            expect(getInput('email').value).toBe('huellitas@test.com');
        });

        it('muestra la imagen actual del refugio al seleccionarlo', async () => {
            renderComponent();
            await selectShelter(user);

            const img = screen.getByAltText('Vista previa del refugio');
            expect(img).toBeInTheDocument();
            expect(img.src).toContain('data:image/png;base64');
        });

        it('habilita el botón Guardar Cambios al seleccionar un refugio', async () => {
            renderComponent();
            await selectShelter(user);

            expect(screen.getByRole('button', { name: /guardar cambios/i })).not.toBeDisabled();
        });
    });

    describe('Validaciones del formulario', () => {

        it('muestra error si el nombre está vacío al enviar', async () => {
            renderComponent();
            await selectShelter(user);

            await user.clear(getInput('name'));
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
            );
        });

        it('muestra error si la ciudad está vacía al enviar', async () => {
            renderComponent();
            await selectShelter(user);

            await user.clear(getInput('city'));
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('La ciudad es obligatoria.')).toBeInTheDocument()
            );
        });

        it('muestra error si la dirección está vacía al enviar', async () => {
            renderComponent();
            await selectShelter(user);

            await user.clear(getInput('address'));
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('La dirección es obligatoria.')).toBeInTheDocument()
            );
        });

        it('muestra error si el correo está vacío al enviar', async () => {
            renderComponent();
            await selectShelter(user);

            await user.clear(getInput('email'));
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument()
            );
        });

        it('limpia el error del campo cuando el usuario empieza a escribir', async () => {
            renderComponent();
            await selectShelter(user);

            const nameInput = getInput('name');
            await user.clear(nameInput);
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
            );

            await user.type(nameInput, 'N');

            await waitFor(() =>
                expect(screen.queryByText('El nombre es obligatorio.')).not.toBeInTheDocument()
            );
        });
    });

    describe('Envío del formulario', () => {

        it('muestra mensaje de éxito al actualizar correctamente', async () => {
            shelterService.updateShelter.mockResolvedValue({ ok: true, data: shelterDetailMock });

            renderComponent();
            await selectShelter(user);
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText(/se ha actualizado el refugio/i)).toBeInTheDocument()
            );
        });

        it('muestra error del servidor si el nombre ya existe', async () => {
            shelterService.updateShelter.mockResolvedValue({
                ok: false,
                data: { message: 'There is already a shelter with that name' },
            });

            renderComponent();
            await selectShelter(user);
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('Ya existe un refugio con ese nombre.')).toBeInTheDocument()
            );
        });

        it('muestra error del servidor si el correo ya existe', async () => {
            shelterService.updateShelter.mockResolvedValue({
                ok: false,
                data: { message: 'There is already a shelter with that email' },
            });

            renderComponent();
            await selectShelter(user);
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('Ya existe un refugio con ese correo.')).toBeInTheDocument()
            );
        });

        it('muestra error de conexión si el servidor falla', async () => {
            shelterService.updateShelter.mockRejectedValue(new Error('Network error'));

            renderComponent();
            await selectShelter(user);
            await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

            await waitFor(() =>
                expect(screen.getByText('Error: No se pudo conectar con el servidor.')).toBeInTheDocument()
            );
        });
    });

    describe('Navegación', () => {

        it('navega hacia atrás al hacer clic en Cancelar', async () => {
            renderComponent();
            await user.click(screen.getByRole('button', { name: /cancelar/i }));
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    describe('Carga de imagen', () => {

        it('muestra preview al cargar una imagen desde archivo', async () => {
            const mockResult = 'data:image/png;base64,nuevaimagen123';

            class MockFileReader {
                constructor() { this.result = mockResult; this.onloadend = null; }
                readAsDataURL() { setTimeout(() => this.onloadend && this.onloadend(), 0); }
            }
            vi.stubGlobal('FileReader', MockFileReader);

            renderComponent();

            const fileInput = document.querySelector('input[type="file"]');
            const file = new File(['imagen'], 'foto.png', { type: 'image/png' });
            fireEvent.change(fileInput, { target: { files: [file] } });

            await waitFor(() => {
                const img = screen.getByAltText('Vista previa del refugio');
                expect(img).toBeInTheDocument();
                expect(img.src).toContain('data:image/png;base64');
            });
            vi.unstubAllGlobals();
        });
    });
});