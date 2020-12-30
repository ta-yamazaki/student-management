
const admin = require('firebase-admin');
const ServiceAccount = require('./ServiceAccount.json');
admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) });

module.exports = admin;