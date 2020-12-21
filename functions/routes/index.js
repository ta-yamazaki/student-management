var router = require('express').Router();

const admin = require('firebase-admin');
const ServiceAccount = require('../ServiceAccount.json');
admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) });
const db = admin.firestore();

const docRef = db.collection('users').doc('alovelace');
//db.collection('users').add({
//  id: 1,
//  title: 'Node.js Test',
//  items: [
//      { name: "<h1>リンゴ</h1>" },
//      { name: "<h2>バナナ</h2>" },
//      { name: "<h3>スイカ</h3>" }
//  ]
//});

/* GET home page. */
router.get('/', function(req, res, next) {

var data;

    db.collection("users").where("id", "==", 1)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                data = doc.data();
                console.log("data2");
                console.log(data);
             });
                 res.render("index.ejs", data);
        })
        .catch(function(error) {
            console.log(`データの取得に失敗しました (${error})`);
        });

//    var data = {
//        title: 'Node.js Test',
//        items: [
//            { name: "<h1>リンゴ</h1>" },
//            { name: "<h2>バナナ</h2>" },
//            { name: "<h3>スイカ</h3>" }
//        ]
//    };
//                 console.log("data");
//                 console.log(data);
//   // レンダリングを行う
//    res.render("index.ejs", data);
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