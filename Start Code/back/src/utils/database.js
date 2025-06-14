import mysql from "mysql2/promise";
import dotenv from "dotenv";

 
dotenv.config();
 
// TODO
// Create the pool to connect to the database
// Use the database settings from the .env file
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, //allow up to 10 connections per request and other request need to wait 
  queueLimit: 0
});

console.log("Database pool created successfully");
console.log("Database host:", process.env.DB_HOST);
console.log("Database user:", process.env.DB_USER);
console.log("Database name:", process.env.DB_NAME);
console.log("Database password:", process.env.DB_PASSWORD ? "******" : "not set");

export { pool };
