class EmailNotifier {
  // eslint-disable-next-line no-unused-vars
  notifyMissingDrink(drink) {
    throw new Error('EmailNotifier.notifyMissingDrink must be implemented');
  }
}

module.exports = { EmailNotifier };
