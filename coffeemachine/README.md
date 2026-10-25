# Coffee Machine — TDD Mini Project

Implementation of the [Coffee Machine mini project](https://simcap.github.io/coffeemachine/index.html) (simcap/coffeemachine), a
Test Driven Development exercise: implement the logic that translates customer orders into instructions for the
**drink maker**, following the drink maker protocol.

**Stack:** JavaScript (Node.js) · Jest (test framework + mocking) · 50 unit tests · 100% statement / function / line
coverage.

> **Langue / Language** — Ce document est bilingue. La partie *English* (sections 1, 5, 6) décrit le projet en anglais,
> en cohérence avec l'énoncé et le code. La partie *Français* (sections 2 à 4) présente la démarche, les itérations et
> les difficultés rencontrées. This document is bilingual: the English sections describe the project as the exercise
> and the code do, the French sections cover the process, the iterations and the difficulties encountered.

---

## 1. How to run the project

**Requirements:** Node.js 18+ (tested on Node 20.20.2) and npm.

```bash
# Install the dependencies (Jest)
npm install

# Run the whole test suite
npm test

# Run the test suite with the coverage report
npm run test:coverage

# Run the test suite in watch mode while developing
npm run test:watch

# Run the demo script showing the machine in action
npm run demo
```

The demo prints the instructions sent to the drink maker for a few orders and the sales report:

```
=== Order 1: a coffee with one sugar, paid exactly ===
[drink maker] <- C:1:0

=== Order 2: an extra hot tea with two sugars ===
[drink maker] <- Th:2:0
Shortage: we are out of tea. A notification has been sent to the company to refill the machine
[email notifier] Company notified: tea is out of stock

=== Order 3: an orange juice, not enough money ===
[drink maker] <- M:0.4
...
=== Report ===
Coffee machine report
----------------------
1 coffee
1 tea
1 chocolate
Total money earned: 1.5
```

**Project structure**

```
coffeemachine/
├── src/
│   ├── coffeeMachine.js          # the coffee machine: order -> drink maker instructions
│   ├── salesRepository.js        # in-memory sales data for the report
│   ├── emailNotifier.js          # EmailNotifier service (interface)
│   ├── beverageQuantityChecker.js # BeverageQuantityChecker service (interface)
│   └── index.js                  # runnable demo
├── tests/
│   ├── coffeeMachine.test.js     # iteration 1
│   ├── business.test.js          # iteration 2
│   ├── extraHot.test.js          # iteration 3
│   ├── reporting.test.js         # iteration 4
│   ├── runningOut.test.js        # iteration 5
│   └── salesRepository.test.js   # iteration 4 (repository unit tests)
└── package.json
```

---

## 2. Démarche / Approach

L'exercice a été réalisé en **TDD strict** : pour chaque itération, le test a d'abord été écrit, puis exécuté et vu
échouer (rouge), et enfin seulement le code de production le plus simple possible a été écrit pour le faire passer
(vert). L'historique git contient un commit par itération, ce qui permet de relire la démarche TDD commit par commit.

Les deux règles de l'énoncé ont été respectées :

1. *All production code is written to make a failing test pass* — aucun code de production n'a été écrit sans test
   correspondant écrit au préalable.
2. *Do the simplest thing that could work for the current iteration* — chaque itération n'implémente que ce qui est
   demandé, sans anticiper les besoins suivants.

The exercise was carried out in **strict TDD**: for each iteration, the test was written first, run and seen failing
(red), and only then was the simplest possible production code written to make it pass (green). The git history holds
one commit per iteration, so the TDD workflow can be reviewed commit by commit.

---

## 3. Itérations réalisées / Iterations performed

L'exercice est découpé en cinq itérations.

| # | Itération | Implémentation | Tests |
|---|-----------|----------------|-------|
| 1 | **Making drinks** | `CoffeeMachine.processOrder` construit la commande du protocole pour thé, café et chocolat, avec 0/1/2 sucres et une touillette quand il y a du sucre. | 7 |
| 2 | **Going into business** | Prix (thé 0,4, café 0,6, chocolat 0,5). La boisson n'est préparée que si l'argent est suffisant ; sinon `M:<montant manquant>` est envoyé. | 8 |
| 3 | **Extra hot** | Jus d'orange (0,6 euro) et boissons extra hot. L'extra hot insère un `h` dans le code de la boisson (`Ch`, `Th`, `Hh`). | 9 |
| 4 | **Making money** | `SalesRepository` enregistre chaque boisson préparée et son prix ; `printReport()` affiche les quantités vendues et le total encaissé. | 17 |
| 5 | **Running out** | `BeverageQuantityChecker` détecte les ruptures ; l'utilisateur voit un message console et `EmailNotifier` prévient l'entreprise. | 9 |

**Total : 50 tests, tous passants.**

### Le protocole du drink maker

Le coffee machine envoie des commandes sous forme de chaînes au drink maker :

| Commande   | Signification                                                |
|------------|--------------------------------------------------------------|
| `T::`      | 1 thé, sans sucre, sans touillette                           |
| `T:1:0`    | 1 thé, 1 sucre, avec une touillette                           |
| `C:2:0`    | 1 café, 2 sucres, avec une touillette                         |
| `H::`      | 1 chocolat, sans sucre, sans touillette                      |
| `O::`      | 1 jus d'orange                                                |
| `Ch::`     | 1 café extra hot                                              |
| `Th:2:0`   | 1 thé extra hot, 2 sucres, avec une touillette                |
| `Hh:1:0`   | 1 chocolat extra hot, 1 sucre, avec une touillette           |
| `M:0.4`    | message pour le client : il manque 0,4 euro                  |

Le format est `CODE:<nombre de sucres>:<touillette>`. Le champ sucres est vide quand il n'y a pas de sucre (`H::`), et
le champ touillette n'est présent que si la boisson contient du sucre.

### Une conception restée flexible

L'itération 3 demandait d'ajouter une boisson *et* une nouvelle dimension (l'extra hot). Plutôt que d'empiler des
`if`, les définitions des boissons tiennent dans une seule table :

```js
const DRINKS = {
  tea:         { code: 'T', price: 0.4, extraHotCode: 'Th' },
  coffee:      { code: 'C', price: 0.6, extraHotCode: 'Ch' },
  chocolate:   { code: 'H', price: 0.5, extraHotCode: 'Hh' },
  orangeJuice: { code: 'O', price: 0.6 },
};
```

Ajouter une nouvelle boisson ne demande plus qu'une ligne, et une boisson sans `extraHotCode` n'est simplement jamais
extra hot. C'est la réponse à la question de l'énoncé : *« your implementation is flexible enough to welcome those
changes with not too much hassle? »*.

---

## 4. Approche de test / Testing approach

- **Jest** comme framework de test, avec `jest.fn()` pour le mocking et `jest.spyOn(console, 'log')` pour vérifier le
  rapport et les messages de rupture.
- **Aucun test ne touche les vrais services.** Le drink maker, l'email notifier, le quantity checker et le sales
  repository sont tous injectés dans `CoffeeMachine` via son constructeur, ce qui permet de mocker chaque collaborateur.
- Les deux services exigés par l'énoncé sont fournis comme vraies classes (`EmailNotifier`, `BeverageQuantityChecker`)
  dans `src/`, dont les méthodes lèvent une exception par défaut : ce sont des contrats à implémenter par
  l'infrastructure réelle, et ils sont mockés dans les tests.

Exemple de test avec mock :

```js
beverageQuantityChecker.isEmpty.mockReturnValue(true);

coffeeMachine.processOrder({ drink: 'tea', sugars: 0, money: 0.4 });

expect(emailNotifier.notifyMissingDrink).toHaveBeenCalledWith('tea');
```

- **Jest** is used as the test framework, with `jest.fn()` for mocking and `jest.spyOn(console, 'log')` to assert on
  the report and on the shortage messages.
- **No test touches the real services.** The drink maker, the email notifier, the quantity checker and the sales
  repository are all injected into `CoffeeMachine` through its constructor, so every collaborator can be mocked.
- The two services required by the exercise are provided as real classes (`EmailNotifier`, `BeverageQuantityChecker`)
  in `src/`, whose methods throw by default: they are contracts to be implemented by the real infrastructure, and are
  mocked in the tests.

---

## 5. Difficulties encountered / Difficultés rencontrées

**1. Le format exact du protocole.** L'énoncé donne trois exemples (`T:1:0`, `H::`, `C:2:0`) et il est tentant de
supposer que le champ touillette est toujours présent. Ma première implémentation produisait `C:` pour un café sans
sucre. La règle réelle est que le champ sucres est toujours présent (vide si zéro) et que le champ touillette n'est
ajouté que si la boisson contient du sucre — la commande est donc toujours `code:champSucre:champTouillette`, ce qui
donne `H::` et `T:1:0`. Les tests l'ont détecté, et l'exemple de l'énoncé (`"Th:2:0"`) a servi de référence.

*1. The exact protocol format.* The spec gives three examples (`T:1:0`, `H::`, `C:2:0`) and it is easy to assume the
stick field is always present. My first implementation produced `C:` for a coffee without sugar. The actual rule is that
the sugar field is always present (empty when zero) and the stick field is only appended when the drink contains sugar —
so the command is always `code:sugarField:stickField`, which yields `H::` and `T:1:0`. This was caught by the tests,
and the example in the spec (`"Th:2:0"`) was used as the reference.

**2. Les montants en virgule flottante.** `0.6 - 0.5` vaut `0.09999999999999998` en JavaScript, ce qui aurait produit
un message `M:0.09999999999999998`. Tous les montants sont arrondis à deux décimales (`Math.round(x * 100) / 100`), et un
test vérifie que l'accumulation `0.4 + 0.4 + 0.4` reste exactement `1.2`.

*2. Floating point money.* `0.6 - 0.5` is `0.09999999999999998` in JavaScript, which would produce a message like
`M:0.09999999999999998`. All monetary amounts are rounded to two decimals (`Math.round(x * 100) / 100`), and a test
covers the accumulation of `0.4 + 0.4 + 0.4` staying exactly `1.2`.

**3. La compatibilité entre itérations.** Le contrôle du prix introduit à l'itération 2 cassait les tests de l'itération
1, dont les commandes ne contiennent aucune notion d'argent. Le contrôle n'est donc appliqué que si la commande fournit
réellement un montant (`order.money !== undefined`), ce qui garde les deux itérations compatibles sans cas particulier
dans les tests.

*3. Backwards compatibility between iterations.* The money check introduced in iteration 2 would have broken the
iteration 1 tests, whose orders carry no money at all. The check is therefore applied only when the order actually
provides a `money` amount (`order.money !== undefined`), which keeps the two iterations compatible without
special-casing the tests.

**4. L'interprétation de la cinquième itération.** L'histoire utilisateur telle qu'écrite ("when it can be delivered
because of a shortage") est ambiguë. J'ai implémenté l'intention claire de la fonctionnalité : quand le quantity
checker signale qu'une boisson est épuisée, le client voit un message console indiquant la rupture et le fait qu'une
notification a été envoyée, et l'entreprise est prévenue par email via `EmailNotifier.notifyMissingDrink(drink)`. La
boisson reste préparée, l'exercice ne demandant que d'*informer* l'utilisateur et de *prévenir* l'entreprise. Le message
console mentionne bien la rupture et l'envoi de la notification, comme l'exige l'histoire utilisateur.

*4. Interpretation of the fifth iteration.* The user story as written ("when it can be delivered because of a shortage")
reads ambiguously. I implemented the clear intent of the feature: when the quantity checker reports that a drink is
empty, the customer sees a console message stating the shortage and that a notification has been sent, and the company
is notified by email through `EmailNotifier.notifyMissingDrink(drink)`. The drink itself is still produced, since the
exercise only asks to *inform* the user and to *notify* the company. The console message mentions both the shortage and
the sent notification, as required by the user story.

**5. Seules les ventes réelles sont comptabilisées.** Une boisson qui n'a pas pu être payée ne doit pas apparaître dans le
rapport de ventes : la vente n'est enregistrée qu'après l'envoi effectif de la commande au drink maker.

*5. Reporting only real sales.* A drink that could not be paid for must not appear in the sales report, so the sale is
recorded only after the drink maker has actually received the order.

---

## 6. Assumptions

- Les prix sont exprimés en euros, et le drink maker gère la monnaie rendue quand trop d'argent est inséré (comme
  indiqué à l'itération 2).
- Une touillette est ajoutée dès que la boisson contient au moins un sucre, et seulement pour 1 ou 2 sucres (le
  protocole gère 0, 1 ou 2 sucres).

---

## 7. Git history

```
99cc70c Add demo script, npm scripts and full README
a0699b7 Iteration 5: Running out
fcda99c Add the EmailNotifier and BeverageQuantityChecker services
471ad0d Iteration 4: Making money
a8f770d Iteration 3: Extra hot
d53a695 Iteration 2: Going into business
fa68515 Iteration 1: Making drinks
```

Each commit corresponds to one iteration and contains the tests written for it together with the code that makes them
pass. The default branch is `main`.

Chaque commit correspond à une itération et contient les tests écrits pour elle ainsi que le code qui les fait passer.
La branche par défaut est `main`.
