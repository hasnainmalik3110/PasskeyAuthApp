const express = require('express')
const router = express.Router()
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} = require('@simplewebauthn/server')
const crypto = require('node:crypto')
const User = require('../models/User')

const challengeStore = {}

if (!globalThis.crypto) globalThis.crypto = crypto;

// REGISTER USER
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  
  console.log('Email:', email); // Log to ensure the email is being received correctly

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' })
  }

  const user = new User({ username, password, email })
  await user.save()
  res.json({ id: user._id })
})



// GENERATE REGISTRATION CHALLENGE
router.post('/register-challenge', async (req, res) => {
  const { userId } = req.body
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const options = await generateRegistrationOptions({
    rpID: 'localhost',
    rpName: 'My Localhost App',
    userName: user.username,
    timeout: 60000,
  })

  challengeStore[userId] = options.challenge
  res.json({ options })
})

// VERIFY REGISTRATION RESPONSE
router.post('/register-verify', async (req, res) => {
  const { userId, cred } = req.body
  const user = await User.findById(userId)
  const expectedChallenge = challengeStore[userId]

  const verification = await verifyRegistrationResponse({
    expectedChallenge,
    expectedOrigin: 'http://localhost:3000',
    expectedRPID: 'localhost',
    response: cred,
  })

  if (!verification.verified) return res.json({ error: 'Verification failed' })

  user.passkey = verification.registrationInfo
  await user.save()

  res.json({ verified: true })
})

// LOGIN CHALLENGE
router.post('/login-challenge', async (req, res) => {
  const { userId } = req.body
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const opts = await generateAuthenticationOptions({ rpID: 'localhost' })
  challengeStore[userId] = opts.challenge

  res.json({ options: opts })
})

// VERIFY LOGIN
router.post('/login-verify', async (req, res) => {
  const { userId, cred } = req.body
  const user = await User.findById(userId)
  const expectedChallenge = challengeStore[userId]

  const result = await verifyAuthenticationResponse({
    expectedChallenge,
    expectedOrigin: 'http://localhost:3000',
    expectedRPID: 'localhost',
    response: cred,
    authenticator: user.passkey
  })

  if (!result.verified) return res.json({ error: 'Auth failed' })
  res.json({ success: true })
})

module.exports = router
