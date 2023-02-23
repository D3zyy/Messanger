const express = require("express");
const app = express();

app.set('view engine', 'ejs');
var sql = require("mssql");
const mysql = require('mysql2');
const session = require('express-session');
const cookieParser = require("cookie-parser");

const fs = require('fs');
app.use(cookieParser());

app.use('/public', express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(session({
	secret: 'secret',
	cookie: { maxAge: 500000},
	resave: false,
	saveUninitialized: false

}));

const connection  = mysql.createConnection({
	host : "sql8.freemysqlhosting.net",
	user : "sql8597540",
	password : "JUmqiUcLHW",
	port : "3306",
	database :  "sql8597540",

});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Připojeno k databázi!");
});

app.get("/", (req, res) => {
    req.session.loggedin = false
    req.session.username = null;


res.render("login" );
});






  app.listen(200, function () {
    console.log('aplikace beží');
  });