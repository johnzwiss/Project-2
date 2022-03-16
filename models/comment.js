/////////////////////////////////
// import dependencies
/////////////////////////////////
require('dotenv').config()
const mongoose = require('mongoose')



const commentSchema = new mongoose.Schema({
    note: {
        type: String,
        require : true,
    
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    }
}, {
    timestamps: true

})

module.exports = commentSchema 