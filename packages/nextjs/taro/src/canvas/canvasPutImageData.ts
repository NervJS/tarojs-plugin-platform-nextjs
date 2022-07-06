import promisify from 'mpromisify'
import {limited} from '../_util'
import type * as swan from '../swan'

const canvasPutImageDataInternal: typeof swan.canvasPutImageData = ({
    canvasId,
    data,
    x,
    y,
    width,
    height,
    success,
    fail,
    complete
}) => {
    if (typeof canvasId !== 'string') {
        fail?.({
            errMsg: `The canvasId param is required.`
        })
        complete?.()
        return
    }

    const canvas = document.querySelector(`canvas[canvas-id="${canvasId}"]`) as HTMLCanvasElement
    if (!canvas) {
        fail?.({
            errMsg: `Cannot find canvas by using canvasId: ${canvasId}.`
        })
        complete?.()
        return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        fail?.({
            errMsg: 'Your browser does not support canvas api.'
        })
        complete?.()
        return
    }

    try {
        const imageData = new ImageData(data, width, height)
        ctx.putImageData(imageData, x, y)
        success?.()
    } catch (err) {
        fail?.({
            errMsg: err.message
        })
    }
    complete?.()
}

/**
 * 将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件
 */
export const canvasPutImageData = promisify(limited.async('canvasPutImageData', canvasPutImageDataInternal))
