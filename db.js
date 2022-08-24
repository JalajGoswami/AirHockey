const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/DataVisualization',
    ()=> console.log('Connected to DB'),
    (err)=> console.log(err)
)

module.exports = mongoose