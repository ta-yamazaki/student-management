const router = require('express').Router();

const admin = require('firebase-admin');
const ServiceAccount = require('../ServiceAccount.json');
admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) });
const db = admin.firestore();

const ViewVariable = require('../model/ViewVariable.js');

const ncList = [
    {
        id: 1,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        name: 'たろう',
        belongs: '○○大学2年',
        memo: "",
    },
    {
        id: 2,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        name: 'じろう',
        belongs: '社会人',
        memo: "<span class='text--primary'>to Alex, Scott, Jennifer</span>",
    },
    {
        id: 3,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
        name: 'けん',
        belongs: '◇◇高校3年',
        memo: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?",
    },
];


/* GET home page. */
router.get('/nc/list', function(req, res, next) {

//    var newcomers = [];
//    db.collection("newcomers").get().then(function(querySnapshot) {
//        querySnapshot.forEach(function(doc) {
//            newcomers.push(doc.data());
//        });
//
//        var viewVariable = new ViewVariable();
//        viewVariable.put("newcomers", newcomers);
//        viewVariable.put("title", "new Firebase2");
//        res.render("index.ejs", viewVariable.getData);
//    }).finally(function() {
//    });

      res.send(ncList);
});


router.get('/nc/detail/:id', function(req, res, next) {

//    var data2 = db.collection("users").where("id", "==", 2).get().data();


    const ncId = req.params.id;
    ncList.forEach(function(nc) {
        if (nc.id == ncId) res.send(nc);
    });

    throw Error("NC情報が見つかりません: ID = " + id);
});

module.exports = router;