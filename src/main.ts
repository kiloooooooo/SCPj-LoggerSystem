import Koa from 'koa'
import serve from 'koa-static'
import SocketServer from 'socket.io'
import path from 'path'
import fs from 'fs'
import moment from 'moment'
import { PythonShell } from 'python-shell'

const LOG_TIME_FORMAT = 'YY/MM/DD HH:mm:ss'
const LOG_INTERVAL = 1000  // [ms]
const RACE_TIME = 18000  // 5 * 3600 [s]
const BATTERY_CAPACITY = 12960  // = 3600 * 3600 / 1000 [kWs]
const EVENT_NAMES = {
    alljson: 'alljson',
    err: 'error'
}

const convToSpeed = (kiloWatt: number) =>
    Math.sqrt(20 * 1000 * kiloWatt) / 3

const app = new Koa()
app.use(serve(path.resolve(__dirname, '../frontend/public/')))

const srv = app.listen(3000, () => {
    console.log('Server running on port 3000')
})

const io = SocketServer.listen(srv)
io.on('connection', socket => {
    console.log(`Client Connected:\n\tid = ${ socket.id }`)
    
    socket.on('disconnect', () => {
        console.log(`Client Disconnected:\n\tid = ${ socket.id }`)
    })
    
    const pyPath = path.resolve(__dirname, '../python/request-log.py')
    const pyShell = new PythonShell(pyPath)
    const requestLog = () => {
        pyShell.send('SEND')
        setTimeout(requestLog, LOG_INTERVAL);
    }
    
    let timeRemaining = RACE_TIME
    let battRemaining = BATTERY_CAPACITY

    pyShell.on('message', message => {
        /*
         * `message` must be like:
         *   {
         *     status: number (200 | 500)
         *     data: object (if status == 200) | string (if status == 500)
         *   }
         */
        const msgObj = JSON.parse(message)

        if (msgObj.status === 200) {
            const data = msgObj.data
            const vlt = data.vlt
            const spd = data.spd
            const tmp = data.tmp
            const con = data.con
            const gen = data.gen

            let toConsume = 0
            let suggSpeed = 0

            if (0 < timeRemaining) {
                timeRemaining -= 50

                battRemaining = Math.min(battRemaining - con + gen, BATTERY_CAPACITY)
                toConsume = battRemaining / timeRemaining
                suggSpeed = convToSpeed(toConsume)
            }

            const logData = {
                voltage: vlt,
                speed: spd,
                temperature: tmp,
                consumption: con,
                generation: gen,
                toConsume: toConsume,
                suggSpeed: suggSpeed,
                battRemaining: battRemaining
            }

            socket.emit(EVENT_NAMES.alljson, JSON.stringify(logData))

            let time = moment().format(LOG_TIME_FORMAT)
            let line = `${ time },${ vlt },${ spd },${ tmp },${ con },${ gen },${ toConsume },${ suggSpeed },${ battRemaining }\n`
            fs.appendFileSync('logdumps/dump.csv', line)
        }
        else {
            // Error while running `request-log.py`
            try {
            }
            catch (e) {
                socket.emit(EVENT_NAMES.err, msgObj.data)
            }
        }
    })

    requestLog()
})
