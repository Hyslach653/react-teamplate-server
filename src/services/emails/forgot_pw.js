var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

exports.sendForgotPwEmail = async email => {
  var mailOptions = {
    from: `TEST ${process.env.EMAIL}`,
    to: email,
    subject: 'Password reset',
    text: 'test'
  }

  const res = await transporter.sendMail(mailOptions)
  // if email sent correctly this will return true, else false
  return res.accepted[0] === email
}
