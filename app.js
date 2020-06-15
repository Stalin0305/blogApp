var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var date=require('date-time');
var dbs;
var MongoClient=require('mongodb').MongoClient;
MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true, useUnifiedTopology: true},function(err,db){
  if(err) console.log("database connection error");
  dbs=db.db('BlogApp');
  // dbs.collection('Blogs').insertOne({ title: "test blog 1", image: "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg", body: "this is a test blog description", created: date()}, function (err, r) {
  //   if (err) next(err);
  //   console.log(r);
  // }); 
  console.log('Database connected');
  // console.log(dbs);
});

// console.log(dbs);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//ROUTES
app.get("/",function(req,res){
  res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
  dbs.collection('Blogs').find({}).toArray(function(err,result){
    if(err) console.log(err);
    res.render('index', { blog: result });
  });
});

app.get("/blogs/new",function(req,res){
  res.render('NewPost');
})
  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
