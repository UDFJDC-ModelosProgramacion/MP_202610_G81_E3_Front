describe('EditShelter Page', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);

    cy.intercept('GET', 'http://localhost:8080/api/shelters', [
      { id: 1, name: 'Huellitas' },
      { id: 2, name: 'Patitas Felices' },
    ]).as('getShelters');

    cy.intercept('GET', 'http://localhost:8080/api/shelters/1', {
      id: 1, name: 'Huellitas', city: 'Bogotá',
      address: 'Calle 123', email: 'h@test.com', image: ''
    }).as('getShelter');

    cy.visit('/editar_refugio');
  });

  it('muestra el título correctamente', () => {
    cy.contains('Actualizar información del refugio').should('be.visible');
  });

  it('el botón Guardar está deshabilitado sin refugio seleccionado', () => {
    cy.contains('Guardar Cambios').should('be.disabled');
  });

  it('carga los datos del refugio al seleccionarlo', () => {
    cy.wait('@getShelters');
    cy.get('select').first().select('1');
    cy.wait('@getShelter');
    cy.get('input[name="name"]').should('have.value', 'Huellitas');
    cy.get('input[name="city"]').should('have.value', 'Bogotá');
  });

  it('muestra errores si se envía con campos vacíos', () => {
    cy.wait('@getShelters');
    cy.get('select').first().select('1');
    cy.wait('@getShelter');
    cy.get('input[name="name"]').clear();
    cy.contains('Guardar Cambios').click();
    cy.contains('El nombre es obligatorio.').should('be.visible');
  });

  it('navega atrás al hacer clic en Cancelar', () => {
    cy.contains('Cancelar').click();
    cy.url().should('not.include', '/editar_refugio');
  });
});