const validateCredentials = (email, password, errs) => {
  // Check for empty values
  if (!email || !password) {
    errs.push("Fields cannot be empty.");
    return true;
  }

  // Check email formatting
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errs.push("Must be a valid email.");
  }

  // Check password formatting
  if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
    errs.push("Password needs 8+ digits, capital, lowercase, and number.")
  }
}

export default validateCredentials;