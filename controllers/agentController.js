const db = require('../config/firebase'); // Firebase configuration

/**
 * Adds a new agent to Firestore.
 */
exports.addAgent = async (req, res) => {
  try {
    const docRef = await db.collection('AGENTS').add(req.body);
    res.json({ message: 'Agent added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding agent:', error);
    res.status(500).json({ message: 'Failed to add agent', error: error.message });
  }
};

/**
 * Fetches all agents from Firestore.
 */
exports.getAllAgents = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', 'https://frontendaarvasa100325.vercel.app');
    const snapshot = await db.collection('AGENTS').get();
    const agents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Failed to fetch agents', error: error.message });
  }
};