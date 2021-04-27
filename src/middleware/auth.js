import jwt from 'jsonwebtoken'
import Bcryptdata from '../models/registerd.js'

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
    console.log(verifyUser)
    const user = await Bcryptdata.findOne({ _id: verifyUser._id })
    console.log(user)

    req.token = token
    req.user = user

    next()
  } catch (error) {
    res.status(401).send(error)
  }
}
export default auth
