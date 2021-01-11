const router = require('express').Router();

const admin = require('../firebaseAdmin.js');
const db = admin.firestore();
const activityCollection = db.collection("activities");

const ViewVariable = require('../model/ViewVariable.js');
const uuid = require('uuid');

const LIMIT_TO_GET = 20;

/**
 * 参照系
 */
router.get('/list', function(req, res, next) {
    var ncId = req.query.ncId;
    var oldestDate = req.query.oldestDate;
    if (oldestDate == null) oldestDate = dateFormat(new Date(), "yyyy-M-D");

    activityCollection
    .where('newcomerId', '==', ncId)
    .where('date', '<', oldestDate)
    .orderBy("date", "desc")
    .limit(LIMIT_TO_GET)
    .get().then(function(querySnapshot) {
        var activityList = [];
        querySnapshot.forEach(function(doc) {
            activityList.push(doc.data());
        });
        res.send(activityList);
    }).catch(function() {
          res.send([]);
    }).finally(function() {
    });

});

function dateFormat(date, format) {
    format = format.replace(/yyyy/, date.getFullYear());
    format = format.replace(/MM/, zeroPad(date.getMonth() + 1));
    format = format.replace(/DD/, zeroPad(date.getDate()));
    return format;
}

function zeroPad(val) {
    return ("00" + val).slice(-2);
}

router.get('/events', function(req, res, next) {
    activityCollection.where('type', '==', '器').get()
    .then(function(querySnapshot) {
        var eventList = [];
        querySnapshot.forEach(function(doc) {
            eventList.push(doc.get("event"));
        });
        res.send(eventList);
    }).catch(function() {
          res.send([]);
    }).finally(function() {
    });
});

//router.get('/lecturers', function(req, res, next) {
//    activityCollection.where('type', '!=', '器').get()
//    .then(function(querySnapshot) {
//        var lecturerList = [];
//        querySnapshot.forEach(function(doc) {
//            lecturerList.push(doc.get("lecturer"));
//        });
//        res.send(lecturerList);
//    }).catch(function() {
//          res.send([]);
//    }).finally(function() {
//    });
//});

router.get('/lectures-except-bs', function(req, res, next) {
    activityCollection.where('type', '==', 'BS以外の講義').get()
    .then(function(querySnapshot) {
        var lectureList = [];
        querySnapshot.forEach(function(doc) {
            lectureList.push(doc.get("lecture"));
        });
        res.send(lectureList);
    }).catch(function() {
          res.send([]);
    }).finally(function() {
    });
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
    activity["createdAt"] = timestamp;
    activity["updatedAt"] = timestamp;

    activityCollection.doc(activityId).set(activity);

    res.send("activity reported.");
});


/**
 * 更新系
 */


/**
 * 削除系
 */



module.exports = router;