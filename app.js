const express = require('express')
const app = express()
require('express-async-errors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')

const connectDb = require('./db/connect')
require('dotenv').config()

const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error')

app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json())
app.use(morgan('tiny'))

// Routes
app.get('/', (req, res) => {
  res.send('Welcome gee')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
