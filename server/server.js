const http = require("http");
const fs = require("fs").promises;
const path = require("path");

async function serve(port) {
    try {
        const html = await fs.readFile(path.join(__dirname, "../public/index.html"));
        const style = await fs.readFile(path.join(__dirname, "../public/css/style.css"));
        const js = await fs.readFile(path.join(__dirname, "../public/js/main.js"));

        const server = http.createServer((req, res) => {

            switch (req.url) {
                case "/css/style.css":
                    res.setHeader("Content-Type", "text/css");
                    res.writeHead(200);
                    res.write(style);
                    break;

                case "/js/main.js":
                    res.setHeader("Content-Type", "application/javascript");
                    res.writeHead(200);
                    res.write(js);
                    break;
            
                // case "/assets/favicon.ico":
                //     res.setHeader("Content-Type", "image/x-icon");
                //     res.writeHead(200);
                //     require("fs").createReadStream(path.join(__dirname, "../public/assets/favicon.ico")).pipe(res);
                
                default:
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(200);
                    res.write(html);
                    break;
            }
    
            res.end();
        });
    
        server.listen(port, err => err ? (e => {throw new Error(e)})(err) : console.log(`Listening to Port ${process.env.PORT}`));
    } catch (error) {
        throw new Error(error);
    }
}

serve(process.env.PORT);