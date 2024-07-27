const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if (!isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User created successfuly"});
    } else {
        return res.status(404).json({message: 'User ${username} already exists'});
    }
  } else {
    return res.status(404).json({message: "Username or password not provided!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let authorbooks = [];

  for (let key in books){
     if(books[key]["author"] === author){
        authorbooks.push(books[key]);
     }
  }

  if(authorbooks.length > 0){
    return res.status(200).send(authorbooks);
  }else{
    return res.status(404).send("No books found for this author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let titlebooks = [];

  for (let key in books){
     if(books[key]["title"] === title){
        titlebooks.push(books[key]);
     }
  }

  if(titlebooks.length > 0){
    return res.status(200).send(titlebooks);
  }else{
    return res.status(404).send("No books found with this title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
