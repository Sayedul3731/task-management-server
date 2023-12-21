const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('Task manager is running...')
})

app.listen(port, () => {
    console.log(`Task manager is running on port ${port}`)
})