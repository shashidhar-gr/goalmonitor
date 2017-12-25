var express = require('express');
var router = express.Router();

/* GET use details. */
router.get('/:userid', function(req, res, next) {
  const db = req.app.locals.db;
  
  //input validation
  if(req.params.userid) {
  
    db.collection('users').find({_id: req.params.userid}).toArray(function(err, docs) {
      if(err) {
        throw err;
      }
      else {
        if(docs.length > 0)
          res.status(200).send({success: true, successObj: docs, errorObj: null, responseText: "found user details."});
        else
          res.status(404).send({success: false, successObj: null, errorObj: null, responseText: "Couldn't found user details."});
      }
    });
  }
  else{
    res.status(400).send({success: false, successObj: null, errorObj: null, responseText: "Inputs are not proper"});
  }
});

/* User registration */
router.post('/', function(req, res, next) {
  const db = req.app.locals.db;
  
  //input validation
  if(req.body.userid && req.body.firstName && req.body.password) {
    var userObj = {
      _id :  req.body.userid,
      firstName: req.body.firstName,
      lastName: req.body.lastName !== undefined ? req.body.lastName : '',
      mobileno: req.body.mobileno !== undefined ? req.body.mobileno : '',
      goals: [],
      password: req.body.password,
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
      active: true
    }

    db.collection('users').insert(userObj, function(err, doc) {
      if(err) 
        throw err;

        res.status(200).send({success: true, successObj: doc, errorObj: null, responseText: "User added succesfully"});
    });
  }
  else{
    res.status(400).send({success: false, successObj: null, errorObj: null, responseText: "Inputs are not proper"});
  }
});

/* validate userid */
router.get('/validate/:userid', function(req, res, next) {
  const db = req.app.locals.db;
  
  //input validation
  if(req.params.userid) {
  
    db.collection('users').find({_id: req.params.userid}).toArray(function(err, docs) {
      if(err) {
        throw err;
      }
      else {
        if(docs.length > 0)
          res.status(200).send({success: false, "validUserId": false, successObj: null, errorObj: null, responseText: "Invalid userid, userid already in use"});
        else
          res.status(200).send({success: true, "validUserId": true, successObj: null, errorObj: null, responseText: "Valid userid"});
      }
    });
  }
  else{
    res.status(400).send({success: false, successObj: null, errorObj: null, responseText: "Inputs are not proper"});
  }
});

/* List goals */
router.post('/goals', function(req, res, next) {
  const db = req.app.locals.db;
  
  //input validation
  if(req.body.userid) {
  
    db.collection('goals').find({user: req.body.userid}).toArray(function(err, docs) {
      if(err) {
        throw err;
      }
      else {
        if(docs.length > 0)
          res.status(200).send({success: true, successObj: docs, errorObj: null, responseText: "found goal list"});
        else
          res.status(404).send({success: false, successObj: null, errorObj: null, responseText: "Couldn't found goal list."});
      }
    });
  }
  else{
    res.status(400).send({success: false, successObj: null, errorObj: null, responseText: "Inputs are not proper"});
  }
});
module.exports = router;
