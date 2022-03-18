// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

const commentSchema = require('./comment')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const BookSchema = new Schema(
	{
		title: { type: String, required: true },
		author: { type: String, required: true },
        isbn: { type: Number },
		available: { type: Boolean, required: true },
		description:{ type: String},
		img: { type: String},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		checkedOutBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		comments: [commentSchema]
	},
	
	{ timestamps: true }
)


const Book = model('Book', BookSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Book

