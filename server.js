const http = require('http');

const data = [
    {
        'title': 'prisma',
        'body': 'learning node',
        'createdAt': '5/18/2025, 1:25:02 AM'
    },
    {
        'title': 'typescript',
        'body': 'learning node',
        'createdAt': '8/23/2025, 2:20:02 PM'
    }
];

const server = http.createServer((req, res) => {
    // console.log(req.url, req.method);
    // res.end('Welcome to ToDo App Application');
    if (req.url === '/todos' && req.method === 'GET') {
        res.writeHead(201, {
            'content-type': 'text/html',
            // 'email': 'ph@gmail.com'
        });
        res.end(`
            <h1>Hello World</h1>
            <h2>Hello World</h2>
            <h3>Hello World</h3>`
        );
    } else if (req.url === '/todos/create-todo' && req.method === 'POST') {
        res.end('ToDo created');
    } else {
        res.end('Route not found');
    }
});

server.listen(4000, '127.0.0.1', () => {
    console.log('Server listening to port 4000');
});