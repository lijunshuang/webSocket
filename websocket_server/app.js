const express = require('express')
const app = express()

app.get('/', (req, res) => {
    let a = 20
    res.send(`Hello World ${a}`)
})

app.listen(3000, () => console.log('listen in 3000'))