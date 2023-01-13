import Database from "./database";

const db = new Database("postgres", "superdupertest" )

db.init();
