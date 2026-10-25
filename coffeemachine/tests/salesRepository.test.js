const { SalesRepository } = require('../src/salesRepository');

describe('SalesRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new SalesRepository();
  });

  test('a new repository has no sales', () => {
    expect(repository.getQuantitySold('tea')).toBe(0);
  });

  test('a new repository has earned no money', () => {
    expect(repository.getTotalMoneyEarned()).toBe(0);
  });

  test('recording a sale increments the quantity sold for that drink', () => {
    repository.recordSale('tea', 0.4);

    expect(repository.getQuantitySold('tea')).toBe(1);
  });

  test('recording a sale adds the price to the total money earned', () => {
    repository.recordSale('coffee', 0.6);

    expect(repository.getTotalMoneyEarned()).toBe(0.6);
  });

  test('recording several sales accumulates both quantity and money', () => {
    repository.recordSale('tea', 0.4);
    repository.recordSale('tea', 0.4);
    repository.recordSale('chocolate', 0.5);

    expect(repository.getQuantitySold('tea')).toBe(2);
    expect(repository.getQuantitySold('chocolate')).toBe(1);
    expect(repository.getTotalMoneyEarned()).toBe(1.3);
  });

  test('the total money earned has no floating point artifact', () => {
    repository.recordSale('tea', 0.4);
    repository.recordSale('tea', 0.4);
    repository.recordSale('tea', 0.4);

    expect(repository.getTotalMoneyEarned()).toBe(1.2);
  });

  test('a drink that was never sold reports a zero quantity', () => {
    repository.recordSale('tea', 0.4);

    expect(repository.getQuantitySold('orangeJuice')).toBe(0);
  });
});
