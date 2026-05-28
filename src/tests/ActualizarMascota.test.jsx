import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ActualizarMascota from '../pages/ActualizarMascota';

vi.mock('../services/petService.js', () => ({
    petService: {
        obtenerPorId: vi.fn(),
        actualizar: vi.fn(),
    },
}));

vi.mock('../css/ActualizarMascota.css', () => ({}));

vi.mock('../components/PetForm', () => ({
    FormField: ({ label, children, error }) => (
        <div>
            <label>{label}</label>
            {children}
            {error && <span data-testid="field-error">{error}</span>}
        </div>
    ),
    TextInput: ({ id, name, value, onChange, placeholder, type = 'text', ...rest }) => (
        <input
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            {...rest}
        />
    ),
    SelectInput: ({ id, name, value, onChange, options }) => (
        <select id={id} name={name} value={value} onChange={onChange}>
            <option value="">-- Seleccionar --</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    ),
    TextareaInput: ({ id, name, value, onChange, placeholder, rows }) => (
        <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
        />
    ),
    ReadOnlyField: ({ label, value }) => (
        <div>
            <span>{label}</span>
            <span data-testid="readonly-arrive-date">{value}</span>
        </div>
    ),
    StatusMessage: ({ type, message }) =>
        message ? <div data-testid={`status-${type}`}>{message}</div> : null,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

import { petService } from '../services/petService.js';

const petMock = {
    name: 'Bruno',
    species: 'Perro',
    breed: 'Labrador',
    age: 3,
    sex: 'Macho',
    size: 'Grande',
    temperament: 'Tranquilo',
    specificRequirements: 'Ninguno',
    arriveToShelterDate: '2024-01-15',
};

const renderComponent = () =>
    render(
        <MemoryRouter initialEntries={['/mascotas/1/editar']}>
            <Routes>
                <Route path="/mascotas/:id/editar" element={<ActualizarMascota />} />
            </Routes>
        </MemoryRouter>
    );

const getInput = (name) => document.querySelector(`input[name="${name}"]`);
const getSelect = (name) => document.querySelector(`select[name="${name}"]`);
const getTextarea = (name) => document.querySelector(`textarea[name="${name}"]`);

describe('ActualizarMascota', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Carga inicial', () => {

        it('muestra el spinner de carga mientras obtiene la mascota', () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            expect(screen.getByText(/cargando información de la mascota/i)).toBeInTheDocument();
        });

        it('llama a petService.obtenerPorId con el id de la URL', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => {
                expect(petService.obtenerPorId).toHaveBeenCalledWith('1');
            });
        });

        it('muestra el título y subtítulo tras cargar', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Actualizar mascota')).toBeInTheDocument();
                expect(screen.getByText(/modifica la información del perfil/i)).toBeInTheDocument();
            });
        });

        it('rellena el formulario con los datos de la mascota', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => {
                expect(getInput('name').value).toBe('Bruno');
                expect(getSelect('species').value).toBe('Perro');
                expect(getInput('breed').value).toBe('Labrador');
                expect(getInput('age').value).toBe('3');
                expect(getSelect('sex').value).toBe('Macho');
                expect(getSelect('size').value).toBe('Grande');
                expect(getSelect('temperament').value).toBe('Tranquilo');
                expect(getTextarea('specificRequirements').value).toBe('Ninguno');
            });
        });

        it('muestra la fecha de ingreso como campo de solo lectura', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getByTestId('readonly-arrive-date')).toHaveTextContent('2024-01-15');
            });
        });

        it('muestra error de estado si obtenerPorId falla', async () => {
            petService.obtenerPorId.mockRejectedValue(new Error('Mascota no encontrada'));
            renderComponent();
            await waitFor(() => {
                expect(screen.getByTestId('status-error')).toHaveTextContent(
                    'No se pudo cargar la mascota: Mascota no encontrada'
                );
            });
        });

        it('muestra el botón Guardar cambios', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
            });
        });

        it('muestra el botón Cancelar', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
            });
        });
    });

    describe('Validaciones del formulario', () => {

        const setupForm = async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => screen.getByRole('button', { name: /guardar cambios/i }));
        };

        it('muestra error si se borra el nombre y se envía', async () => {
            await setupForm();
            await userEvent.clear(getInput('name'));
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
            });
        });

        it('muestra error si se borra la especie y se envía', async () => {
            await setupForm();
            await userEvent.selectOptions(getSelect('species'), '');
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                expect(screen.getByText('La especie es obligatoria.')).toBeInTheDocument();
            });
        });

        it('muestra error si la edad es negativa', async () => {
            await setupForm();
            await userEvent.clear(getInput('age'));
            await userEvent.type(getInput('age'), '-5');
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                expect(screen.getByText('La edad debe ser un número positivo.')).toBeInTheDocument();
            });
        });

        it('no muestra error si la edad está vacía', async () => {
            await setupForm();
            await userEvent.clear(getInput('age'));
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                expect(screen.queryByText('La edad debe ser un número positivo.')).not.toBeInTheDocument();
            });
        });

        it('limpia el error del nombre al escribir en el campo', async () => {
            await setupForm();
            await userEvent.clear(getInput('name'));
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument());

            await userEvent.type(getInput('name'), 'Max');
            await waitFor(() => {
                expect(screen.queryByText('El nombre es obligatorio.')).not.toBeInTheDocument();
            });
        });

        it('no llama a petService.actualizar si el formulario es inválido', async () => {
            await setupForm();
            await userEvent.clear(getInput('name'));
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            expect(petService.actualizar).not.toHaveBeenCalled();
        });
    });

    describe('Envío del formulario', () => {

        const setupForm = async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => screen.getByRole('button', { name: /guardar cambios/i }));
        };

        it('llama a petService.actualizar con el id y los datos correctos', async () => {
            petService.actualizar.mockResolvedValue({});
            await setupForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                expect(petService.actualizar).toHaveBeenCalledTimes(1);
                const [idArg, payload] = petService.actualizar.mock.calls[0];
                expect(idArg).toBe('1');
                expect(payload.name).toBe('Bruno');
                expect(payload.species).toBe('Perro');
                expect(payload.age).toBe(3);
            });
        });

        it('convierte la edad a número al enviar', async () => {
            petService.actualizar.mockResolvedValue({});
            await setupForm();
            await userEvent.clear(getInput('age'));
            await userEvent.type(getInput('age'), '5');
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                const [, payload] = petService.actualizar.mock.calls[0];
                expect(typeof payload.age).toBe('number');
                expect(payload.age).toBe(5);
            });
        });

        it('envía age como null si el campo está vacío', async () => {
            petService.actualizar.mockResolvedValue({});
            await setupForm();
            await userEvent.clear(getInput('age'));
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                const [, payload] = petService.actualizar.mock.calls[0];
                expect(payload.age).toBeNull();
            });
        });

        it('muestra mensaje de éxito tras guardar correctamente', async () => {
            petService.actualizar.mockResolvedValue({});
            await setupForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                expect(screen.getByTestId('status-success')).toHaveTextContent(
                    '¡Mascota actualizada correctamente!'
                );
            });
        });

        it('navega hacia atrás 1.5 s después de guardar correctamente', async () => {
            petService.actualizar.mockResolvedValue({});
            await setupForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => screen.getByTestId('status-success'));

            vi.advanceTimersByTime(1500);
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });

        it('muestra error de estado si petService.actualizar falla', async () => {
            petService.actualizar.mockRejectedValue(new Error('Fallo de red'));
            await setupForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            await waitFor(() => {
                expect(screen.getByTestId('status-error')).toHaveTextContent(
                    'Error al actualizar: Fallo de red'
                );
            });
        });

        it('muestra el texto "Guardando…" mientras se envía', async () => {
            let resolveFn;
            petService.actualizar.mockReturnValue(new Promise((r) => (resolveFn = r)));
            await setupForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            expect(screen.getByText(/guardando/i)).toBeInTheDocument();
            resolveFn({});
        });

        it('deshabilita los botones mientras se envía', async () => {
            let resolveFn;
            petService.actualizar.mockReturnValue(new Promise((r) => (resolveFn = r)));
            await setupForm();
            await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));
            expect(screen.getByText(/guardando/i).closest('button')).toBeDisabled();
            expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
            resolveFn({});
        });
    });

    describe('Navegación', () => {

        it('navega hacia atrás al hacer clic en Cancelar', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => screen.getByRole('button', { name: /cancelar/i }));
            await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });

        it('navega hacia atrás al hacer clic en el botón volver del encabezado', async () => {
            petService.obtenerPorId.mockResolvedValue(petMock);
            renderComponent();
            await waitFor(() => screen.getByLabelText('Volver'));
            await userEvent.click(screen.getByLabelText('Volver'));
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });
});