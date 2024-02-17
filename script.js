'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
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

// Elements
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
/////////////displaying movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type} </div>
          <div class="movements__date"></div>
          <div class="movements__value">${mov}£</div>
        </div>
    
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//////////
////////////calculations and dipslay
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(part => part[0])
      .join('');
  });
};
createUsername(accounts);
const updateUi = function (acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
};
const calcPrintBalance = function (account) {
  const movements = account.movements;
  const balance = movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${balance}£`;
  return balance;
};

const calcDisplaySummary = function (user) {
  const movements = user.movements;

  const interest = user.interestRate;

  const deposits = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${deposits}£`;
  const Withdrawal = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(Withdrawal)}£`;
  const interestCalc = movements
    .filter(mov => mov > 0)
    .map(mov => (mov * interest) / 100)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${interestCalc}£`;
};
/////////////////
/////////logout timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Login Again';
    }
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
////////////////

let currentUser;
let timer;
//////////adding date
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
const fullDate = `${day}/${month}/${year}, ${hour}:${min}`;
labelDate.textContent = fullDate;
////////////////
///////Login part
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentUser != undefined) {
    if (currentUser.pin === Number(inputLoginPin.value)) {
      labelWelcome.textContent = `Welcome back, ${
        currentUser.owner.split(' ')[0]
      }`;
      if (timer) clearInterval(timer);

      timer = startLogOutTimer();
      inputLoginUsername.value = '';
      inputLoginPin.value = '';
      containerApp.style.opacity = 100;

      updateUi(currentUser);
    } else {
      labelWelcome.textContent = 'Login Failed , Try Again';
      containerApp.style.opacity = 0;
    }
  } else {
    labelWelcome.textContent = 'Login Failed , Try Again';
  }
});
///////////////////
/////////transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    calcPrintBalance(currentUser) >= amount &&
    receiverAcc?.username != currentUser.username
  ) {
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(currentUser);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
////////////Loaning money
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.01)) {
    currentUser.movements.push(amount);
    updateUi(currentUser);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
////////////////////////
//////////sorting movements
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  let mov = currentUser.movements;
  displayMovements(mov.sort((a, b) => a - b));
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
