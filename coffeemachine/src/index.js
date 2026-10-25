const { CoffeeMachine } = require('./coffeeMachine');
const { SalesRepository } = require('./salesRepository');

// A simple fake drink maker: it prints the instructions it receives.
const drinkMaker = {
  send(instruction) {
    console.log(`[drink maker] <- ${instruction}`);
  },
};

const emailNotifier = {
  notifyMissingDrink(drink) {
    console.log(`[email notifier] Company notified: ${drink} is out of stock`);
  },
};

// The tea is out of stock, everything else is available.
const beverageQuantityChecker = {
  isEmpty(drink) {
    return drink === 'tea';
  },
};

const salesRepository = new SalesRepository();
const coffeeMachine = new CoffeeMachine(
  drinkMaker,
  salesRepository,
  emailNotifier,
  beverageQuantityChecker
);

console.log('=== Order 1: a coffee with one sugar, paid exactly ===');
coffeeMachine.processOrder({ drink: 'coffee', sugars: 1, money: 0.6 });

console.log('\n=== Order 2: an extra hot tea with two sugars ===');
coffeeMachine.processOrder({ drink: 'tea', sugars: 2, money: 0.4, extraHot: true });

console.log('\n=== Order 3: an orange juice, not enough money ===');
coffeeMachine.processOrder({ drink: 'orangeJuice', sugars: 0, money: 0.2 });

console.log('\n=== Order 4: a chocolate with too much money (change handled by the machine) ===');
coffeeMachine.processOrder({ drink: 'chocolate', sugars: 0, money: 1 });

console.log('\n=== Report ===');
coffeeMachine.printReport();
