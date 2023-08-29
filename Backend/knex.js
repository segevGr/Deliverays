const knex = require("knex");

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "appDB.sqlite3" // [table name].sqlite3
    }
});

module.exports = connectedKnex