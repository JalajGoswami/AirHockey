const express = require('express')
const app = express()
const path = require('path')
const newsApi = require('./apis/news')
const cors = require('cors')

app.use(cors())
app.use('/',express.static('frontend/build'))
app.use('/api',newsApi)

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'))
})

app.listen(process.env.port||5000,()=>{
    console.log(`Listening on Port ${process.env.port||5000}`)
})