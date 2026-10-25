const DRINKS = {
  tea: { code: 'T', price: 0.4, extraHotCode: 'Th' },
  coffee: { code: 'C', price: 0.6, extraHotCode: 'Ch' },
  chocolate: { code: 'H', price: 0.5, extraHotCode: 'Hh' },
  orangeJuice: { code: 'O', price: 0.6 },
};

function roundAmount(amount) {
  return Math.round(amount * 100) / 100;
}

class CoffeeMachine {
  constructor(drinkMaker, salesRepository, emailNotifier, beverageQuantityChecker) {
    this.drinkMaker = drinkMaker;
    this.salesRepository = salesRepository;
    this.emailNotifier = emailNotifier;
    this.beverageQuantityChecker = beverageQuantityChecker;
  }

  processOrder(order) {
    const drink = DRINKS[order.drink];
    const sugars = order.sugars || 0;
    const stick = sugars > 0 ? '0' : '';
    const code = order.extraHot && drink.extraHotCode ? drink.extraHotCode : drink.code;
    const drinkCommand = `${code}:${sugars > 0 ? sugars : ''}:${stick}`;

    if (order.money !== undefined) {
      if (order.money < drink.price) {
        const missing = roundAmount(drink.price - order.money);
        this.drinkMaker.send(`M:${missing}`);
        return;
      }
    }

    this.drinkMaker.send(drinkCommand);

    if (this.salesRepository) {
      this.salesRepository.recordSale(order.drink, drink.price);
    }

    this.checkForShortage(order.drink);
  }

  checkForShortage(drink) {
    if (!this.beverageQuantityChecker || !this.beverageQuantityChecker.isEmpty(drink)) {
      return;
    }

    console.log(
      `Shortage: we are out of ${drink}. A notification has been sent to the company to refill the machine`
    );

    if (this.emailNotifier) {
      this.emailNotifier.notifyMissingDrink(drink);
    }
  }

  printReport() {
    const sales = this.salesRepository ? this.salesRepository.getSales() : new Map();
    console.log('Coffee machine report');
    console.log('----------------------');
    sales.forEach((quantity, drink) => {
      console.log(`${quantity} ${drink}`);
    });
    console.log(`Total money earned: ${this.salesRepository ? this.salesRepository.getTotalMoneyEarned() : 0}`);
  }
}

module.exports = { CoffeeMachine };
