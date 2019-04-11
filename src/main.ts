import Koa from 'koa'
import serve from 'koa-static'
import SocketServer from 'socket.io'
import path from 'path'
import { PythonShell } from 'python-shell'

const EVENT_NAMES = {
    vlt: 'voltage',
    spd: 'speed',
    tmp: 'temperature',
    con: 'consumption',
    gen: 'generation'
}

const app = new Koa()

app.use(serve(path.resolve(__dirname, '../frontend/public/')))

const srv = app.listen(3000, () => {
    console.log('Server.running on port 3000')
})

const io = SocketServer.listen(srv)
io.on('connection', socket => {
    socket.on('disconnect', () => {
        console.log('Client Disconnected')
    })

    console.log('Client Connected')

    const pyShell = new PythonShell(path.resolve(__dirname, '../python/request-log.py'))
    pyShell.on('message', message => {
        // [<vlt>, <spd>, <tmp>, <con>, <gen>]
        const json = `{ log: ${ message } }`
        const logObj = JSON.parse(json)
        const log = logObj['log']
        const vlt = log[0]
        const spd = log[1]
        const tmp = log[2]
        const con = log[3]
        const gen = log[4]

        socket.emit(EVENT_NAMES.vlt, vlt)
        socket.emit(EVENT_NAMES.spd, spd)
        socket.emit(EVENT_NAMES.tmp, tmp)
        socket.emit(EVENT_NAMES.con, con)
        socket.emit(EVENT_NAMES.gen, gen)
    })

    // const emitLog = () => {
    //     const genRandom = (min: number, max: number) => {
    //         const raw = Math.random()
    //         const range = max - min
    //         const rounded = Math.round(raw * range * 1000) / 1000
    //         return min + rounded
    //     }

    //     socket.emit(EVENT_NAMES.vlt, genRandom(80, 120))
    //     socket.emit(EVENT_NAMES.spd, genRandom(0, 150))
    //     socket.emit(EVENT_NAMES.tmp, genRandom(20, 120))
    //     socket.emit(EVENT_NAMES.gen, genRandom(0, 1.2))
    //     socket.emit(EVENT_NAMES.con, genRandom(-4, 4))

    //     setTimeout(emitLog, 1000)
    // }

    // emitLog()

    // const pyShell = new PythonShell(path.resolve(__dirname, '../python/request-log.py'))
    // pyShell.on('message', message => {
    //     console.log(message)
    // })
})
