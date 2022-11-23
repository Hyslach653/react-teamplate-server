const argon2 = require('argon2')

exports.hashPw = async pw => {
  return await argon2.hash(pw)
}

exports.verifyPw = async (pw1, pw2) => {
  return await argon2.verify(pw2, pw1)
}
