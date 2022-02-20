const http = require('http');
const path = require('path');
const Ticket = require('./ticket');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');
const app = new Koa();

const publicDir = path.join(__dirname, '/public');
app.use(cors());

app.use(koaStatic(publicDir));

app.use(koaBody({
    urlencoded: true,
    multipart:true,
    text: true,
    json: true,
}));

app.use(async (ctx) => {
    const { method } = ctx.request;
    switch (method) {
        case "GET":
            if (ctx.request.query.method === "allTickets") {
                ctx.response.body = await Ticket.getAll();
                ctx.response.status = 200;
            } else if (ctx.request.query.method === "ticketById") {
                ctx.response.body = await Ticket.getById(ctx.request.query.id);
            }
            break;
        case "POST":
            if (ctx.request.query.method === "allTickets") {
                const {id, name, description} = ctx.request.body;
                const ticketPost = new Ticket(
                    name,
                    description
                );
                ticketPost.id = id;
                await Ticket.update(ticketPost);
                ctx.response.body = await Ticket.getById(id);
                ctx.response.status = 200;
                return;
            }
            break;
        default:
            ctx.response.status = 404;
            return;
    }
});

const port = process.env.PORT || 7070;
http.createServer(app.callback()).listen(port);