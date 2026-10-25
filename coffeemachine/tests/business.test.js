const { CoffeeMachine } = require('../src/coffeeMachine');

describe('CoffeeMachine - Iteration 2: Going into business', () => {
  let drinkMaker;
  let coffeeMachine;

  beforeEach(() => {
    drinkMaker = { send: jest.fn() };
    coffeeMachine = new CoffeeMachine(drinkMaker);
  });

  test('the drink maker should make the drink only if the correct amount of money is given', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

    expect(drinkMaker.send).toHaveBeenCalledWith('T::');
  });

  test('the drink maker should make a coffee when the correct amount of money is given', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.6 });

    expect(drinkMaker.send).toHaveBeenCalledWith('C::');
  });

  test('the drink maker should make a chocolate when the correct amount of money is given', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 0.5 });

    expect(drinkMaker.send).toHaveBeenCalledWith('H::');
  });

  test('if not enough money is provided, we want to send a message to the drink maker', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.3 });

    expect(drinkMaker.send).toHaveBeenCalledWith('M:0.1');
  });

  test('the message should contain the amount of money missing for a coffee', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.2 });

    expect(drinkMaker.send).toHaveBeenCalledWith('M:0.4');
  });

  test('the message should contain the amount of money missing for a chocolate', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 0.1 });

    expect(drinkMaker.send).toHaveBeenCalledWith('M:0.4');
  });

  test('no drink should be made when not enough money is provided', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.5 });

    expect(drinkMaker.send).toHaveBeenCalledTimes(1);
    expect(drinkMaker.send).toHaveBeenCalledWith('M:0.1');
  });

  test('if too much money is given, the drink maker still makes the drink', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 1 });

    expect(drinkMaker.send).toHaveBeenCalledWith('T::');
  });
});
