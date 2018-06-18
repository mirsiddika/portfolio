var express = require("express");
var app = express();
var router = express.Router();
const { Pool, Client } = require('pg')
app.use(express.static('public'));
var path = __dirname + '/views/';
var bodyParser = require('body-parser');//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
var urlencodedString = bodyParser.urlencoded({extended: true});
const pool = new Pool({
  user: 'mirsiddika', //env var: PGUSER
  host: 'localhost',  // Server hosting the postgres database
  database: 'postgres', //env var: PGDATABASE
  password: '', //env var: PGPASSWORD
  port: 5432, //PGPORT
    //max: 10, // max number of clients in the pool
  //idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
});

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/post",function(req,res){
  res.sendFile(path + "post.html");
});

router.post('/post',urlencodedString,function(req,res){
/*
   After the submit button is clicked, this will insert the
   values into the database and after success will render the display
*/ 
	var query = {
		text: 'insert into posts (name,email,message) values ($1,$2,$3)',
		values: [req.body.name,req.body.email,req.body.message]
	}
	pool.query(query,(err,res1)=>{
		if(!err){
			res.sendFile(path + 'post.html');
		}
		console.log(err);
	});
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});