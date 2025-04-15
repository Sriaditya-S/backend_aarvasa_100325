const db = require('./config/firebase'); // Import Firestore instance

async function listCollections() {
  try {
    const collections = await db.listCollections();
    console.log('Collections:', collections.map((col) => col.id));
  } catch (error) {
    console.error('Error listing collections:', error);
  }
}

listCollections();