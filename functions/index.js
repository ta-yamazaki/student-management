const functions = require('firebase-functions');

const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'routes')));

// 「/api/nc」パスの配下の処理を記述
app.use('/api/user', require('./routes/user.js'));
app.use('/api/nc', require('./routes/nc.js'));
app.use('/api/bs', require('./routes/bs.js'));
app.use('/api/activity', require('./routes/activity.js'));
app.use('/api/favorite', require('./routes/favorite.js'));
//exports.app = functions.https.onCall(app);
exports.app = functions.https.onRequest(app);

//404エラー
app.use(function(req, res, next){
    res.status(404).render('404.ejs', {message: "Sorry, page not found", title: "404エラー"});
});


const admin = require('./firebaseAdmin.js');
const db = admin.firestore();
const userCollection = db.collection("users");

/**
 * Authenticationトリガー
 */
exports.registerUser = functions.auth.user().onCreate((user) => {
    var userUid = user.uid;
    var userEmail = user.email;
    var userName = user.displayName;


    // admin.auth().getUser() 経由で取得, 取得するまでawait
    const authedUser =  admin.auth().getUser(userUid)
    .then(function (authedUser){
        var userName = authedUser.displayName;

        var newUser = {
            uid: userUid,
            email: userEmail,
            name: userName
        };

        return userCollection.doc(userUid).set(newUser);
    });


});

exports.deleteUser = functions.auth.user().onDelete((user) => {
    const userUid = user.uid;
    return userCollection.doc(userUid).delete();
});