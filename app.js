const express = require("express");
const app = express();

app.set('view engine', 'ejs');
var sql = require("mssql");
const mysql = require('mysql2');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
	  host : "localhost",
    user : "root",
    password : "rootroot",
    port : "3306",
    database :  "messanger",

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



app.get("/", (req, res) => {
    req.session.loggedin = false
    req.session.username = null;


res.render("login" );
});
app.post("/", (req, res) => {
    jmeno = req.body.jmeno;
    heslo = req.body.heslo;
  
    if(jmeno && heslo) {
        
        
        connection.query('SELECT jmeno,heslo,id_uzivatel  FROM uzivatele WHERE jmeno = ? AND heslo = ? ' , [jmeno, heslo], function(error, results) {
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.username = jmeno;
                res.redirect("/poslatZpravu");
            } else {
               res.redirect("/");
            }
           
        
        });
        
    }else {
        res.redirect("/");
    }


});



app.post("/poslatZpravu", (req, res) => {
  
  
    if(req.session.loggedin === true) {
    let str = req.body.prijemci;
    let prijemci = str.split(",");
    let  zprava = req.body.zprava;
    let predmet = req.body.predmet;
    
    let datum = new Date();
    let mysqlDate = datum.toISOString().slice(0, 10);
    let mysqlTime = datum.toTimeString().slice(0, 8);
    connection.query('SELECT id_uzivatel from uzivatele WHERE jmeno =  ? ' , [req.session.username], function(error, results) {
    idOdesilatel = results[0].id_uzivatel;
    for(let i = 0; i < prijemci.length; i++) {

connection.query('SELECT id_uzivatel from uzivatele WHERE jmeno =  ? ' , [prijemci[i]], function(error, results) {
 if(results.length > 0) {
    idPrijimatel = results[0].id_uzivatel
 

    connection.query('INSERT INTO zpravy(predmet,id_prijimatel,id_odesilatel,textt,datum,cas)  VALUES(?,?,?,?,?,?)' , [predmet,idPrijimatel,idOdesilatel,zprava,mysqlDate,mysqlTime], function(error, results) {
      
                
                });

 }; 
    

    });
    }
    res.redirect("odeslaneZpravy")
});
   
    
        
    }else {
        res.redirect("/");
    }


});

app.get("/odeslaneZpravy", (req, res) => {
  
  
    if(req.session.loggedin === true) {
        connection.query("SELECT id_zprava,viditelne,prijimatel.jmeno AS jmeno_prijemce, odesilatel.jmeno AS jmeno_odesilatele, textt, DATE_FORMAT(datum, '%d.%m.%Y') AS den_mesic_rok, TIME_FORMAT(cas, '%H:%i') AS hodiny_minuty, predmet FROM zpravy JOIN uzivatele AS prijimatel ON zpravy.id_prijimatel = prijimatel.id_uzivatel JOIN uzivatele AS odesilatel ON zpravy.id_odesilatel = odesilatel.id_uzivatel where id_odesilatel = (SELECT id_uzivatel from uzivatele where jmeno = ?)", req.session.username,function(error, results) {
            if (error) throw error;
        
            zpravy = results;
           
        
            res.render("odeslaneZpravy", { jmeno: req.session.username });  
        });
        



           
        
    }else {
        res.redirect("/");
    }


});


app.get("/doruceneZpravy", (req, res) => {
  
  
    if(req.session.loggedin === true) {
        connection.query("SELECT id_zprava,viditelneDorucene,prijimatel.jmeno AS jmeno_prijemce, odesilatel.jmeno AS jmeno_odesilatele, textt, DATE_FORMAT(datum, '%d.%m.%Y') AS den_mesic_rok, TIME_FORMAT(cas, '%H:%i') AS hodiny_minuty, predmet FROM zpravy JOIN uzivatele AS prijimatel ON zpravy.id_prijimatel = prijimatel.id_uzivatel JOIN uzivatele AS odesilatel ON zpravy.id_odesilatel = odesilatel.id_uzivatel where id_prijimatel = (SELECT id_uzivatel from uzivatele where jmeno = ?)", req.session.username,function(error, results) {
            if (error) throw error;
     
            zpravy = results;
           
        
            res.render("doruceneZpravy", { jmeno: req.session.username });  
        });
        



           
        
    }else {
        res.redirect("/");
    }


});


app.post("/skrytZpravu", (req, res) => {
    if(req.session.loggedin === true){
        
        connection.query("UPDATE zpravy set viditelne = ? where id_zprava = ?", ['ne',req.body.id_zprava],function(error, results){

            res.send();


        });

        
    } else{
     res.redirect("/");
    }
});

app.post("/skrytZpravuDorucene", (req, res) => {
    if(req.session.loggedin === true){
       
        connection.query("UPDATE zpravy set viditelneDorucene = ? where id_zprava = ?", ['ne',req.body.id_zprava],function(error, results){

            res.send();


        });

        
    } else{
     res.redirect("/");
    }
});


app.get("/poslatZpravu", (req, res) => {
   if(req.session.loggedin === true){
res.render("poslatZpravu");
   } else{
    res.redirect("/");
   }


res.render("login" );
});







  app.listen(200, function () {
    console.log('aplikace beží');
  });