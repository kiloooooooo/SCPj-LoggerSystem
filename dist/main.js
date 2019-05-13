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
var LOG_INTERVAL = 1000; // [ms]
var RACE_TIME = 5 * 3600; // [s]
var BATTERY_CAPACITY = 3600 * 3600 / 1000; // [kWs]
var EVENT_NAMES = {
    alljson: 'alljson',
    err: 'error'
};
var convToSpeed = function (kiloWatt) {
    return Math.sqrt(20 * 1000 * kiloWatt) / 3;
};
var app = new koa_1.default();
app.use(koa_static_1.default(path_1.default.resolve(__dirname, '../frontend/public/')));
var srv = app.listen(3000, function () {
    console.log('Server running on port 3000');
});
var io = socket_io_1.default.listen(srv);
io.on('connection', function (socket) {
    console.log("Client Connected:\n\tid = " + socket.id);
    socket.on('disconnect', function () {
        console.log("Client Disconnected:\n\tid = " + socket.id);
    });
    var pyPath = path_1.default.resolve(__dirname, '../python/request-log.py');
    var pyShell = new python_shell_1.PythonShell(pyPath);
    var requestLog = function () {
        pyShell.send('SEND');
        setTimeout(requestLog, LOG_INTERVAL);
    };
    var timeRemaining = RACE_TIME;
    var battRemaining = BATTERY_CAPACITY;
    pyShell.on('message', function (message) {
        /*
         * `message` must be like:
         *   {
         *     status: number (200 | 500)
         *     data: object (if status == 200) | string (if status == 500)
         *   }
         */
        var msgObj = JSON.parse(message);
        var data = msgObj.data;
        var vlt = data.vlt;
        var spd = data.spd;
        var tmp = data.tmp;
        var con = data.con;
        var gen = data.gen;
        var toConsume = 0;
        var suggSpeed = 0;
        if (msgObj.status === 200) {
            if (0 < timeRemaining) {
                timeRemaining -= 50;
                battRemaining = Math.min(battRemaining - con + gen, BATTERY_CAPACITY);
                toConsume = battRemaining / timeRemaining;
                suggSpeed = convToSpeed(toConsume);
            }
            var logData = {
                voltage: vlt,
                speed: spd,
                temperature: tmp,
                consumption: con,
                generation: gen,
                toConsume: toConsume,
                suggSpeed: suggSpeed,
                battRemaining: battRemaining
            };
            socket.emit(EVENT_NAMES.alljson, JSON.stringify(logData));
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