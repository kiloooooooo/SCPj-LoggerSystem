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
    let command = 'SEND'
    let doContinue = true

    socket.on('disconnect', () => {
        console.log('Client Disconnected')
    })

    socket.on('command', (message: any) => {
        command = message
    })

    console.log('Client Connected')

    const pyPath = path.resolve(__dirname, '../python/request-log.py')
    const pyShell = new PythonShell(pyPath)
    const requestLog = () => {
        pyShell.send(command)

        if (doContinue)
            setTimeout(requestLog, 1000);
    }

    pyShell.on('message', message => {
        /*
         * `message` must be like:
         *   {
         *     status: number,
         *     data: string (if status == (202 | 400)) | number[] (if status == 200)
         *   }
        */
        const msgObj = JSON.parse(message)
        const status = msgObj.status

        switch (status) {
            case 200:
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
                break

            case 202:
                console.log(msgObj.data)
                doContinue = false
                break

            case 400:
                console.error(msgObj.data)
                console.log('Quit.')
                doContinue = false
                break
        }

    })

    requestLog()
})
