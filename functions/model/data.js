
const docRef = db.collection('users').doc('alovelace');

const setAda = docRef.set({
  id: 1,
  title: 'Node.js Test',
  items: [
      { name: "<h1>リンゴ</h1>" },
      { name: "<h2>バナナ</h2>" },
      { name: "<h3>スイカ</h3>" }
  ]
});


exports.data = db.collection("users").where("id", "==", 1).get();