const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let dbName = "video_app";
let dbUrl = `mongodb+srv://prathap123:prathap007@cluster0.ygsv1.mongodb.net/${dbName}`;
module.exports = { dbUrl, mongodb, MongoClient };
