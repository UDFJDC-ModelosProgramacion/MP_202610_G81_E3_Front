describe('Search Page', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);

    cy.intercept('GET', '**/shelters', [
      { id: 1, name: 'Huellitas', city: 'Bogotá', email: 'h@test.com', address: 'Calle 1', image: '' },
      { id: 2, name: 'Patitas Felices', city: 'Medellín', email: 'p@test.com', address: 'Calle 2', image: '' },
    ]).as('getShelters');

    cy.visit('/buscar');
  });

  it('muestra el título de búsqueda', () => {
    cy.contains('Sección de búsqueda').should('be.visible');
  });

  it('carga y muestra refugios al iniciar', () => {
    cy.wait('@getShelters');
    cy.contains('Huellitas').should('be.visible');
    cy.contains('Patitas Felices').should('be.visible');
  });

  it('cambia a búsqueda de mascotas', () => {
    cy.get('select').select('Mascotas');
    cy.get('input[placeholder*="mascota"]').should('exist');
  });

  it('abre el modal al hacer clic en Más información', () => {
    cy.wait('@getShelters');
    cy.contains('Huellitas').should('be.visible');
    cy.contains('Más información').first().click();
    cy.contains('📧 Correo:').should('be.visible');
  });

  it('cierra el modal al hacer clic en Cerrar', () => {
    cy.wait('@getShelters');
    cy.contains('Huellitas').should('be.visible');
    cy.contains('Más información').first().click();
    cy.contains('Cerrar').click();
    cy.contains('Cerrar').should('not.exist');
  });
});