const router = require('express').Router();

const admin = require('../firebaseAdmin.js');
const db = admin.firestore();
const ncCollection = db.collection("newcomers");
const relationCollection = db.collection("relations");

const ViewVariable = require('../model/ViewVariable.js');
const uuid = require('uuid');

const Newcomer = require('../model/Newcomer.js');

/**
 * 参照系
 */
router.get('/list', function(req, res, next) {

    ncCollection.where('isArchived', '==', false).get()
    .then(function(querySnapshot) {
        var ncList = [];
        querySnapshot.forEach(function(doc) {
            ncList.push(doc.data());
        });
        res.send(ncList);
    }).catch(function() {
          res.send([]);
    }).finally(function() {
    });

});

router.get('/detail', function(req, res, next) {
    var ncId = req.query.ncId;
    ncCollection.doc(ncId).get().then(function(nc) {
         res.send(nc.data());
    }).catch( (e) => {
        res.status(500).send(e);
    });
});

router.get('/relation', function(req, res, next) {
    var ncId = req.query.ncId;
    ncCollection.doc(ncId).get().then(function(relation) {
         res.send(relation.data());
    }).catch( (e) => {
        res.status(500).send(e);
    });
});

/**
 * 登録系
 */
router.post('/register/profile', function(req, res, next) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    var profile = req.body.profile;
    if (profile == null) throw Error("'profile' parameter is not exists.");

    var id = uuid.v4();
    profile["id"] = id;
    profile["avatar"] = { color: getAvatarColor() };
    profile["isArchived"] = false;
    profile["createdAt"] = timestamp;
    profile["updatedAt"] = timestamp;

    ncCollection.doc(id).set(profile)
    .then(function() {
        res.status(200).send("Register success.");
    })
    .catch(function(error) {
        res.status(500).send("Register failed.");
    });

    relationCollection.doc(id).set({ createdAt: timestamp });
});

function getAvatarColor() {
    const colorLabels = [
        "red", "pink", "purple", "deep-purple",
        "indigo", "blue", "light-blue", "cyan",
        "teal", "green", "light-green", "lime",
        "yellow", "amber", "orange", "deep-orange",
    ];
    const brightness = [ "darken-1", "darken-2", "darken-3", "darken-4", ];

    var colorLabel = randomChoseFrom(colorLabels);
    var brightnessLabel = randomChoseFrom(brightness);
    return colorLabel + " " + brightnessLabel;
}

function randomChoseFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 更新系
 */
router.post('/update/profile', function(req, res, next) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    var profile = req.body.profile;
    var ncId = req.body.ncId;
    delete profile["createdAt"];
    profile["updatedAt"] = timestamp;

    ncCollection.doc(ncId).update(profile)
    .then(function() {
        res.status(200).send("Update success.");
    })
    .catch(function(error) {
        res.status(500).send(error);
    });

});

router.post('/update/relation', function(req, res, next) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    var relation = req.body.relation;
    var ncId = req.body.ncId;
    delete relation["createdAt"];
    relation["updatedAt"] = timestamp;

    relationCollection.doc(ncId).update(relation)
    .then(function() {
        res.status(200).send("Update success.");
    })
    .catch(function(error) {
        res.status(500).send(error);
    });

});

router.post('/archive', function(req, res, next) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    var ncId = req.body.ncId;

    var archive = {
        ncId: ncId,
        isArchived: true,
        updatedAt: timestamp,
    };

    ncCollection.doc(ncId).update(archive)
    .then(function() {
        res.status(200).send("Update success.");
    })
    .catch(function(error) {
        res.status(500).send(error);
    });

});

router.post('/disarchive', function(req, res, next) {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    var ncId = req.body.ncId;

    var archive = {
        ncId: ncId,
        isArchived: false,
        updatedAt: timestamp,
    };

    ncCollection.doc(ncId).update(archive)
    .then(function() {
        res.status(200).send("Update success.");
    })
    .catch(function(error) {
        res.status(500).send(error);
    });

});


/**
 * 削除系
 */


module.exports = router;