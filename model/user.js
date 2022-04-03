const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({
    // unique means username has to be unique
    // two records cannot have same username
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
},
{
    collection: 'users'
})

const model = mongoose.model('UserSchema', userSchema)

module.exports = model