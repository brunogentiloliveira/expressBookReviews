const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
public_users.get('/', (req, res) => {
    getBooksUsingAsyncAwait();
    return res.status(200).json({message: books});
});

async function getBooksUsingAsyncAwait() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log('Books:', response.data);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getBookISBNUsingAsyncAwait(isbn);
  return res.status(200).send(books[isbn]);
 });

 async function getBookISBNUsingAsyncAwait(isbn_final) {
    try {
        const response = await axios.get('http://localhost:5000/isbn/'+isbn_final);
        console.log('Book:', response.data);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}
  
async function getBookAuthorUsingAsyncAwait(author) {
    try {
        const response = await axios.get('http://localhost:5000/author/'+author);
        console.log('Book:', response.data);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

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
    getBookAuthorUsingAsyncAwait(author);
    return res.status(200).send(authorbooks);
  }else{
    return res.status(404).send("No books found for this author");
  }
});

async function getBookTitleUsingAsyncAwait(title) {
    try {
        const response = await axios.get('http://localhost:5000/title/'+title);
        console.log('Book:', response.data);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

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
    getBookTitleUsingAsyncAwait(title);
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
