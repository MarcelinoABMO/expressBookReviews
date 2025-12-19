const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password)
        res.status(404).send({message: "Error logging in"});

    if (!isValid(username))
        return res.status(203).send({message: "Username already in use."});

    users[username] = {username: username, password: password};
    res.send(`User created with username \"${username}\"`);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book)
        res.send(JSON.stringify(book, null, 4));
    else
        res.status(201).send({message: "Entry not found."});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksFiltered = Object.entries(books).filter(([key, value]) => {
        return value.author === author;
    });

    if (booksFiltered.length > 0)
        res.send(JSON.stringify(Object.fromEntries(booksFiltered), null, 4));
    else
        res.status(201).send({message: `Entry \"${author}\" not found.`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksFiltered = Object.entries(books).filter(([key, value]) => {
        return value.title === title;
    });

    if (booksFiltered.length > 0)
        res.send(JSON.stringify(Object.fromEntries(booksFiltered), null, 4));
    else
        res.status(201).send({message: `Entry \"${title}\" not found.`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book)
        res.send(JSON.stringify(book.reviews, null, 4));
    else
        res.status(201).send({message: "Entry not found."});
});

module.exports.general = public_users;