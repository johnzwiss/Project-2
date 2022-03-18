// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const Book = require('../models/book')
const fetch = require('node-fetch')


// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	Book.find({})
		.then(books => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			console.log(req.session.username)
			console.log(books)
			res.render('books/index', { books, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's examples
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Book.find({ $or: [{owner: userId}, {checkedOutBy: userId}] })
		.then(books => {
			res.render('books/mine', { books, username, loggedIn, userId })
			console.log(books.owner)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new/:id', (req, res) => {
	const { username, userId, loggedIn } = req.session
	const bookId = req.params.id
	fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${bookId}&key=${process.env.APIKEY}`)
		
	.then(response => response.json())
	.then(data => {
		console.log("this is the data", data.items)
		const books = data.items[0]
		res.render('books/new', {data: data, books: books, username, loggedIn})
	
	
	});
	// res.render('books/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.available = req.body.available === 'on' ? true : false
	console.log(req.body)

	req.body.owner = req.session.userId
	Book.create(req.body)
		.then(book => {
			console.log('this was returned from create', book.title)
			res.redirect('/books')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

//search route

router.get('/search', (req, res) => {
	const { username, userId, loggedIn } = req.session
	
	res.render("books/search")})
	
	router.post('/search', (req, res) => {
		// set the password to hashed password
		
	 
		console.log(req.body)
		fetch(`https://www.googleapis.com/books/v1/volumes?q=${req.body.search}&key=${process.env.APIKEY}`)
		
	.then(response => response.json())
	.then(data => {
		const books = data.items
		res.render('books/search', {data: data, books: books})
		// console.log(data.items[0].volumeInfo.industryIdentifiers[0].identifier)
	
	
	});
		
	})
	
	
	  
 


// checkout book
router.put('/:id', (req, res) => {
	const bookId = req.params.id
	req.body.available = req.body.available === 'on' ? true : false
	req.body.checkedOutBy = req.session.userId

	Book.findByIdAndUpdate(bookId, req.body, { new: true })
		.then(book => {
			console.log(book)
			res.redirect(`/books/mine`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})



// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const bookId = req.params.id
	Book.findById(bookId)
		.then(book => {
			res.render('books/edit', { book })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const bookId = req.params.id
	req.body.available = req.body.available === 'on' ? true : false

	Book.findByIdAndUpdate(bookId, req.body, { new: true })
		.then(book => {
			res.redirect(`/books/${book.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const bookId = req.params.id

	Book.findById(bookId)
		.then(book => {
			console.log(book)
            const {username, loggedIn, userId} = req.session
			const adminName = process.env.ADMINNAME
			res.render('books/show', { book, username, loggedIn, userId, adminName })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const bookId = req.params.id
	Book.findByIdAndRemove(bookId)
		.then(book => {
			res.redirect('/books')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

//preview route

router.get('/preview/:id', (req, res)=>{
	const bookId = req.params.id
	Book.findById(bookId)
		.then(book => {
			console.log(book.isbn)
            const {username, loggedIn, userId} = req.session
			const adminName = process.env.ADMINNAME
			res.render('preview', { book, username, loggedIn, userId, adminName })
		})
}
)

// Export the Router
module.exports = router