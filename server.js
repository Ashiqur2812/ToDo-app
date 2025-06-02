const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const filePath = path.join(__dirname, './db/todo.json');

const server = http.createServer((req, res) => {

    // const url = new URL(req.url, `http://${req.headers.host}`);
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // GET all todos
    if (pathname === '/todos' && req.method === 'GET') {
        const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
        res.writeHead(200, {
            'content-type': 'application/json',
        });
        res.end(data);
    }
    // POST a todo 
    else if (pathname === '/todos/create-todo' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data = data + chunk;
        });
        req.on('end', () => {
            // console.log(data);
            const { title, body } = JSON.parse(data);
            const createdAt = new Date().toLocaleString();

            const allTodos = fs.readFileSync(filePath, { encoding: 'utf-8' });
            const parsedAllTodos = JSON.parse(allTodos);
            console.log(parsedAllTodos);
            parsedAllTodos.push({ title, body, createdAt });

            fs.writeFileSync(filePath, JSON.stringify(parsedAllTodos, null, 2), { encoding: 'utf-8' });

            res.end(JSON.stringify({ title, body, createdAt }, null, 2));
        });
    }
    else if (pathname === '/todo' && req.method === 'GET') {
        const title = query.title;
        console.log('-->', title);

        const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
        const parsedData = JSON.parse(data);
        const todo = parsedData.find((todo) => todo.title === title);

        if (!todo) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: 'Todo not found' }));
            return;
        }

        if (!todo) {
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: 'Missing title query parameter' }));
            return;
        }

        const stringified = JSON.stringify(todo);
        res.writeHead(200, {
            "content-type": "application/json"
        });
        res.end(stringified);
    }
    else if (pathname === '/todo/update-todo' && req.method === 'PATCH') {
        const title = query.title;
        let data = '';
        req.on('data', (chunk) => {
            data = data + chunk;
        });
        req.on('end', () => {
            const { body } = JSON.parse(data);
            const allTodos = fs.readFileSync(filePath, { encoding: 'utf-8' });
            const parsedAllTodos = JSON.parse(allTodos);
            console.log(parsedAllTodos);

            const todoIndex = parsedAllTodos.findIndex((todo) => todo.title === title);
            parsedAllTodos[todoIndex].body = body;

            fs.writeFileSync(filePath, JSON.stringify(parsedAllTodos, null, 2), { encoding: 'utf-8' });

            res.end(JSON.stringify({ title, body, createdAt: parsedAllTodos[todoIndex].createdAt }, null, 2));
        });
    }
    else if (pathname === '/todo/delete-todo' && req.method === 'DELETE') {
        const title = query.title;

        const allTodos = fs.readFileSync(filePath, { encoding: 'utf-8' });
        const parsedAllTodos = JSON.parse(allTodos);

        const updatedTodos = parsedAllTodos.filter((todo) => todo.title !== title);

        if (updatedTodos.length === parsedAllTodos.length) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: 'Todo not found' }));
            return;
        }

        fs.writeFileSync(filePath, JSON.stringify(updatedTodos, null, 2), { encoding: 'utf-8' });

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: 'Todo deleted successfully', title }));
    }
    else {
        res.end('Route not found');
    }
});

server.listen(4000, '127.0.0.1', () => {
    console.log('Server listening to port 4000');
});

