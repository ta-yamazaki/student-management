const router = require('express').Router();

const admin = require('../firebaseAdmin.js');
const db = admin.firestore();
const userCollection = db.collection("users");

const ViewVariable = require('../model/ViewVariable.js');
const uuid = require('uuid');

/**
 * 参照系
 */
router.get('/list', function(req, res, next) {
    userCollection.get()
    .then(function(querySnapshot) {
        var userList = [];
        querySnapshot.forEach(function(doc) {
            userList.push(doc.data());
        });
        res.send(userList);
    }).catch(function() {
          res.send([]);
    }).finally(function() {
    });
});


/**
 * 登録系
 */


/**
 * 更新系
 */


/**
 * 削除系
 */



module.exports = router;