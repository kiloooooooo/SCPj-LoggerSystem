import io from 'socket.io-client'
import { Line, drawAxis, drawGraph, drawBattState } from './drawer'
import {
    vAxisInfo,
    sAxisInfo,
    tAxisInfo,
    cAxisInfo,
    gAxisInfo
} from './axis-info'

type LogData = {
    voltage: number,
    speed: number,
    temperature: number,
    consumption: number,
    generation: number,
    toConsume: number,
    suggSpeed: number,
    battRemaining: number
}

const LOG_STACK = 20
const BATTERY_CAPACITY = 12960  // = 3600 * 3600 / 1000 [kWs]
const GRAPH_COLOR_PRIMARY = '#2979FF'
const GRAPH_COLOR_SECONDARY = '#747474'

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
const bCanvas = <HTMLCanvasElement> document.getElementById('canvas-battery')!!
const bCtx = bCanvas.getContext('2d')!!

const voltageLog: number[] = new Array(LOG_STACK)
const speedLog: number[] = new Array(LOG_STACK)
const temperatureLog: number[] = new Array(LOG_STACK)
const consumptionLog: number[] = new Array(LOG_STACK)
const generationLog: number[] = new Array(LOG_STACK)
const suggSpeedLog: number[] = new Array(LOG_STACK)
const toConsumeLog: number[] = new Array(LOG_STACK)

drawAxis(vCtx, vAxisInfo)
drawAxis(sCtx, sAxisInfo)
drawAxis(tCtx, tAxisInfo)
drawAxis(cCtx, cAxisInfo)
drawAxis(gCtx, gAxisInfo)

socket.on('alljson', (json: string) => {
    let data: LogData = JSON.parse(json)
    let voltage = data.voltage
    let speed = data.speed
    let temperature = data.temperature
    let consumption = data.consumption
    let generation = data.generation
    let toConsume = data.toConsume
    let suggSpeed = data.suggSpeed
    let battRemaining = data.battRemaining

    // Voltage
    voltageLog.push(voltage)
    voltageLog.shift()
    vView.innerText = `${ voltage } V`
    drawGraph(vCtx, voltageLog, GRAPH_COLOR_PRIMARY,
              80, 120, true, [{ color: '#FF0000', value: 100 } as Line])

    // Speed
    speedLog.push(speed)
    speedLog.shift()
    suggSpeedLog.push(suggSpeed)
    suggSpeedLog.shift()
    sView.innerText = `${ speed } km/h`
    drawGraph(sCtx, speedLog, GRAPH_COLOR_PRIMARY,
              0, 150, true, [{ color: '#FF0000', value: 80 } as Line])
    drawGraph(sCtx, suggSpeedLog, GRAPH_COLOR_SECONDARY, 0, 150, false)

    // Inverter Temperature
    temperatureLog.push(temperature)
    temperatureLog.shift()
    tView.innerText = `${ temperature } ℃`
    drawGraph(tCtx, temperatureLog, GRAPH_COLOR_PRIMARY,
              20, 120, true, [{ color: '#FF0000', value: 80 } as Line])

    // Electric Consumption
    consumptionLog.push(consumption)
    consumptionLog.shift()
    toConsumeLog.push(toConsume)
    toConsumeLog.shift()
    cView.innerText = `${ consumption } kW`
    drawGraph(cCtx, consumptionLog,　GRAPH_COLOR_PRIMARY,
              -4, 4, true, [{ color: '#00FF00', value: 0 } as Line])
    drawGraph(cCtx, toConsumeLog, GRAPH_COLOR_SECONDARY, -4, 4, false)

    // Electic Generation
    generationLog.push(generation)
    generationLog.shift()
    gView.innerText = `${ generation } kW`
    drawGraph(gCtx, generationLog, GRAPH_COLOR_PRIMARY, 0, 1.2, true)

    // Battery
    drawBattState(bCtx, battRemaining, GRAPH_COLOR_PRIMARY, BATTERY_CAPACITY)
})

socket.on('error', (message: string) => {
    console.error(message)
})
