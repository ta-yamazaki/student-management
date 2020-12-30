const router = require('express').Router();

const admin = require('../firebaseAdmin.js');
const db = admin.firestore();
const bsStatusCollection = db.collection("bsStatus");

const ViewVariable = require('../model/ViewVariable.js');
const uuid = require('uuid');

//const bsStatus = {
//    progress: [ "B導入", "ペテロ", "ヨシュア" ],
//    createdAt: "createdAt",
//    updatedAt: "updatedAt",
//};

router.get('/status', function(req, res, next) {
    const ncId = req.query.ncId;
    if (ncId == null) throw Error("ncIdがありません。");

    bsStatusCollection.doc(ncId).get().then(function(bsStatus) {
         res.send(bsStatus.data());
    }).catch(function(error) {
        throw Error("bsStatus could not be found.");
    });
});

router.post('/status', function(req, res, next) {
    const ncId = req.body.ncId;
    if (ncId == null) throw Error("ncId is not exists.");

    var data = {
        progress: req.body.progress,
        testimony: req.body.testimony,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    bsStatusCollection.doc(ncId).set(data);

//    res.send(uuid.v4());
    res.send("bsStatus updated.");
});

module.exports = router;