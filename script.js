'use strict';

// BANKIST APP

const account1 = {
  owner: 'Ferhat Canşi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const buttonEuro = document.querySelector('.converterToEuro');
const buttonUsd = document.querySelector('.converterToUsd');

//DİSPLAYING MOVEMENTS//

containerMovements.innerHTML = '';

const displayMovArr = function (movements) {
  movements.forEach(function (value, key) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      key + 1
    } ${type}</div> 
    <div class="movements__value">${value} EUR</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// CALCULATION OF BALANCE AND TOTAL OF IT TO PRINT//

const calcPrintBalance = function (movements) {
  let balance = movements.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  labelBalance.textContent = `${balance} EUR`;
};

//CALCULATION OF SUMMARIES//

const calcDisplaySummary = function (account, movements) {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov, i) => acc + mov, 0);

  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov, i) => acc + mov, 0);

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)} EUR`;
  labelSumIn.textContent = `${income} EUR`;
  labelSumInterest.textContent = `${interest} EUR`;
};

//CREATING USERNAMES AC.TO USERS//

const createUsernames = function (user) {
  let userName = user.toLowerCase().split(' ');

  userName = userName.map(function (item) {
    return item.slice(0, 1);
  });
  userName = userName.join('');
  return userName;
};

accounts.forEach(function (item) {
  item.username = createUsernames(item.owner);
});

//LOGIN sec//
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `welcome back, Sir ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 1;
    displayMovArr(currentAccount.movements);
    calcPrintBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount, currentAccount.movements);
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});
