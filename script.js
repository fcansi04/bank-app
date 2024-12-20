'use strict';

// BANKIST APP

const account1 = {
  owner: 'Ferhat Canşi',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

const displayMovArr = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (value, key) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      key + 1
    } ${type}</div> 
    <div class="movements__date">${currentAccount.movementsDates[key]}</div>
    <div class="movements__value">${value.toFixed(1)} EUR</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// CALCULATION OF BALANCE AND TOTAL OF IT TO PRINT//

const calcPrintBalance = function (acc) {
  let balance = acc.movements.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  labelBalance.textContent = `${balance.toFixed(1)} EUR`;
  acc.balance = balance;
};

//CALCULATION OF SUMMARIES//

const calcDisplaySummary = function (account, movements) {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov, i) => acc + mov, 0)
    .toFixed(1);

  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov, i) => acc + mov, 0)
    .toFixed(1);

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(1);

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

const updateUI = function (acc, sort = false) {
  displayMovArr(acc, sort);
  calcPrintBalance(acc);
  calcDisplaySummary(acc, acc.movements);
};

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
    updateUI(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transeffered = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    transeffered > 0 &&
    receiverAcc &&
    transeffered <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transeffered);
    receiverAcc?.movements.push(transeffered);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loaned = Math.floor(inputLoanAmount.value);
  if (loaned > 0 && currentAccount.movements.some(mov => mov > loaned / 10)) {
    currentAccount.movements.push(loaned);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const indexOfAcc = accounts.findIndex(
    acc => acc.username === currentAccount.username
  );
  if (
    Number(inputClosePin.value) === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    accounts.splice(indexOfAcc, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sort = true;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('sort works');

  updateUI(currentAccount, sort);
  sort = !sort;
});
