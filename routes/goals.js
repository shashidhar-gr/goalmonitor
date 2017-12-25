var express = require('express');
var router = express.Router();
var randomdata = require('../utils/randomdata');

/* GET goal details. */
router.get('/:goalid', function(req, res, next) {
  const db = req.app.locals.db;
  
  //input validation
  if(req.params.goalid) {
  
    db.collection('goals').find({_id: req.params.goalid}).toArray(function(err, docs) {
      if(err) {
        throw err;
      }
      else {
        if(docs.length > 0)
          res.status(200).send({"success": true, statusCode: 200, res: docs});
        else
          res.status(404).send({"success": false, statusCode: 404, res: "Couldn't found goal details."});
      }
    });
  }
  else{
    res.status(400).send({"success": false, statusCode: 400, res: "Inputs are not proper"});
  }
});

/* Goal registration */
router.post('/', function(req, res, next) {
  const db = req.app.locals.db;

  //input validation
  if(req.body.userid && req.body.name && req.body.tags && req.body.description && req.body.achiveDate) {
    
    var goalObj = {
      _id :  "GOAL"+randomdata.getRandomInteger(),
      name: req.body.name,
      tags: req.body.tags.split(","),
      description: req.body.description,
      achiveDate: req.body.achiveDate,
      status: "NotInitialized",
      progress: '',
      mainTask: [],
      subTask: [],
      user: req.body.userid,
      createdAt: new Date(),
      lastUpdatedAt: new Date()
    }

    db.collection('goals').insert(goalObj, function(err, doc) {
      if(err) 
        throw err;

        db.collection('users').update(
          { _id: req.body.userid },
          { 
            $set: 
            {
              lastUpdatedAt: new Date()
            },
            $addToSet: 
            {
              goals: doc.ops[0]._id
            }
          }, function(err, updateRes) {
          if(err)
            throw err;

            res.status(200).send({"status": true, statusCode: 200, res: "Goal added succesfully"});
        });
    });
  }
  else{
    res.status(400).send({"status": false, statusCode: 400, res: "Inputs are not proper"});
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
          res.status(200).send({"success": false, statusCode: 200, res: "Invalid userid, userid already in use"});
        else
          res.status(200).send({"success": true, statusCode: 200, res: "Valid userid"});
      }
    });
  }
  else{
    res.status(400).send({"success": false, statusCode: 400, res: "Inputs are not proper"});
  }
});

module.exports = router;
