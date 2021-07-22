require('dotenv').config();

// PostgreSQL
const { Pool } = require('pg');

/*
// for local development
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  max: 10,
  idleTimeoutMillis: 300000
});

// for development
pool.on("connect", () => {
  console.log("Connected to Postgres...");
});
pool.on("error", (err) => {
  console.log("Postgres db error...", err.message, err.stack);
});
pool.on("end", () => {
  console.log("Connection to Posgres db ended...");
});
*/
// **********************************************************************
// ******************** THIS SET UP FOR PRODUTION ***********************
// **********************************************************************

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
  
// for production
  
// value from heroku addons - connection sting to PG hosted via Heroku
const proConfig = process.env.DATABASE_URL;
  
const pool = new Pool({
  connectionString: process.env.NODE_ENV === "production" ? proConfig : devConfig,
  // connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  } 
});

// **********************************************************************
// **********************************************************************
// **********************************************************************
// pool.connect(err => {
//   if (err) {
//     console.error('postgres: connection error...', err.stack)
//   } else {
//     console.log('postgres: connected!')
//   }
// });
// get client from pool, point out specifically when creating transaction queries, otherwise pool.lquery is a valid method of querying
// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error("Connection to Postgres db failed...", err.stack);
//   }
//   // test query
//   client.query('SELECT * FROM demo_table', (err, result) => {
//     release(); // release client connection after every query
//     if (err) {
//       return console.error("Connection to Postgres db failed...", err.stack);
//     }
//     console.log(result.rows);
//   });
// });

module.exports = pool; // postgres
// module.exports = {
  // query: (text, params) => pool.query(text,params)
// };