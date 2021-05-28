import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'

const bcryptschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Email id already present'],
    Validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email')
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true, 
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
})

bcryptschema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id)
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({ token: token })
    await this.save()
    return token
    console.log(token)
  } catch (error) {
    res.send('the error part' + error)
    console.log('the error part' + error)
  }
}

bcryptschema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
    this.confirmpassword = await bcrypt.hash(this.password, 10)
  }
  next()
})

// create new database

const Bcryptdata = new mongoose.model('Bcryptdata', bcryptschema)
export default Bcryptdata
