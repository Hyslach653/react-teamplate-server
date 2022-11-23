const {
  validateSignup,
  validateLogin,
  validateChangePw,
  validateForgotPw
} = require('../validations/userValidation')
const {
  checkIfUserExistsService,
  createUserService,
  deleteUserService,
  getUserService,
  getFullUserService,
  updatePassword
} = require('../services/userServices')
const { sendForgotPwEmail } = require('../services/emails/forgot_pw')
const { send } = require('../helpers/send')
const { createToken } = require('../helpers/token')
const { hashPw, verifyPw } = require('../services/argon')

exports.signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body
  try {
    const validated = validateSignup(email, password, confirmPassword)
    if (!validated.ok) return send(res, false, validated.message)
    const foundUser = await checkIfUserExistsService(email)
    if (foundUser) return send(res, false, 'User already exists')
    const hashedPw = await hashPw(password)
    const createdUser = await createUserService(email, hashedPw)
    const token = createToken(createdUser._id)
    delete createdUser._doc.password
    return send(res, true, { ...createdUser._doc, token })
  } catch (err) {
    console.error(err)
    return send(res, false, 'Something went wrong', err)
  }
}

exports.login = async (req, res) => {
  const { email, password: pwReceived } = req.body
  try {
    const validated = validateLogin(email, pwReceived)
    if (!validated.ok) return send(res, false, validated.message)
    const user = await checkIfUserExistsService(email)
    if (!user) return send(res, false, 'Incorrect credentials')
    const verified = await verifyPw(pwReceived, user.password)
    if (!verified) return send(res, false, 'Incorrect credentials')
    const token = createToken(user._id)
    delete user._doc.password
    return send(res, true, { ...user._doc, token })
  } catch (err) {
    console.error(err)
    return send(res, false, 'Something went wrong', err)
  }
}

exports.delete_user = async (req, res) => {
  const { email } = req.params
  const { user_id } = req
  try {
    const user = await getUserService(user_id)
    if (user.email !== email) return send(res, false, `Something went wrong`)
    const deleted = await deleteUserService(email)
    if (deleted) return send(res, true, `User ${email} deleted successfully`)
    return send(res, false, `User ${email} not found`)
  } catch (err) {
    console.error(err)
    return res.send({ ok: false, body: 'Something went wrong', err })
  }
}

exports.get_user_info = async (req, res) => {
  try {
    const { user_id } = req
    const user = await getUserService(user_id)
    return send(res, true, user)
  } catch (err) {}
}

exports.change_pw = async (req, res) => {
  const { old_pw, new_pw, repeat_pw } = req.body
  try {
    const validated = validateChangePw(old_pw, new_pw, repeat_pw)
    if (!validated.ok) return send(res, false, validated.message)
    const user = await getFullUserService(req.user_id)
    if (!user) return send(res, false, 'Incorrect credentials')
    const verified = await verifyPw(old_pw, user.password)
    if (!verified) return send(res, false, 'Incorrect credentials')
    const hashedPw = await hashPw(new_pw)
    await updatePassword(req.user_id, hashedPw)
    return send(res, true, `Password changed successfully`)
  } catch (err) {
    console.error(err)
  }
}

exports.forgot_pw = async (req, res) => {
  const { email } = req.body
  try {
    const validated = validateForgotPw(email)
    if (!validated) return send(res, false, 'Please, enter an email')
    const user = await checkIfUserExistsService(email)
    if (user) {
      const sent = await sendForgotPwEmail(email)
      if (!sent) return send(res, false, `Something went wrong`)
    }
    return send(res, true, `Email sent!`)
  } catch (err) {
    console.error(err)
  }
}
