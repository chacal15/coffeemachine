const { CoffeeMachine } = require('../src/coffeeMachine');
const { SalesRepository } = require('../src/salesRepository');

describe('CoffeeMachine - Iteration 5: Running out', () => {
  let drinkMaker;
  let salesRepository;
  let emailNotifier;
  let beverageQuantityChecker;
  let coffeeMachine;
  let consoleSpy;

  beforeEach(() => {
    drinkMaker = { send: jest.fn() };
    salesRepository = new SalesRepository();
    emailNotifier = { notifyMissingDrink: jest.fn() };
    beverageQuantityChecker = { isEmpty: jest.fn().mockReturnValue(false) };
    coffeeMachine = new CoffeeMachine(drinkMaker, salesRepository, emailNotifier, beverageQuantityChecker);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('a message to the console should indicate the shortage', () => {
    beverageQuantityChecker.isEmpty.mockReturnValue(true);

    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    const output = consoleSpy.mock.calls.map((call) => call.join(' ')).join('\n');
    expect(output).toContain('tea');
    expect(output.toLowerCase()).toContain('shortage');
  });

  test('the console message should indicate that a notification has been sent', () => {
    beverageQuantityChecker.isEmpty.mockReturnValue(true);

    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    const output = consoleSpy.mock.calls.map((call) => call.join(' ')).join('\n');
    expect(output).toContain('notification');
    expect(output.toLowerCase()).toContain('sent');
  });

  test('an email notification should be sent for the missing drink', () => {
    beverageQuantityChecker.isEmpty.mockReturnValue(true);

    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(emailNotifier.notifyMissingDrink).toHaveBeenCalledWith('tea');
  });

  test('the quantity checker should be asked about the ordered drink', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.6 });

    expect(beverageQuantityChecker.isEmpty).toHaveBeenCalledWith('coffee');
  });

  test('no notification should be sent when the drink is available', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(emailNotifier.notifyMissingDrink).not.toHaveBeenCalled();
  });

  test('no console message should be printed when the drink is available', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('the drink should still be made when it is available', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(drinkMaker.send).toHaveBeenCalledWith('T::');
  });

  test('the drink should be made when there is a shortage', () => {
    beverageQuantityChecker.isEmpty.mockReturnValue(true);

    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(drinkMaker.send).toHaveBeenCalledWith('T::');
  });

  test('a shortage should be reported for each missing drink', () => {
    beverageQuantityChecker.isEmpty.mockReturnValue(true);

    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 0.5 });

    expect(emailNotifier.notifyMissingDrink).toHaveBeenCalledWith('chocolate');
  });
});
