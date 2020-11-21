const http = require("http");
const fs = require("fs");

function server(port) {
    
    const server = http.createServer((req, res) => {
        fs.readFile("./website/index.html", "UTF-8", (err, data) => {
            if (err) throw new Error(err);
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(data);
        });
    });
    
    server.listen(port);
}

server(process.env.PORT);
console.log("Listening to Port " + process.env.PORT);

//module.exports = server;