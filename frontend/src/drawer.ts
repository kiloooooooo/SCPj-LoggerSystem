export type AxisInfo = {
    val: number,
    coor: number
}

export type Line = {
    color: string,
    coor: number
}

export const drawAxis = (ctx: CanvasRenderingContext2D, data: AxisInfo[]) => {
    for (let datum of data)
        ctx.fillText(String(datum.val), 375, datum.coor)
}

export const drawGraph =
    (ctx: CanvasRenderingContext2D,
     data: number[],
     color: string,
     min: number,
     max: number,
     doClear: boolean,
     additionalLines: Line[] = []) => {

    if (doClear) {
        ctx.clearRect(0, 0, 375, 300)
    }

    const logStack = data.length
    const interval = 375 / logStack
    const range = max - min
    const unit = 300 / range

    for (let additionalLine of additionalLines) {
        additionalLine.coor = 300 - unit * (additionalLine.coor - min)

        ctx.strokeStyle = additionalLine.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, additionalLine.coor)
        ctx.lineTo(360, additionalLine.coor)
        ctx.stroke()
    }

    data = data.map((val, idx, arr) => 300 - unit * (val - min))
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
