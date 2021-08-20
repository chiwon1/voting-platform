function validateDate(date) {
  const isValidDate = Date.parse(date);

  return !isNaN(isValidDate);
}

module.exports = validateDate;
