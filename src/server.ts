import app from './app';

import mongoose from 'mongoose';
import config from './app/config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

// main().catch(err => console.log(err));
async function main() {
  try {    
    await mongoose.connect(config.databaseUrl as string);

    app.listen(process.env.PORT, () => {
      console.log(
        `Example app listening on port ${config.port}, DB Connection successful`,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

main();