const admin = require("firebase-admin");

let service_account = {
  "type": "service_account",
  "project_id": "aarvasa-property-listing",
  "private_key_id": "60043211655064be676a5147ed13a7cc6d502ecc",
  "private_key": process.env.FIREBASE_SERVICE_ACCOUNT,
  "client_email": "firebase-adminsdk-xiqqu@aarvasa-property-listing.iam.gserviceaccount.com",
  "client_id": "118103228326978316659",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xiqqu%40aarvasa-property-listing.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(service_account)
});

const db = admin.firestore();

module.exports = db;