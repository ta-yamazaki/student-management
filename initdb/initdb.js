const admin = require('firebase-admin');
//const ServiceAccount = require('../ServiceAccount.json');
//admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) });
const db = admin.firestore();

const docRef = db.collection('users').doc('alovelace');
db.collection('users').add({
  id: 1,
  title: 'Node.js Test',
  items: [
      { name: "<h1>リンゴ</h1>" },
      { name: "<h2>バナナ</h2>" },
      { name: "<h3>スイカ</h3>" }
  ]
});
