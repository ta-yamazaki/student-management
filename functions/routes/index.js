const router = require('express').Router();

const admin = require('firebase-admin');
const ServiceAccount = require('../ServiceAccount.json');
admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) });
const db = admin.firestore();

const ViewVariable = require('../model/ViewVariable.js');

/* GET home page. */
router.get('/test', function(req, res, next) {


      res.send(__dirname + "aaa");

//      res.sendFile("/app/front/index.html");


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




//    db.collection("users").where("id", "==", 1)
//        .get()
//        .then(function(querySnapshot) {
//            querySnapshot.forEach(function(doc) {
//                var data = doc.data();
//             });
//                 res.render("index.ejs", data);
//        })
//        .catch(function(error) {
//            console.log(`データの取得に失敗しました (${error})`);
//        });
});


router.get('/2', function(req, res, next) {

    var data2 = db.collection("users").where("id", "==", 2).get().data();

//    var data = {
//        title: 'Node.js Test2',
//        items: [
//            { name: "<h1>リンゴ2</h1>" },
//            { name: "<h2>バナナ2</h2>" },
//            { name: "<h3>スイカ2</h3>" }
//        ]
//    };
    // レンダリングを行う
    res.render("index.ejs", data2);
});

module.exports = router;