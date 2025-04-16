const db = require('../config/firebase');

exports.addCommercialPlot = async (data) => {
  const docRef = await db.collection('commercial_plots_sell').add(data);
  return docRef.id;
};