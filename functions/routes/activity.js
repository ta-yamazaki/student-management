const router = require('express').Router();

const admin = require('../firebaseAdmin.js');
const db = admin.firestore();
const activitiesCollection = db.collection("activities");

const ViewVariable = require('../model/ViewVariable.js');
const uuid = require('uuid');


/**
 * 参照系
 */
router.get('/events', function(req, res, next) {

});

router.get('/lecturers', function(req, res, next) {
//userListと過去の講師をマージ
});

router.get('/lectures-except-bs', function(req, res, next) {

});


/**
 * 登録系
 */
router.post('/schedule', function(req, res, next) {

});

router.post('/report', function(req, res, next) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    var activity = req.body.activity;
    if (activity == null) throw Error("'activity' parameter is not exists.");

    var activityId = uuid.v4();
    activity["id"] = activityId;

    var createdBy =
    profile["createdAt"] = timestamp;
    profile["updatedAt"] = timestamp;

    activitiesCollection.doc(activityId).set(data);

    res.send("activity reported.");
});


/**
 * 更新系
 */


/**
 * 削除系
 */



module.exports = router;