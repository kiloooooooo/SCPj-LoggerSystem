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

export const drawGraph = (ctx: CanvasRenderingContext2D, data: number[], min: number, max: number, additionalLine?: Line) => {
    ctx.clearRect(0, 0, 375, 300)

    const logStack = data.length
    const interval = 375 / logStack
    const range = max - min
    const unit = 300 / range

    data = data.map((val, idx, arr) => 300 - unit * (val - min))
    
    if (additionalLine) {
        additionalLine.coor = 300 - unit * (additionalLine.coor - min)

        ctx.strokeStyle = additionalLine.color
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, additionalLine.coor)
        ctx.lineTo(360, additionalLine.coor)
        ctx.stroke()
    }
    
    ctx.strokeStyle = '#2979FF'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, data[0])
    for (let i = 0; i < logStack; i++) {
        ctx.lineTo(interval * i, data[i])
    }
    ctx.stroke()
}
