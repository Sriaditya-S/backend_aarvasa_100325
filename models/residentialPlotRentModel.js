const db = require('../config/firebase');

exports.addResidentialPlotRent = async (data) => {
  const docRef = await db.collection('RESIDENTIAL_PLOTS').add(data);
  return docRef.id;
};

exports.getAllResidentialPlotsRent = async () => {
  const snapshot = await db.collection('RESIDENTIAL_PLOTS').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.filterResidentialPlotsRent = async (state, city, pincode, min, max) => {
  const snapshot = await db.collection('RESIDENTIAL_PLOTS').get();
  const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return properties.filter(p =>
    p.state === state &&
    p.city === city &&
    p.pincode === pincode &&
    parseInt(p.totalAmount) >= parseInt(min) &&
    parseInt(p.totalAmount) <= parseInt(max)
  );
};