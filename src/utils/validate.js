const validateCredentials = (email, password, errs) => {
  // Check for empty values
  if (!email || !password) {
    errs.push("Fields cannot be empty.");
    return;
  }

  // Check email formatting
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errs.push("Must be a valid email.");
  }

  // Check password formatting
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
    errs.push("Password needs 8+ digits, capital, lowercase, and number.");
  }
};

const isValidNumber = (number) => {
  return /^\d{1,3}(,\d{3})*$/.test(number) || /^[0-9]*$/.test(number);
};

const validateNumbers = (numbers) => {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== "" && !isValidNumber(numbers[i])) {
      return false;
    }
  }
  return true;
};

const validateNumbersRequired = (numbers) => {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === "" || !isValidNumber(numbers[i])) {
      return false;
    }
  }
  return true;
};

const cleanNumber = (number) => {
  return number !== "" ? number.replace(/,/g, "") : "0";
};

const formatCommas = (number) => {
  return number ? number.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
};

module.exports = {
  validateCredentials,
  isValidNumber,
  validateNumbers,
  validateNumbersRequired,
  cleanNumber,
  formatCommas,
};
