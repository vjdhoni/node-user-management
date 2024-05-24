require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const seed = require('./seed.js')

const userRouter = require('./Routes/user.routes')

app.use(express.json())
app.use(cors())

app.use('/api/v1/user', userRouter)

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    // authSource: 'admin',
}, (err, con) => {
    if (err) throw Error('Mongodb Connection Error ' + err)
    if (con) console.log('Mongodb Connecting Successfully')
})

// seed();

const PORT = process.env.PORT || 4200

app.listen(PORT, () => {
    console.log(`Server Start Successfully PORT : ${PORT}`)
})
