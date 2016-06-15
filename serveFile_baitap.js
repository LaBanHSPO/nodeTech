/**
 * Created by techmaster on 6/16/15.
 */
"use strict";
const http = require('http');
const fs = require('fs');
const url = require('url');
const hljs = require('highlight.js');


function serveFile(res, path) {
    let extension = path.split('.').pop();
    var contentType;
    switch (extension) {
        case 'js':
            contentType = 'text/html';
            break;
        case 'css':
            contentType = 'text/css';
            break;
        case 'html':
            contentType = 'text/html';
            break;
        case 'jpeg':
            contentType = 'image/jpeg';
            break;
        case 'jpg':
            contentType = 'image/jpg';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        default:
            contentType = 'unknown';
            res.end();
            return;
    }
    res.writeHead(200, {'Content-Type': contentType});

    let stream = fs.createReadStream('.' + path);
    stream.on('open', function () {
        if (extension == 'js' && path != '/node_modules/highlight.js/lib/highlight.js') {
            console.log("ban dang GET 1 file Javascript");
            let html = "<html>";
            html += "<head>";
            html += `<link rel="stylesheet" href="/node_modules/highlight.js/styles/default.css"> `;

            html += '</head>';
            html += '<body>';
            let data = fs.readFileSync('.' + path, 'utf8');
            html += hljs.highlight("js", data,true).value;
            //  html+=`<pre><code class="js">${data}</code></pre>`;

            hljs.configure({
                useBR: true,
                tabReplace: '    ', // 4 spaces
                classPrefix: ''     // don't append class prefix
                                    // … other options aren't changed
            });


            html += '</body>';
            html += '</html>';

            res.end(html);


        } else {
            // This just pipes the read stream to the response object (which goes to the client)

            stream.pipe(res);

        }
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    stream.on('error', function (err) {
        console.log('Error at: .' + path);
        //res.end(err);
    });

}
//Hàm này xử lý các route
let handleGETRequest = function (res, url_parsed) {
    let path = url_parsed.pathname;
    switch (path) {
        case "/": //Nếu route đến trang chủ
            res.writeHead(200, {'Content-Type': 'text/html'});
            fs.readdir('.', function (err, files) {
                for (var i = 0; i < files.length; i++) {
                    res.write('<a href="/' + files[i] + '">' + files[i] + '</a></br>');
                }
                res.end();
            });
            break;
        case "/tom":
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200, 'json content');
            res.write('{"characters": ["Tom", "Jerry"]}');
            res.end();
            break;
        default:
            if (path.includes('.')) {
                serveFile(res, path);
            }
            break;
    }
};

const server = http.createServer();
server.on('request', function (req, res) {
    if (req.method === 'GET') {
        handleGETRequest(res, url.parse(req.url, true));
    }
});
var port = 3000;
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port);
