const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return !users[username];
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users[username];
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
        res.status(404).json({message: "Error logging in"});

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    let book = books[isbn];
    if (!book)
        res.status(201).json({message: "Entry not found."});

    const review = req.body.txt;
    book.reviews[username] = review;

    res.send("Review added!");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    let book = books[isbn];
    if (!book || !book.reviews[username])
        res.status(201).json({message: "Entry not found."});

    delete book.reviews[username];

    res.send("Review deleted!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;