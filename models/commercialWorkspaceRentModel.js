const db = require('../config/firebase');

exports.addCommercialWorkspaceRent = async (data) => {
  const docRef = await db.collection('COMMERCIAL_WORKSPACES').add(data);
  return docRef.id;
};

exports.getAllCommercialWorkspaceRent = async () => {
  const snapshot = await db.collection('COMMERCIAL_WORKSPACES').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.filterCommercialWorkspaceRent = async (state, city, pincode, min, max) => {
  const snapshot = await db.collection('COMMERCIAL_WORKSPACES').get();
  const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return properties.filter(p =>
    p.state === state &&
    p.city === city &&
    p.pincode === pincode &&
    parseInt(p.totalAmount) >= parseInt(min) &&
    parseInt(p.totalAmount) <= parseInt(max)
  );
};