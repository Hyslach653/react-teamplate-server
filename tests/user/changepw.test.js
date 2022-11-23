const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

// steps:
// - create user
// - save sent token
// - put token in headers
// - use token to get user to check password
// - check if password is correct or not
// - delete user

// to run: npm test
describe('Express b1ex01', () => {
  const date = Date.now()
  it("Hitting POST '/user/signup' with a non-existing user should return { ok: true, body: user }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: `${date}@a.com`,
        password: 'example1234',
        confirmPassword: 'example1234'
      }
    )
    axios.defaults.headers.common['Authorization'] = res.data.body.token // set token for all api calls
    expect(res.data.ok).toBe(true)
    expect(res.data.body.email).toBe(`${date}@a.com`)
  })
  it("Hitting POST '/user/change_pw' with no passwords should return { ok: false, body: 'Please, fill all fields' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/change_pw`
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Please, fill all fields')
  })
  it("Hitting POST '/user/login' with correct old_pw but unmatching new passwords should return { ok: false, body: 'Passwords must match' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/change_pw`,
      {
        old_pw: 'example1234',
        new_pw: 'test1234',
        repeat_pw: 'test12345'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Passwords must match')
  })
  it("Hitting POST '/user/login' with correct old_pw but same new passwords should return { ok: false, body: 'Cannot change for the same password' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/change_pw`,
      {
        old_pw: 'example1234',
        new_pw: 'example1234',
        repeat_pw: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Cannot change for the same password')
  })
  it("Hitting POST '/user/login' with incorrect password should return { ok: false, body: 'Incorrect credentials' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/change_pw`,
      {
        old_pw: '12345',
        new_pw: '1234',
        repeat_pw: '1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Incorrect credentials')
  })
  it("Hitting POST '/user/login' with correct credentials should return { ok: true, body: 'Password changed successfully' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/change_pw`,
      {
        old_pw: 'example1234',
        new_pw: 'test1234',
        repeat_pw: 'test1234'
      }
    )
    expect(res.data.ok).toBe(true)
    expect(res.data.body).toBe('Password changed successfully')
  })
  it("Hitting DELETE '/user/delete/:email' with an existing user should return { ok: true, body: 'User deleted successfully' }", async () => {
    const res = await axios.delete(
      `http://localhost:${process.env.PORT}/user/delete/${date}@a.com`
    )
    expect(res.data.ok).toBe(true)
    expect(res.data.body).toBe(`User ${date}@a.com deleted successfully`)
  })
})
