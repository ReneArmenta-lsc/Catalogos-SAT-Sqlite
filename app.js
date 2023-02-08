const util = require('util')
var request = require('request');
const requestPromise = util.promisify(request);
const sqlite3 = require('sqlite3').verbose();
const sat = new sqlite3.Database('sat.db');

sat.run = util.promisify(sat.run);

var list = "https://raw.githubusercontent.com/phpcfdi/resources-sat-catalogs/master/database/tables.list";
var schema = "https://raw.githubusercontent.com/phpcfdi/resources-sat-catalogs/master/database/schemas/";
var data = "https://raw.githubusercontent.com/phpcfdi/resources-sat-catalogs/master/database/data/";

async function main() {
    const listaText = await requestPromise(list);

    var lines = listaText.body.split("\n").filter(element => element);
    for (let line of lines) {
        console.log('\x1b[33m ' + line + ' \x1b[0m');

        const schemaText = await requestPromise(schema + line + ".sql");
        console.log(schemaText.body);
        await sat.run(schemaText.body);

        const dataText = await requestPromise(data + line + ".sql");
        var dataLines = dataText.body.split("\n").filter(element => element);

        sat.serialize(() => {
            for (let dataLine of dataLines) {
                console.log("\x1b[2m" + dataLine + "\x1b[0m");
                sat.run(dataLine);
            }
        })

        console.log("\x1b[32m data done\n \x1b[0m");
    }
}

sat.on("error", function (error) {
    console.log("Getting an error : ", error);
});

main();