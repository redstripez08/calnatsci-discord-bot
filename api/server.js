const http = require("http");

function thing(port, callback) {
    
    const server = http.createServer((req, res) => {
        res.write("whaddup");
        res.end()
    });
    
    server.listen(port);
    callback(port);
}

module.exports = thing;