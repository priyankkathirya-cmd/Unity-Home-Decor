const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function checkDB() {
  console.log('Using MONGO_URI:', MONGO_URI ? 'Defined' : 'UNDEFINED');
  if (!MONGO_URI) return;
  
  try {
    console.log('Connecting...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to DB');
    
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases available:', dbs.databases.map(d => d.name));
    
    const currentDB = mongoose.connection.db.databaseName;
    console.log('Current DB name:', currentDB);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in', currentDB + ':', collections.map(c => c.name));
    
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- Collection ${col.name} has ${count} documents`);
    }
    
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkDB();
