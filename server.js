const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hotel Booking Deployment Successful');
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
