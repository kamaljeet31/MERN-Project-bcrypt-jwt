import mongoose from 'mongoose'

mongoose
  .connect(process.env.CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((req, res) => {
    console.log('connection successful')
  })
  .catch((err) => {
    console.log('no connection')
  })
