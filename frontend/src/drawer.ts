export type AxisInfo = {
    val: number,
    value: number
}

export type Line = {
    color: string,
    value: number
}

export const drawAxis = (ctx: CanvasRenderingContext2D, data: AxisInfo[]) => {
    for (let datum of data)
        ctx.fillText(String(datum.val), 375, datum.value)
}

export const drawGraph =
    (ctx: CanvasRenderingContext2D,
     data: number[],
     color: string,
     rangeMin: number,
     rangeMax: number,
     doClear: boolean,
     additionalLines: Line[] = []) => {

    if (doClear) {
        ctx.clearRect(0, 0, 375, 300)
    }

    const logStack = data.length
    const interval = 375 / logStack
    const range = rangeMax - rangeMin
    const unit = 300 / range

    for (let additionalLine of additionalLines) {
        additionalLine.value = 300 - unit * (additionalLine.value - rangeMin)

        ctx.strokeStyle = additionalLine.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, additionalLine.value)
        ctx.lineTo(360, additionalLine.value)
        ctx.stroke()
    }

    data = data.map((val, idx, arr) => 300 - unit * (val - rangeMin))
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(0, data[0])
    for (let i = 0; i < logStack; i++) {
        ctx.lineTo(interval * i, data[i])
    }
    ctx.stroke()
}

export const drawBattState =
    (ctx: CanvasRenderingContext2D,
     currentValue: number,
     color: string,
     capacity: number) => {

    ctx.clearRect(0, 0, 400, 300)

    ctx.strokeStyle = color
    ctx.strokeRect(30, 20, 50, 260)

    let battLevel = currentValue / capacity
    let coor = 20 + (1 - battLevel) * 240
    ctx.fillStyle = color
    ctx.fillRect(30, coor, 50, 280 - coor)

    let percentage = Math.round(battLevel * 100)
    let remaining = Math.round(currentValue)

    ctx.font = '40px mono'
    ctx.fillText(`${ percentage } %`, 130, 130)
    ctx.fillText(`${ remaining } kWs`, 130, 190)

    console.log(battLevel)
}
