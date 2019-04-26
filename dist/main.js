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
    gen: 'generation',
    err: 'error'
};
var app = new koa_1.default();
app.use(koa_static_1.default(path_1.default.resolve(__dirname, '../frontend/public/')));
var srv = app.listen(3000, function () {
    console.log('Server running on port 3000');
});
var io = socket_io_1.default.listen(srv);
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        console.log("Client Disconnected:\n\tid = " + socket.id);
    });
    console.log("Client Connected:\n\tid = " + socket.id);
    var pyPath = path_1.default.resolve(__dirname, '../python/request-log.py');
    var pyShell = new python_shell_1.PythonShell(pyPath);
    var requestLog = function () {
        pyShell.send('SEND');
        setTimeout(requestLog, 1000);
    };
    pyShell.on('message', function (message) {
        /*
         * `message` must be like:
         *   {
         *     status: number (200 | 500)
         *     data: number[] (if status == 200) | string (if status == 500)
         *   }
         */
        var msgObj = JSON.parse(message);
        if (msgObj.status === 200) {
            var data = msgObj.data;
            var vlt = data.vlt;
            var spd = data.spd;
            var tmp = data.tmp;
            var con = data.con;
            var gen = data.gen;
            console.log(data.vlt);
            console.log(data.spd);
            console.log(data.tmp);
            console.log(data.con);
            console.log(data.gen);
            socket.emit(EVENT_NAMES.vlt, vlt);
            socket.emit(EVENT_NAMES.spd, spd);
            socket.emit(EVENT_NAMES.tmp, tmp);
            socket.emit(EVENT_NAMES.con, con);
            socket.emit(EVENT_NAMES.gen, gen);
        }
        else {
            try {
            }
            catch (e) {
                socket.emit(EVENT_NAMES.err, msgObj.data);
            }
        }
    });
    requestLog();
});
//# sourceMappingURL=main.js.map