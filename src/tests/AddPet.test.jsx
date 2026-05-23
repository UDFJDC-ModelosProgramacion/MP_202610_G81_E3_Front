import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AddPet from '../pages/AddPet';

// Mocks.
vi.mock('../services/PetService.js', () => ({
    petService: {
        crear: vi.fn(),
    },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../css/AddPet.css', () => ({}));

// Cargar refugios
const sheltersMock = [
    { id: 1, name: 'Huellitas' },
    { id: 2, name: 'Patitas Felices' },
];

import { petService } from '../services/PetService.js';

const renderComponent = () =>
    render(
        <MemoryRouter>
            <AddPet />
        </MemoryRouter>
    );

const getInput = (name) => document.querySelector(`input[name="${name}"]`);
const getSelect = (name) => document.querySelector(`select[name="${name}"]`);
const getTextarea = (name) => document.querySelector(`textarea[name="${name}"]`);

// Llenar campos.
const fillForm = async () => {
    await userEvent.type(getInput('name'), 'Bruno');
    await userEvent.selectOptions(getSelect('species'), 'Perro');
    await userEvent.type(getInput('breed'), 'Labrador');
    await userEvent.selectOptions(getSelect('sex'), 'Macho');
    await userEvent.type(getInput('age'), '3');
    await userEvent.selectOptions(getSelect('size'), 'Grande');
    await userEvent.selectOptions(getSelect('requiredSpace'), 'Casa');
    await userEvent.type(getInput('arriveToShelterDate'), '2024-01-15');
    await userEvent.type(getInput('temperament'), 'Tranquilo');
    await userEvent.type(getTextarea('specificRequirements'), 'Ninguno');
};

// ══════════════════════════════════════════════════════════════════════════════
describe('AddPet', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => sheltersMock,
        });
        global.alert = vi.fn();
    });

    describe('Renderizado inicial', () => {

        it('muestra el título correctamente', () => {
            renderComponent();
            expect(screen.getByText('Agregar mascota')).toBeInTheDocument();
        });

        it('muestra el botón de regresar', () => {
            renderComponent();
            expect(screen.getByText(/regresar/i)).toBeInTheDocument();
        });

        it('muestra el placeholder de imagen', () => {
            renderComponent();
            expect(screen.getByText('Cargar imagen')).toBeInTheDocument();
        });

        it('carga y muestra los refugios en el select', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Huellitas')).toBeInTheDocument();
                expect(screen.getByText('Patitas Felices')).toBeInTheDocument();
            });
        });

        it('muestra el botón Guardar registro', () => {
            renderComponent();
            expect(screen.getByRole('button', { name: /guardar registro/i })).toBeInTheDocument();
        });
    });

    // Validaciones.
    describe('Validaciones del formulario', () => {

        it('muestra error si no se selecciona refugio', async () => {
            renderComponent();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));
            await waitFor(() =>
                expect(screen.getByText('Seleccione un refugio')).toBeInTheDocument()
            );
        });

        it('muestra error si no se carga imagen', async () => {
            renderComponent();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));
            await waitFor(() =>
                expect(screen.getByText('La fotografía es obligatoria')).toBeInTheDocument()
            );
        });

        it('muestra error en campos de texto vacíos', async () => {
            renderComponent();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));
            await waitFor(() => {
                // Todos los campos requeridos muestran error si no se llenan.
                const errors = screen.getAllByText('Campo requerido');
                expect(errors.length).toBeGreaterThan(0);
            });
        });

        it('muestra error si el nombre de la mascota está vacío', async () => {
            renderComponent();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));
            await waitFor(() => {
                expect(getInput('name')).toHaveClass('input-error');
            });
        });

        it('limpia el error del nombre al escribir', async () => {
            renderComponent();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));
            await waitFor(() => expect(getInput('name')).toHaveClass('input-error'));

            await userEvent.type(getInput('name'), 'Bruno');
            await waitFor(() => expect(getInput('name')).not.toHaveClass('input-error'));
        });

        it('limpia el error del refugio al seleccionarlo', async () => {
            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));

            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));
            await waitFor(() =>
                expect(screen.getByText('Seleccione un refugio')).toBeInTheDocument()
            );

            const shelterSelect = screen.getAllByRole('combobox')[0];
            await userEvent.selectOptions(shelterSelect, '1');
            await waitFor(() =>
                expect(screen.queryByText('Seleccione un refugio')).not.toBeInTheDocument()
            );
        });
    });

    // Carga de imagenes de mascota.
    describe('Carga de imagen', () => {

        it('muestra preview al cargar una imagen', async () => {
            const mockResult = 'data:image/png;base64,imagentest123';

            class MockFileReader {
                constructor() {
                    this.result = mockResult;
                    this.onloadend = null;
                }
                readAsDataURL() {
                    setTimeout(() => {
                        this.onloadend && this.onloadend();
                    }, 0);
                }
            }
            vi.stubGlobal('FileReader', MockFileReader);

            renderComponent();

            const fileInput = document.querySelector('input[type="file"]');
            const file = new File(['imagen'], 'mascota.png', { type: 'image/png' });
            fireEvent.change(fileInput, { target: { files: [file] } });

            await waitFor(() => {
                const img = screen.getByAltText('Vista previa');
                expect(img).toBeInTheDocument();
                expect(img.src).toContain('data:image/png;base64');
            });

            vi.unstubAllGlobals();
        });

        it('quita el error de imagen al cargar una foto', async () => {
            const mockResult = 'data:image/png;base64,imagentest123';

            class MockFileReader {
                constructor() {
                    this.result = mockResult;
                    this.onloadend = null;
                }
                readAsDataURL() {
                    setTimeout(() => {
                        this.onloadend && this.onloadend();
                    }, 0);
                }
            }
            vi.stubGlobal('FileReader', MockFileReader);

            renderComponent();

            // Primero dispara el error.
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));
            await waitFor(() =>
                expect(screen.getByText('La fotografía es obligatoria')).toBeInTheDocument()
            );

            // Luego carga imagen.
            const fileInput = document.querySelector('input[type="file"]');
            const file = new File(['imagen'], 'mascota.png', { type: 'image/png' });
            fireEvent.change(fileInput, { target: { files: [file] } });

            await waitFor(() =>
                expect(screen.queryByText('La fotografía es obligatoria')).not.toBeInTheDocument()
            );

            vi.unstubAllGlobals();
        });
    });

    // Enviar formulario.
    describe('Envío del formulario', () => {

        const setupFullForm = async () => {
            const mockResult = 'data:image/png;base64,imagentest123';
            class MockFileReader {
                constructor() { this.result = mockResult; this.onloadend = null; }
                readAsDataURL() { setTimeout(() => this.onloadend && this.onloadend(), 0); }
            }
            vi.stubGlobal('FileReader', MockFileReader);

            renderComponent();
            await waitFor(() => screen.getByText('Huellitas'));

            // Cargar imagen.
            const fileInput = document.querySelector('input[type="file"]');
            fireEvent.change(fileInput, { target: { files: [new File(['img'], 'foto.png', { type: 'image/png' })] } });
            await waitFor(() => screen.getByAltText('Vista previa'));

            // Seleccionar refugio.
            const shelterSelect = screen.getAllByRole('combobox')[0];
            await userEvent.selectOptions(shelterSelect, '1');

            // Llenar campos.
            await fillForm();
        };

        it('llama a petService.crear con los datos correctos', async () => {
            petService.crear.mockResolvedValue({ id: 99 });

            await setupFullForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));

            await waitFor(() => {
                expect(petService.crear).toHaveBeenCalledTimes(1);
                const llamada = petService.crear.mock.calls[0][0];
                expect(llamada.name).toBe('Bruno');
                expect(llamada.species).toBe('Perro');
                expect(llamada.shelter.id).toBe(1);
                expect(llamada.image).toContain('data:image/png;base64');
            });

            vi.unstubAllGlobals();
        });

        it('muestra alerta de éxito al guardar correctamente', async () => {
            petService.crear.mockResolvedValue({ id: 99 });

            await setupFullForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith('¡Registro guardado exitosamente!');
            });

            vi.unstubAllGlobals();
        });

        it('navega hacia atrás tras guardar exitosamente', async () => {
            petService.crear.mockResolvedValue({ id: 99 });

            await setupFullForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(-1);
            });

            vi.unstubAllGlobals();
        });

        it('muestra alerta de error si el servidor falla', async () => {
            petService.crear.mockRejectedValue(new Error('Fallo de red'));

            await setupFullForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith(
                    expect.stringContaining('Error: No se pudo registrar la mascota')
                );
            });

            vi.unstubAllGlobals();
        });

        it('no llama a petService.crear si el formulario es inválido', async () => {
            renderComponent();
            await userEvent.click(screen.getByRole('button', { name: /guardar registro/i }));

            expect(petService.crear).not.toHaveBeenCalled();
        });
    });

    // Navegar.
    describe('Navegación', () => {

        it('navega hacia atrás al hacer clic en Regresar', async () => {
            renderComponent();
            await userEvent.click(screen.getByText(/regresar/i));
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });
});