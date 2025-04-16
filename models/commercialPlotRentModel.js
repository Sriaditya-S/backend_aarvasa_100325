const db = require('../config/firebase');

exports.addCommercialPlotRent = async (data) => {
  const docRef = await db.collection('COMMERCIAL_PLOTS').add(data);
  return docRef.id;
};

exports.getAllCommercialPlotsRent = async () => {
  const snapshot = await db.collection('COMMERCIAL_PLOTS').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.filterCommercialPlotsRent = async (state, city, pincode, min, max) => {
  const snapshot = await db.collection('COMMERCIAL_PLOTS').get();
  const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return properties.filter(p =>
    p.state === state &&
    p.city === city &&
    p.pincode === pincode &&
    parseInt(p.totalAmount) >= parseInt(min) &&
    parseInt(p.totalAmount) <= parseInt(max)
  );
};