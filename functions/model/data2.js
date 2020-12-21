
const docRef = db.collection('users').doc('alovelace');

const setAda = docRef.set({
  id: 2,
  title: 'Node.js Test',
  items: [
      { name: "<h1>リンゴ</h1>" },
      { name: "<h2>バナナ</h2>" },
      { name: "<h3>スイカ</h3>" }
  ]
});

exports.data2 = db.collection("users").where("id", "==", 2).get();