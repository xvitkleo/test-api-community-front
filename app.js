require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const { dbConnect } = require('./config/mongo')

const PORT = process.env.PORT || 3000
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.static('public'));
app.use('/', require('./app/routes'))

app.listen(PORT, () => {
    console.log(`Tu API es http://localhost:${PORT}/`)
})