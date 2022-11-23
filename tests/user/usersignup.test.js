const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

// to run: npm test
describe('Express b1ex01', () => {
  const date = Date.now()
  it("Hitting POST '/user/signup' with no email should return { ok: true, body: 'Please, fill all fields' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: '',
        password: 'example1234',
        confirmPassword: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Please, fill all fields')
  })
  it("Hitting POST '/user/signup' with no password should return { ok: true, body: 'Please, fill all fields' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: 'a@a.com',
        password: '',
        confirmPassword: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Please, fill all fields')
  })
  it("Hitting POST '/user/signup' with no confirmPassword should return { ok: true, body: 'Please, fill all fields' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: 'a@a.com',
        password: 'example1234',
        confirmPassword: ''
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Please, fill all fields')
  })
  it("Hitting POST '/user/signup' with bad email should return { ok: true, body: 'Email should be a valid address' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: 'aa.com',
        password: 'example1234',
        confirmPassword: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Email should be a valid address')
  })
  it("Hitting POST '/user/signup' with password length < 8 should return { ok: true, body: 'Password must be 8 characters minimum' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: 'a@a.com',
        password: 'example',
        confirmPassword: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Password must be 8 characters minimum')
  })
  it("Hitting POST '/user/signup' with not matching passwords should return { ok: true, body: 'Passwords should be equal' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: 'a@a.com',
        password: 'example1234',
        confirmPassword: 'example123'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('Passwords should be equal')
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
  it("Hitting POST '/user/signup' with an existing user should return { ok: true, body: 'User already exists' }", async () => {
    const res = await axios.post(
      `http://localhost:${process.env.PORT}/user/signup`,
      {
        email: `${date}@a.com`,
        password: 'example1234',
        confirmPassword: 'example1234'
      }
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe('User already exists')
  })
  it("Hitting DELETE '/user/delete/:email' with an existing user should return { ok: true, body: 'User deleted successfully' }", async () => {
    const res = await axios.delete(
      `http://localhost:${process.env.PORT}/user/delete/${date}@a.com`
    )
    expect(res.data.ok).toBe(true)
    expect(res.data.body).toBe(`User ${date}@a.com deleted successfully`)
  })
  it("Hitting DELETE '/user/delete/:email' with a non-existing user should return { ok: true, body: 'User <email> not found' }", async () => {
    const res = await axios.delete(
      `http://localhost:${process.env.PORT}/user/delete/${date + 1}@a.com`
    )
    expect(res.data.ok).toBe(false)
    expect(res.data.body).toBe(`User ${date + 1}@a.com not found`)
  })
})
