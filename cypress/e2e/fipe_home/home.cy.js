/// <reference types="cypress" />


describe("Testes da página", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Carregar página", () => {
    cy.contains('Histórico de usados FIPE')
  });

  it('Abrir menus', () => {
    cy.get(':nth-child(1) > .css-13cymwt-control > .css-1fdsijx-ValueContainer > .css-qbdosj-Input').click()
  });
});
