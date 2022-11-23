exports.onlyLettersAndNumbers = str => {
  return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(str)
}
