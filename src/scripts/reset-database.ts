// src\scripts\reset-database.ts
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function resetDatabase() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    
    // Delete all couples
    console.log('🗑️  Deleting all couples...');
    const result = await db.collection('couples').deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} documents`);
    console.log('✅ Database reset complete!');
    
    await client.close();
    console.log('👋 Connection closed');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase().catch(console.error);