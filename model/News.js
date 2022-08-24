const mongoose = require('../db')

const NewsSchema = new mongoose.Schema({
    id: Number,
    end_year: String,
    intensity: String,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: Date,
    published: Date,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number,
})


// Use pre middleware for auto-increment id
NewsSchema.pre("save", async function (next) {
        // Only increment when the document is new
        if (this.isNew) {
            try{
                const count = await News.count()
                const lastId = (await News.find().select("id"))
                    .map(el=>el.id).sort((a,b)=>b-a)[0] || count
                console.log(lastId)
                this.id = (lastId+1) // Increment count
                next()
            }
            catch(err){ next(err) }
        } else {
            next()
      }
})
                
const News = mongoose.model("News", NewsSchema)

module.exports = News

// for Entries of records with id

// const data = require('../jsondata.json')
// let counter = 0, count = data.length
// async function addEntries(){
//     if (counter >= count)
//         return
//     let news = new News(data[counter])
//     await news.save()
//     counter++
//     addEntries()
// }
// addEntries()