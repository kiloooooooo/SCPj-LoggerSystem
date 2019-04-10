import io from 'socket.io-client'
import { drawAxis, drawGraph } from './drawer.ts'
import {
    vAxisInfo,
    sAxisInfo,
    tAxisInfo,
    cAxisInfo,
    gAxisInfo
} from './axis-info.ts'

const LOG_STACK = 20

const socketUrl = location.origin
const socket = io(socketUrl)

const vCanvas = <HTMLCanvasElement> document.getElementById('canvas-voltage')!!
const vCtx = vCanvas.getContext('2d')!!
const vView = document.getElementById('vlt-value')!!
const sCanvas = <HTMLCanvasElement> document.getElementById('canvas-speed')!!
const sCtx = sCanvas.getContext('2d')!!
const sView = document.getElementById('spd-value')!!
const tCanvas = <HTMLCanvasElement> document.getElementById('canvas-temperature')!!
const tCtx = tCanvas.getContext('2d')!!
const tView = document.getElementById('tmp-value')!!
const cCanvas = <HTMLCanvasElement> document.getElementById('canvas-consumption')!!
const cCtx = cCanvas.getContext('2d')!!
const cView = document.getElementById('con-value')!!
const gCanvas = <HTMLCanvasElement> document.getElementById('canvas-generation')!!
const gCtx = gCanvas.getContext('2d')!!
const gView = document.getElementById('gen-value')!!

drawAxis(vCtx, vAxisInfo)
const vltLog: number[] = new Array(LOG_STACK)
socket.on('voltage', (data: number) => {
    vltLog.push(data)
    vltLog.shift()
    vView.innerText = String(data)
    drawGraph(vCtx, vltLog, 0, 120, 30)
})

drawAxis(sCtx, sAxisInfo)
const spdLog: number[] = new Array(LOG_STACK)
socket.on('speed', (data: number) => {
    spdLog.push(data)
    spdLog.shift()
    sView.innerText = String(data)
    drawGraph(sCtx, spdLog, 0, 150, 80)
})

drawAxis(tCtx, tAxisInfo)
const tmpLog: number[] = new Array(LOG_STACK)
socket.on('temperature', (data: number) => {
    tmpLog.push(data)
    tmpLog.shift()
    tView.innerText = String(data)
    drawGraph(tCtx, tmpLog, 30, 120, 100)
})

drawAxis(cCtx, cAxisInfo)
const conLog: number[] = new Array(LOG_STACK)
socket.on('consumption', (data: number) => {
    conLog.push(data)
    conLog.shift()
    cView.innerText = String(data)
    drawGraph(cCtx, conLog, -100, 100)
})

drawAxis(gCtx, gAxisInfo)
const genLog: number[] = new Array(LOG_STACK)
socket.on('generation', (data: number) => {
    genLog.push(data)
    genLog.shift()
    gView.innerText = String(data)
    drawGraph(gCtx, genLog, 0, 1000)
})
