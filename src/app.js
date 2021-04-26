// import { config } from 'dotenv'
// config()
import 'dotenv/config.js'
import express from 'express'
import('./db/conn.js')
import hbs from 'hbs'
import bcrypt from 'bcrypt'

import Bcryptdata from './models/registerd.js'
import path from 'path'

console.log(process.env.SECRET_KEY)

//we need to change up how __dirname is used for ES6 purposes
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const static_path = path.join(__dirname, '../public')

const template_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

app.use(express.static(static_path))

app.set('view engine', 'hbs')
app.set('views', template_path)
hbs.registerPartials(partials_path)

app.get('/', (req, res) => {
  console.log('hello from get')
  res.render('index')
})

app.get('/register', (req, res) => {
  console.log('hello from get')
  res.render('register')
})

app.post('/register', async (req, res) => {
  try {
    const password = req.body.password
    const cpassword = req.body.confirmpassword
    if (password === cpassword) {
      const registeremployee = new Bcryptdata({
        name: req.body.name,
        email: req.body.email,
        password: password,
        confirmpassword: cpassword,
      })

      console.log('the success part' + registeremployee)

      const token = await registeremployee.generateAuthToken()
      console.log('the token part ' + token)

      const registered = await registeremployee.save()
      console.log('the page part' + registered)
      res.render('login')
    } else {
      res.send('pswd not matching')
    }
  } catch (error) {
    res.send(error)
    console.log('the error part page')
  }
})

// login page
app.get('/login', (req, res) => {
  res.render('login')
})

// login check
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    const useremail = await Bcryptdata.findOne({ email })
    const isMatch = await bcrypt.compare(password, useremail.password)

    const token = await useremail.generateAuthToken()
    console.log('the token part ' + token)

    if (isMatch) {
      res.render('index')
    } else {
      res.send('invalid password details')
    }
  } catch (error) {
    res.status(400).send('invalid login details')
  }
})

app.listen(port, () => {
  console.log(`connection is set at ${port}`)
})
