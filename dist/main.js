"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_static_1 = __importDefault(require("koa-static"));
var socket_io_1 = __importDefault(require("socket.io"));
var path_1 = __importDefault(require("path"));
var python_shell_1 = require("python-shell");
var EVENT_NAMES = {
    vlt: 'voltage',
    spd: 'speed',
    tmp: 'temperature',
    con: 'consumption',
    gen: 'generation'
};
var app = new koa_1.default();
app.use(koa_static_1.default(path_1.default.resolve(__dirname, '../frontend/public/')));
var srv = app.listen(3000, function () {
    console.log('Server.running on port 3000');
});
var io = socket_io_1.default.listen(srv);
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log('Client Disconnected');
    });
    console.log('Client Connected');
    var emitLog = function () {
        var genRandom = function (min, max) {
            var raw = Math.random();
            var range = max - min;
            var rounded = Math.round(raw * range * 1000) / 1000;
            return min + rounded;
        };
        socket.emit(EVENT_NAMES.vlt, genRandom(80, 120));
        socket.emit(EVENT_NAMES.spd, genRandom(0, 150));
        socket.emit(EVENT_NAMES.tmp, genRandom(20, 120));
        socket.emit(EVENT_NAMES.gen, genRandom(0, 1.2));
        socket.emit(EVENT_NAMES.con, genRandom(-4, 4));
        setTimeout(emitLog, 1000);
    };
    emitLog();
    var pyShell = new python_shell_1.PythonShell(path_1.default.resolve(__dirname, '../python/request-log.py'));
    pyShell.on('message', function (message) {
        console.log(message);
    });
});
//# sourceMappingURL=main.js.map