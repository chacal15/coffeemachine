const { CoffeeMachine } = require('../src/coffeeMachine');

describe('CoffeeMachine - Iteration 1: Making drinks', () => {
  let drinkMaker;
  let coffeeMachine;

  beforeEach(() => {
    drinkMaker = { send: jest.fn() };
    coffeeMachine = new CoffeeMachine(drinkMaker);
  });

  test('the drink maker should receive the correct instructions for my coffee order', () => {
    coffeeMachine.processOrder({ drink: 'coffee' });

    expect(drinkMaker.send).toHaveBeenCalledWith('C::');
  });

  test('the drink maker should receive the correct instructions for my tea order', () => {
    coffeeMachine.processOrder({ drink: 'tea' });

    expect(drinkMaker.send).toHaveBeenCalledWith('T::');
  });

  test('the drink maker should receive the correct instructions for my chocolate order', () => {
    coffeeMachine.processOrder({ drink: 'chocolate' });

    expect(drinkMaker.send).toHaveBeenCalledWith('H::');
  });

  test('I want to be able to send instructions to the drink maker to add one sugar', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 1 });

    expect(drinkMaker.send).toHaveBeenCalledWith('C:1:0');
  });

  test('I want to be able to send instructions to the drink maker to add two sugars', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 2 });

    expect(drinkMaker.send).toHaveBeenCalledWith('T:2:0');
  });

  test('when my order contains sugar the drink maker should add a stick with it', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 1 });

    expect(drinkMaker.send).toHaveBeenCalledWith('H:1:0');
  });

  test('when my order contains no sugar the drink maker should not add a stick', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0 });

    expect(drinkMaker.send).toHaveBeenCalledWith('H::');
  });
});
