const express = require('express')
const router = express.Router()
const News = require('../model/News')

router.get('/news',async(req,res)=>{
    let pageIndex = (req.query.page && Number(req.query.page)) || 1
    const data = await News.find().select('-_id -__v')
    
    if(!req.query.page)
        res.send(data)   //send all data
    else if(pageIndex > Math.ceil(data.length/50) || pageIndex < 1)
        res.redirect('?page=1')
    else
        res.send(data.slice((pageIndex-1)*50,pageIndex*50)) //pagination
})

router.get('/news/:id',async(req,res)=>{
    let id = req.params.id
    const data = await News.findOne({id}).select('-_id -__v')
    data ?
    res.send(data) :
    res.status(404).send('<h3>Sorry the News you are Looking for is not available !!</h3>')
})

module.exports = router