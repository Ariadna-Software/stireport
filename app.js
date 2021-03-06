var http = require('http');
var MySQLAdapter = require('./MySQLAdapter');
var FirebirdAdapter = require('./FirebirdAdapter');
var MSSQLAdapter = require('./MSSQLAdapter');
var PostgreSQLAdapter = require('./PostgreSQLAdapter');
var OracleAdapter = require('./OracleAdapter');
var cfg = require("./config.json");
var dotEnv = require("dotenv");

dotEnv.config();
var connectionStringBuilder;
var response;
function accept(req, res) {
    response = res;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "no-cache");
    var data = "";
    req.on('data', function (buffer) {
        data += buffer;
    });

    req.on('end', function () {
        command = JSON.parse(data.toString());
        if (command.database == "MySQL") MySQLAdapter.process(command, onProcess);
        if (command.database == "Firebird") FirebirdAdapter.process(command, onProcess);
        if (command.database == "MS SQL") MSSQLAdapter.process(command, onProcess);
        if (command.database == "PostgreSQL") PostgreSQLAdapter.process(command, onProcess);
        if (command.database == "Oracle") OracleAdapter.process(command, onProcess);
    });
}

var onProcess = function (result){
    response.end(JSON.stringify(result));
}

// http.createServer(accept).listen(cfg.stiPort);
// console.log("Servidor STI en puerto: ", cfg.stiPort);

http.createServer(accept).listen(process.env.STI_PORT || 5001);
console.log("Servidor STI en puerto: ", process.env.STI_PORT || 5001);
