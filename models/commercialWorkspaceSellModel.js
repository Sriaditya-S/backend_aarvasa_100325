const db = require('../config/firebase');

exports.addCommercialWorkspaceSell = async (data) => {
  const docRef = await db.collection('commercial_work_spaces_sell').add(data);
  return docRef.id;
};

exports.getAllCommercialWorkspaceSell = async () => {
  const snapshot = await db.collection('commercial_work_spaces_sell').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.filterCommercialWorkspaceSell = async (state, city, pincode, min, max) => {
  const snapshot = await db.collection('commercial_work_spaces_sell').get();
  const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return properties.filter(p =>
    p.state === state &&
    p.city === city &&
    p.pincode === pincode &&
    parseInt(p.totalAmount) >= parseInt(min) &&
    parseInt(p.totalAmount) <= parseInt(max)
  );
};