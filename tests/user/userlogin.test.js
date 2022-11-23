const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

// to run: npm test
describe('Express b1ex01', () => {
  const date = Date.now()
  it("Hitting POST '/user/login' with no email should return { ok: false, body: 'Please, fill all fields' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/login`,
      {
        email: '',
        password: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Please, fill all fields')
  })
  it("Hitting POST '/user/login' with no password should return { ok: false, body: 'Please, fill all fields' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/login`,
      {
        email: 'a@a.com',
        password: ''
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Please, fill all fields')
  })
  it("Hitting POST '/user/login' with bad email should return { ok: false, body: 'Email should be a valid address' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/login`,
      {
        email: 'aa.com',
        password: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Email should be a valid address')
  })
  it("Hitting POST '/user/login' with a non-existing user should return { ok: false, body: 'Incorrect credentials }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/login`,
      {
        email: `${date}@a.com`,
        password: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Incorrect credentials')
  })
  it("Hitting POST '/user/login' with an incorrect password should return { ok: false, body: 'Incorrect credentials }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/login`,
      {
        email: `${date}@a.com`,
        password: 'example12345'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Incorrect credentials')
  })
  it("Hitting POST '/user/signup' with a non-existing user should return { ok: true, body: user }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: `${date}@a.com`,
        password: 'example1234',
        confirmPassword: 'example1234'
      }
    )
    expect(res.data.ok).toBe(true)
    expect(res.data.body.email).toBe(`${date}@a.com`)
  })
  it("Hitting POST '/user/login' with an existing user should return { ok: true, body: user }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/login`,
      {
        email: `${date}@a.com`,
        password: 'example1234'
      }
    )
    expect(res.data.ok).toBe(true)
    expect(res.data.body.email).toBe(`${date}@a.com`)
  })
  it("Hitting DELETE '/user/delete/:email' with an existing user should return { ok: true, body: 'User deleted successfully' }", async () => {
    const res = await axios.delete(
      `http://localhost:${process.env.PORT}/user/delete/${date}@a.com`
    )
    expect(res.data.ok).toBe(true)
    expect(res.data.body).toBe(`User ${date}@a.com deleted successfully`)
  })
})
