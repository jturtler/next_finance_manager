// import mongoose from 'mongoose';

// declare global {
//   namespace NodeJS {
//     interface Global {
//       mongoose: {
//         conn: typeof mongoose | null;
//         promise: Promise<typeof mongoose> | null;
//       };
//     }
//   }
// }

// // Ensure the file is a module by adding an export statement
// export {};



// import type { MongoClient } from 'mongodb'

// declare global {
//   namespace globalThis {
//     var _mongoClientPromise: Promise<MongoClient>
//   }
// }


declare namespace NodeJS {
    interface Global {
      myGlobalVar?: string;
    }
  }