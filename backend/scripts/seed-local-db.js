const fs = require('fs');
const path = require('path');
const { EJSON } = require('bson');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const rootDir = path.resolve(__dirname, '..');
const backupDir = path.join(rootDir, 'docs', 'db-backup-7-22-2023');
const publicUploadsDir = path.join(rootDir, 'public', 'uploads');
const backupUploadsDir = path.join(backupDir, 'uploads');

const readBackup = (fileName) => {
  const filePath = path.join(backupDir, fileName);
  return EJSON.parse(fs.readFileSync(filePath, 'utf8'), { relaxed: true });
};

const copyUploads = () => {
  if (!fs.existsSync(backupUploadsDir)) {
    return;
  }

  fs.mkdirSync(publicUploadsDir, { recursive: true });
  fs.cpSync(backupUploadsDir, publicUploadsDir, { recursive: true });
};

const seed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to backend/.env first.');
  }

  const users = readBackup('users.json');
  const rooms = readBackup('rooms.json');
  const adminUser = users.find((user) => user.role === 'admin');

  if (adminUser) {
    adminUser.userName = 'local-admin';
    adminUser.fullName = 'Local Admin';
    adminUser.email = 'admin@example.com';
    adminUser.phone = '+10000000000';
    adminUser.verified = true;
    adminUser.status = 'logout';
    adminUser.password = await bcrypt.hash('Admin@123', 8);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const { db } = mongoose.connection;
  await db.collection('users').deleteMany({});
  await db.collection('rooms').deleteMany({});
  await db.collection('bookings').deleteMany({});
  await db.collection('reviews').deleteMany({});

  await db.collection('users').insertMany(users);
  await db.collection('rooms').insertMany(rooms);
  copyUploads();

  await mongoose.disconnect();

  console.log(`Seeded ${users.length} users and ${rooms.length} rooms.`);
  console.log('Admin login: admin@example.com / Admin@123');
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
