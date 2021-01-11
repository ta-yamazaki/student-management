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
    var userId = req.query.userId;
    userCollection.doc(userId).get()
    .then(function(doc) {
        res.send(doc.get("favoriteNcIds"));
    }).catch(function() {
          res.send([]);
    }).finally(function() {
    });
});


/**
 * 登録系
 */
router.post('/add', function(req, res, next) {
    var ncId = req.body.ncId;
    var userId = req.body.userId;

    userCollection.doc(userId).update({
        favoriteNcIds: admin.firestore.FieldValue.arrayUnion(ncId)
    }).then(function() {
        res.status(200).send("add favorite success.");
    }).catch(function(e) {
        console.log(e);
        res.status(500).send("add favorite failed.");
    }).finally(function() {
    });
});


/**
 * 更新系
 */



/**
 * 削除系
 */
router.post('/remove', function(req, res, next) {
    var ncId = req.body.ncId;
    var userId = req.body.userId;

    userCollection.doc(userId).update({
        favoriteNcIds: admin.firestore.FieldValue.arrayRemove(ncId)
    }).then(function() {
        res.status(200).send("add favorite success.");
    }).catch(function(e) {
        console.log(e);
        res.status(500).send("add favorite failed.");
    }).finally(function() {
    });
});



module.exports = router;