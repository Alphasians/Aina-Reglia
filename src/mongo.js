const mongoose = require('mongoose')
module.exports = async () => {

await mongoose.connect(process.env.mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
return mongoose
}