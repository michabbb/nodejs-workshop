/**
 * @author Sven Koelpin
 */
const restify = require('restify');
const webSocket = require('ws');
const eventEmitter = require('../server/Events');
const logger = require('./Logger');
const security = require('../security/Security');

const PORT = process.env.PORT || 3001;

const server = restify.createServer({
    name: 'Twttr',
    log: logger,
    version: '1.0.0'
});

server.on('uncaughtException', (req, res, route, err) => {
    logger.error(err);
    res.send(500);
});

//middlewares
server.pre(restify.throttle({burst: 10, rate: 10, ip: true}));
server.pre(restify.pre.sanitizePath());

server.use(restify.CORS());
restify.CORS.ALLOW_HEADERS.push('authorization');

server.use(restify.acceptParser(['application/json', 'text/event-stream']));
server.use(restify.requestLogger());
server.use(restify.gzipResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser({mapParams: false}));

server.use(security);


//socket
const wss = new webSocket.Server({server});
wss.on('connection', ws => {
    const onEventListener = newData => ws.send(JSON.stringify(newData));
    eventEmitter.addListener('newData', onEventListener);
    ws.on('close', () => eventEmitter.removeListener('newData', onEventListener));
});

module.exports = {
    register(resource){
        resource(server);
    },
    getServer(){
        return server;
    },
    start() {
        server.listen(PORT, () => {
            logger.info(`Server started: http://localhost:${PORT}`);
        });
    }
};
