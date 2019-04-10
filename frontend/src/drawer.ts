export type AxisInfo = {
    val: number,
    coor: number
}

export const drawAxis = (ctx: CanvasRenderingContext2D, data: AxisInfo[]) => {
    for (let datum of data)
        ctx.fillText(String(datum.val), 375, datum.coor)
}

export const drawGraph = (ctx: CanvasRenderingContext2D, data: number[], min: number, max: number, redline?: number) => {
    ctx.clearRect(0, 0, 375, 300)

    const logStack = data.length
    const interval = 375 / logStack
    const range = max - min
    const unit = 300 / range

    data = data.map((val, idx, arr) => 300 - unit * (val - min))
    
    if (redline) {
        redline = 300 - unit * (redline - min)

        ctx.strokeStyle = '#FF0000'
        ctx.beginPath()
        ctx.moveTo(0, redline)
        ctx.lineTo(375, redline)
        ctx.stroke()
    }
    
    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    ctx.moveTo(0, data[0])
    for (let i = 0; i < logStack; i++) {
        ctx.lineTo(interval * i, data[i])
    }
    ctx.stroke()
}
