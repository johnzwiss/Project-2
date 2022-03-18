
  
////////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')

// we need our Fruit MODEL because comments are ONLY a schema
// so we'll run queries on fruits, and add in comments
const Book = require('../models/book')

////////////////////////////////////////////
// Create router
////////////////////////////////////////////
const router = express.Router()

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// only need two routes for comments right now
// POST -> to create a comment
router.post('/:bookId', (req, res) => {
    const bookId = req.params.bookId
    console.log('first comment body', req.body)
    console.log("the session is", req.session.username)
    
    
    // we'll adjust req.body to include an author
    // the author's id will be the logged in user's id
    req.body.author = req.session.userId
    console.log('updated comment body', req.body)
    // we'll find the fruit with the fruitId
    Book.findById(bookId)
        .then(book => {
            // then we'll send req.body to the comments array
            book.comments.push(req.body)
            
            // save the fruit
            return book.save()
        })
        .then(book => {
            // redirect
            res.redirect(`/books/${book.id}`)
            console.log("the author is",  book.comments.author)
        })
        // or show an error if we have one
        .catch(error => {
            console.log(error)
            res.send(error)
        })
})

// DELETE -> to destroy a comment

router.delete('/delete/:bookId/:commId', (req, res) => {
    // first we want to parse out our ids
    const bookId = req.params.bookId
    const commId = req.params.commId
    // then we'll find the fruit
    Book.findById(bookId)
        .then(book => {
            const theComment = book.comments.id(commId)
            // only delete the comment if the user who is logged in is the comment's author
            if ( theComment.author == req.session.userId || req.session.username == process.env.ADMINNAME ) {
                // then we'll delete the comment
                theComment.remove()
                // return the saved fruit
                return book.save()
            } else {
                return
            }

        })
        .then(book => {
            // redirect to the fruit show page
            res.redirect(`/books/${bookId}`)
        })
        .catch(error => {
            // catch any errors
            console.log(error)
            res.send(error)
        })
})

////////////////////////////////////////////
// Export the Router
////////////////////////////////////////////
module.exports = router