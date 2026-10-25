const { CoffeeMachine } = require('../src/coffeeMachine');
const { SalesRepository } = require('../src/salesRepository');

describe('CoffeeMachine - Iteration 4: Making money', () => {
  let drinkMaker;
  let salesRepository;
  let coffeeMachine;
  let consoleSpy;

  beforeEach(() => {
    drinkMaker = { send: jest.fn() };
    salesRepository = new SalesRepository();
    coffeeMachine = new CoffeeMachine(drinkMaker, salesRepository);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('a sold tea should be counted in the report', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(salesRepository.getQuantitySold('tea')).toBe(1);
  });

  test('a sold coffee should be counted in the report', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.6 });

    expect(salesRepository.getQuantitySold('coffee')).toBe(1);
  });

  test('a sold chocolate should be counted in the report', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 0.5 });

    expect(salesRepository.getQuantitySold('chocolate')).toBe(1);
  });

  test('a sold orange juice should be counted in the report', () => {
    coffeeMachine.processOrder({ drink: 'orangeJuice', sugars: 0, money: 0.6 });

    expect(salesRepository.getQuantitySold('orangeJuice')).toBe(1);
  });

  test('several sales of the same drink should be counted', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(salesRepository.getQuantitySold('tea')).toBe(3);
  });

  test('the report should contain the total amount of money earned', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.6 });

    expect(salesRepository.getTotalMoneyEarned()).toBe(1);
  });

  test('the total money earned should accumulate over many sales', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 0.5 });
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 0.5 });
    coffeeMachine.processOrder({ drink: 'orangeJuice', sugars: 0, money: 0.6 });

    expect(salesRepository.getTotalMoneyEarned()).toBe(1.6);
  });

  test('a drink that was not paid for should not be counted in the report', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.2 });

    expect(salesRepository.getQuantitySold('coffee')).toBe(0);
    expect(salesRepository.getTotalMoneyEarned()).toBe(0);
  });

  test('I want to be able to print a report anytime', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.6 });

    coffeeMachine.printReport();

    const output = consoleSpy.mock.calls.map((call) => call.join(' ')).join('\n');
    expect(output).toContain('tea');
    expect(output).toContain('1');
    expect(output).toContain('coffee');
    expect(output).toContain('1');
    expect(output).toContain('1');
  });

  test('the printed report should mention the total money earned', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    coffeeMachine.printReport();

    const output = consoleSpy.mock.calls.map((call) => call.join(' ')).join('\n');
    expect(output).toContain('0.8');
  });
});
