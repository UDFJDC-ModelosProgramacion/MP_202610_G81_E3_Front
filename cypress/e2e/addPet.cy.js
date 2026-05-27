describe('AddPet Page', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/api/shelters', [
      { id: 1, name: 'Huellitas' },
      { id: 2, name: 'Patitas Felices' },
    ]).as('getShelters');

    cy.visit('/agregarmascotas');
  });

  it('muestra el título correctamente', () => {
    cy.contains('Agregar mascota').should('be.visible');
  });

  it('muestra errores si se envía el formulario vacío', () => {
    cy.contains('Guardar registro').click();
    cy.contains('Seleccione un refugio').should('be.visible');
    cy.contains('La fotografía es obligatoria').should('be.visible');
    cy.contains('Campo requerido').should('be.visible');
  });

  it('navega atrás al hacer clic en Regresar', () => {
    cy.contains('Regresar').click();
    cy.url().should('not.include', '/agregarmascotas');
  });

  it('carga los refugios en el select', () => {
    cy.wait('@getShelters');
    cy.contains('Huellitas').should('exist');
    cy.contains('Patitas Felices').should('exist');
  });

  it('muestra error de nombre al escribir y borrarlo', () => {
    cy.get('input[name="name"]').type('Bruno');
    cy.get('input[name="name"]').clear();
    cy.contains('Guardar registro').click();
    cy.get('input[name="name"]').should('have.class', 'input-error');
  });

  it('limpia el error del refugio al seleccionarlo', () => {
    cy.wait('@getShelters');
    cy.contains('Guardar registro').click();
    cy.contains('Seleccione un refugio').should('be.visible');
    cy.get('select').first().select('1');
    cy.contains('Seleccione un refugio').should('not.exist');
  });
});