var express = require('express');
var router = express.Router();
var randomdata = require('../utils/randomdata');

/* GET task details. */
router.get('/:taskid', function(req, res, next) {
  const db = req.app.locals.db;
  
  //input validation
  if(req.params.taskid) {
  
    db.collection('tasks').find({_id: req.params.taskid}).toArray(function(err, docs) {
      if(err) {
        throw err;
      }
      else {
        if(docs.length > 0)
          res.status(200).send({"success": true, statusCode: 200, res: docs});
        else
          res.status(404).send({"success": false, statusCode: 404, res: "Couldn't found task details."});
      }
    });
  }
  else{
    res.status(400).send({"success": false, statusCode: 400, res: "Inputs are not proper"});
  }
});

/* Task registration */
router.post('/', function(req, res, next) {
  const db = req.app.locals.db;

  //input validation
  if(req.body.userid && req.body.goalid && req.body.name && req.body.tags && req.body.description && req.body.achiveDate && req.body.mainTask) {
    
    var taskObj = {
      _id :  "TASK"+randomdata.getRandomInteger(),
      name: req.body.name,
      tags: req.body.tags.split(","),
      description: req.body.description,
      achiveDate: req.body.achiveDate,
      frequency: "",
      duration: "",
      timeInvested: "",
      mainTask: ( req.body.mainTask == 'true' ),
      subTask: [],
      order: 0,
      priority: 0,
      progress: '',
      status: "NotInitialized",
      user: req.body.userid,
      goalid: req.body.goalid,
      parentTaskId: req.body.parentTaskId !== undefined ? req.body.parentTaskId : null,
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
      active: true
    }

    db.collection('tasks').insert(taskObj, function(err, doc) {
      if(err) 
        throw err;

        if(req.body.mainTask == 'true') {
            db.collection('goals').update(
                { _id: req.body.goalid },
                { 
                  $set: 
                  {
                    lastUpdatedAt: new Date()
                  },
                  $addToSet: 
                  {
                      mainTask: doc.ops[0]._id
                  }
                }, function(err, updateRes) {
                if(err)
                  throw err;
      
                  res.status(200).send({"status": true, statusCode: 200, res: "Task added succesfully"});
              });
        }
        else {
            db.collection('goals').update(
                { _id: req.body.goalid },
                { 
                  $set: 
                  {
                    lastUpdatedAt: new Date()
                  },
                  $addToSet: 
                  {
                      subTask: doc.ops[0]._id
                  }
                }, function(err, updateRes) {
                if(err)
                  throw err;
                  
                  db.collection('tasks').update(
                    { _id: req.body.parentTaskId },
                    { 
                      $set: 
                      {
                        lastUpdatedAt: new Date()
                      },
                      $addToSet: 
                      {
                          subTask: doc.ops[0]._id
                      }
                    }, function(err, updateRes) {
                    if(err)
                      throw err;
          
                      res.status(200).send({"status": true, statusCode: 200, res: "Task added succesfully"});
                  });
              });
        }
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
