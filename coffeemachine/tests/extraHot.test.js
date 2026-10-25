const { CoffeeMachine } = require('../src/coffeeMachine');

describe('CoffeeMachine - Iteration 3: Extra hot', () => {
  let drinkMaker;
  let coffeeMachine;

  beforeEach(() => {
    drinkMaker = { send: jest.fn() };
    coffeeMachine = new CoffeeMachine(drinkMaker);
  });

  test('I want to be able to buy an orange juice for 0.6 euro', () => {
    coffeeMachine.processOrder({ drink: 'orangeJuice', sugars: 0, money: 0.6 });

    expect(drinkMaker.send).toHaveBeenCalledWith('O::');
  });

  test('the drink maker should not make an orange juice when not enough money is given', () => {
    coffeeMachine.processOrder({ drink: 'orangeJuice', sugars: 0, money: 0.5 });

    expect(drinkMaker.send).toHaveBeenCalledWith('M:0.1');
  });

  test('I want to be able to have my coffee extra hot', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.6, extraHot: true });

    expect(drinkMaker.send).toHaveBeenCalledWith('Ch::');
  });

  test('I want to be able to have my tea extra hot', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4, extraHot: true });

    expect(drinkMaker.send).toHaveBeenCalledWith('Th::');
  });

  test('I want to be able to have my chocolate extra hot', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 0.5, extraHot: true });

    expect(drinkMaker.send).toHaveBeenCalledWith('Hh::');
  });

  test('an extra hot drink with one sugar keeps the sugar and the stick', () => {
    coffeeMachine.processOrder({ drink: 'chocolate', sugars: 1, money: 0.5, extraHot: true });

    expect(drinkMaker.send).toHaveBeenCalledWith('Hh:1:0');
  });

  test('an extra hot tea with two sugars keeps the sugars and the stick', () => {
    coffeeMachine.processOrder({ drink: 'tea', sugars: 2, money: 0.4, extraHot: true });

    expect(drinkMaker.send).toHaveBeenCalledWith('Th:2:0');
  });

  test('a drink that is not extra hot keeps its normal code', () => {
    coffeeMachine.processOrder({ drink: 'coffee', sugars: 0, money: 0.6, extraHot: false });

    expect(drinkMaker.send).toHaveBeenCalledWith('C::');
  });

  test('orange juice cannot be extra hot', () => {
    coffeeMachine.processOrder({ drink: 'orangeJuice', sugars: 0, money: 0.6, extraHot: true });

    expect(drinkMaker.send).toHaveBeenCalledWith('O::');
  });
});
