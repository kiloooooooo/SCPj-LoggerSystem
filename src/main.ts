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
    console.log('Server running on port 3000')
})

const io = SocketServer.listen(srv)
io.on('connection', socket => {
    socket.on('disconnect', () => {
        console.log(`Client Disconnected:\n\tid = ${ socket.id }`)
    })

    console.log(`Client Connected:\n\tid = ${ socket.id }`)

    const pyPath = path.resolve(__dirname, '../python/request-log.py')
    const pyShell = new PythonShell(pyPath)
    const requestLog = () => {
        pyShell.send('SEND')

        setTimeout(requestLog, 1000);
    }

    pyShell.on('message', message => {
        /*
         * `message` must be like:
         *   {
         *     data: number[]
         *   }
        */
        const msgObj = JSON.parse(message)

        const data = msgObj.data
        const vlt = data[0]
        const spd = data[1]
        const tmp = data[2]
        const con = data[3]
        const gen = data[4]

        socket.emit(EVENT_NAMES.vlt, vlt)
        socket.emit(EVENT_NAMES.spd, spd)
        socket.emit(EVENT_NAMES.tmp, tmp)
        socket.emit(EVENT_NAMES.con, con)
        socket.emit(EVENT_NAMES.gen, gen)
    })

    requestLog()
})
