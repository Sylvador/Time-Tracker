const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3069

app.use(express.static(path.join(__dirname, 'static')))

app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on http://localhost:${PORT}`))
