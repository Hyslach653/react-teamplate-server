var validator = require('validator')
const { onlyLettersAndNumbers } = require('../helpers/regex')

exports.validateSignup = (email, pw, confirmPw) => {
  if (!email || !pw || !confirmPw)
    return { ok: false, message: 'Please, fill all fields' }
  if (!validator.isEmail(email))
    return { ok: false, message: 'Email should be a valid address' }
  if (pw.length < 8)
    return { ok: false, message: 'Password must be 8 characters minimum' }
  if (!onlyLettersAndNumbers(pw))
    return { ok: false, message: 'Password must be letters and numbers' }
  if (pw !== confirmPw)
    return { ok: false, message: 'Passwords should be equal' }
  return { ok: true }
}

exports.validateLogin = (email, pw) => {
  if (!email || !pw) return { ok: false, message: 'Please, fill all fields' }
  if (!validator.isEmail(email))
    return { ok: false, message: 'Email should be a valid address' }
  return { ok: true }
}

exports.validateChangePw = (old_pw, new_pw, repeat_pw) => {
  if (!old_pw || !new_pw || !repeat_pw)
    return { ok: false, message: 'Please, fill all fields' }
  if (new_pw !== repeat_pw)
    return { ok: false, message: 'Passwords must match' }
  if (old_pw === new_pw)
    return { ok: false, message: 'Cannot change for the same password' }
  if (new_pw.length < 8)
    return { ok: false, message: 'Password must be 8 characters minimum' }
  if (!onlyLettersAndNumbers(new_pw))
    return { ok: false, message: 'Password must be letters and numbers' }
  return { ok: true }
}

exports.validateForgotPw = email => {
  if (!validator.isEmail(email)) return false
  return true
}
