const fs = require('fs/promises');

/**
 * Script to import restaurants sample data to your MongoDB
 * Run command from shell. Path is relative to terminal:
 * mongosh --file import-restaurants-sample-db.js
 * Run command for Atlas cluster. Path is relative to terminal:
 * mongosh "mongodb+srv://<servername>.mongodb.net/" --apiVersion 1 --username <username> --file import-restaurants-sample-db.js
 */

// DB and Output File Settings
//###################################################################//
const connectionString = "mongodb://localhost";
const dbName = "sample_restaurants";
const collectionName = "restaurants";
const importFilePath = "./restaurants.json";

//###################################################################//


db = connect(`${connectionString}/${dbName}`);

async function readJson(file) {
    return JSON.parse(await fs.readFile(file, 'utf8'));
}



async function insertDocuments(documents) {
    return db.getCollection(collectionName).insertMany(documents);
}

async function main() {

    try {
      const scriptStartTime = performance.now();
  
      const documents = await readJson(importFilePath);
      
      await insertDocuments(documents);
      
      const scriptEndTime = performance.now();
      const executionTime = `${scriptEndTime - scriptStartTime} ms`;
  
      console.log(`Data imported successfully in ${executionTime}`);
      
    } catch (error) {
      console.error("Error", {message: error?.message});
    }
  }
  
  main()
    .then(() => console.log("Finished running script"))
    .catch((err) => {
      console.error(err?.message);
    })
    .finally(() => process.exit());

