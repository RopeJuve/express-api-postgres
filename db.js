import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const  { Pool } = pg;

export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "WBS",
    password: process.env.DB_PASSWORD,
    port: 5432
});