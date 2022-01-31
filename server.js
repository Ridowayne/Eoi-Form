const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

dotenv.config({ path: './config.env' });

//  Database Connection string
const DB = process.env.DATABASE;

// Database connection established
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// server to run on port 9000 or as defined in the config.env
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`server running on port ${port}...`);
});
