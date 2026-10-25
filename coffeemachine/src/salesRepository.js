class SalesRepository {
  constructor() {
    this.sales = new Map();
    this.totalMoneyEarned = 0;
  }

  recordSale(drink, price) {
    const quantity = this.sales.get(drink) || 0;
    this.sales.set(drink, quantity + 1);
    this.totalMoneyEarned = Math.round((this.totalMoneyEarned + price) * 100) / 100;
  }

  getQuantitySold(drink) {
    return this.sales.get(drink) || 0;
  }

  getTotalMoneyEarned() {
    return this.totalMoneyEarned;
  }

  getSales() {
    return this.sales;
  }
}

module.exports = { SalesRepository };
