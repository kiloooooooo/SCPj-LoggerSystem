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
    var command = 'SEND';
    var doContinue = true;
    socket.on('disconnect', function () {
        console.log('Client Disconnected');
    });
    socket.on('command', function (message) {
        command = message;
    });
    console.log('Client Connected');
    var pyPath = path_1.default.resolve(__dirname, '../python/request-log.py');
    var pyShell = new python_shell_1.PythonShell(pyPath);
    var requestLog = function () {
        pyShell.send(command);
        if (doContinue)
            setTimeout(requestLog, 1000);
    };
    pyShell.on('message', function (message) {
        /*
         * `message` must be like:
         *   {
         *     status: number,
         *     data: string (if status == (202 | 400)) | number[] (if status == 200)
         *   }
        */
        var msgObj = JSON.parse(message);
        var status = msgObj.status;
        switch (status) {
            case 200:
                var data = msgObj.data;
                var vlt = data[0];
                var spd = data[1];
                var tmp = data[2];
                var con = data[3];
                var gen = data[4];
                socket.emit(EVENT_NAMES.vlt, vlt);
                socket.emit(EVENT_NAMES.spd, spd);
                socket.emit(EVENT_NAMES.tmp, tmp);
                socket.emit(EVENT_NAMES.con, con);
                socket.emit(EVENT_NAMES.gen, gen);
                break;
            case 202:
                console.log(msgObj.data);
                doContinue = false;
                break;
            case 400:
                console.log(msgObj.data);
                console.log('Quit.');
                doContinue = false;
                break;
        }
    });
    requestLog();
});
//# sourceMappingURL=main.js.map