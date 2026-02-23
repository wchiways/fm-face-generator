import type { FaceSettings, NameScript } from '@/types'
import { cachedLoadImg } from '@/lib/resource-cache'

// 基于首字符检测文字系统
export function detectNameScript(name: string): NameScript {
  if (!name || name.length === 0) return 'other'
  const ch = name.charAt(0)
  if (ch >= 'a' && ch <= 'z') return 'lowercase'
  if (ch >= 'A' && ch <= 'Z') return 'uppercase'
  if (ch >= '\uAC00' && ch <= '\uD7A3') return 'korean'
  return 'other'
}

// 渐变色映射表
const gradientMap: Record<string, [string, string][]> = {
  '#ffd700': [
    ["0", "rgba(223,204,162,1)"],
    ["0.01", "rgba(223,204,162,1)"],
    ["0.12", "rgba(213,192,145,1)"],
    ["0.22", "rgba(228,210,171,1)"],
    ["0.34", "rgba(223,204,162,1)"],
    ["0.44", "rgba(228,210,171,1)"],
    ["0.54", "rgba(213,192,145,1)"],
    ["0.65", "rgba(228,210,171,1)"],
    ["0.77", "rgba(223,204,162,1)"],
    ["0.90", "rgba(228,210,171,1)"],
    ["1", "rgba(196,168,117,1)"],
  ],
  '#c0c0c0': [
    ["0", "rgba(179,171,171,1)"],
    ["0.01", "rgba(179,171,171,1)"],
    ["0.12", "rgba(210,202,202,1)"],
    ["0.22", "rgba(203,197,197,1)"],
    ["0.34", "rgba(179,171,171,1)"],
    ["0.44", "rgba(235,225,225,1)"],
    ["0.54", "rgba(210,202,202,1)"],
    ["0.65", "rgba(235,225,225,1)"],
    ["0.77", "rgba(179,171,171,1)"],
    ["0.90", "rgba(235,225,225,1)"],
    ["1", "rgba(190,186,186,1)"],
  ],
  '#7b68ee': [
    ["0", "rgba(67,198,172,1)"],
    ["1", "rgba(25,22,84,1)"],
  ],
  '#b0e0e6': [
    ["0", "rgba(76, 161, 175,1)"],
    ["1", "rgba(196, 224, 229,1)"],
  ],
  '#f0c27b': [
    ["0", "rgba(240, 194, 123,1)"],
    ["1", "rgba(75, 18, 72,1)"],
  ],
  '#abbaab': [
    ["0", "rgba(171, 186, 171,1)"],
    ["1", "rgba(255, 255, 255,1)"],
  ],
}

// 提取渐变色逻辑为可复用函数
export function applyGradientFill(
  ctx: CanvasRenderingContext2D,
  gradient: CanvasGradient,
  fontFilter: string
): void {
  const stops = gradientMap[fontFilter]
  if (stops) {
    stops.forEach(([offset, color]) => {
      gradient.addColorStop(Number(offset), color)
    })
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = fontFilter
  }
}

// 圆角裁剪路径
export function roundedImage(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// 沿弧线绘制文字
export function drawTextAlongArc(
  ctx: CanvasRenderingContext2D,
  str: string,
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
): void {
  const len = str.length
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(-50 * (angle / len) / 90)
  for (let n = 0; n < len; n++) {
    ctx.rotate(angle / len)
    ctx.save()
    ctx.translate(0, -1 * radius)
    ctx.fillText(str[n], 0, 0)
    ctx.restore()
  }
  ctx.restore()
}

// 绘制名称文字和签名
export function drawText(
  ctx: CanvasRenderingContext2D,
  can: HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  NAME: string,
  FONTFILTER: string,
  FONTWIDTH: string,
  SIGN: string
): void {
  const script = detectNameScript(NAME)

  // 设置字体和缩放
  if (FONTWIDTH === 'base') {
    can.style.letterSpacing = 2.1 + 'px'
    if (script === 'korean') {
      ctx.font = "italic 40px 'koverwatch'"
    } else {
      ctx.font = "36px 'Bebas Neue'"
    }
    ctx.save()
    ctx.scale(0.83, 0.95)
  } else if (FONTWIDTH === 'long') {
    can.style.letterSpacing = 1.05 + 'px'
    if (script === 'korean') {
      ctx.font = "italic 40px 'koverwatch'"
    } else {
      ctx.font = "30px 'Bebas Neue'"
    }
    ctx.save()
    ctx.scale(0.83, 0.95)
  }
  if (FONTWIDTH === 'strap') {
    can.style.letterSpacing = 1.05 + 'px'
    if (script === 'korean') {
      ctx.font = "italic 30px 'koverwatch'"
    } else if (script === 'lowercase' || script === 'uppercase') {
      ctx.font = "italic 30px 'Bebas Neue'"
    } else {
      ctx.font = "30px 'Bebas Neue'"
    }
    ctx.save()
    ctx.scale(0.83, 0.93)
  }

  // 第一遍绘制（阴影层）
  if (FONTWIDTH === 'strap') {
    ctx.shadowColor = "rgba(11,1,2,0.5)"
    ctx.shadowOffsetX = -1.5
    ctx.shadowOffsetY = 1.5
    ctx.shadowBlur = 0.1
  } else {
    ctx.shadowColor = "rgba(11,1,2,0.5)"
    ctx.shadowOffsetX = -1.5
    ctx.shadowOffsetY = 1.5
    ctx.shadowBlur = 0.5
  }
  ctx.textAlign = "center"
  if (FONTWIDTH === 'strap') {
    ctx.textAlign = "left"
    ctx.translate(0, 0)
    ctx.rotate(-85 * Math.PI / 180)
    ctx.textAlign = 'right'
    ctx.fillText(NAME, -73, 57)
  } else {
    ctx.fillText(NAME, canvas.width * 1.21 / 2, (95 * canvas.height / 100) * 1.047)
  }

  // 第二遍绘制（渐变层）
  const gradient = ctx.createLinearGradient(
    (canvas.width * 1.21 / 2) - (ctx.measureText(NAME).width / 2), 0,
    (canvas.width * 1.21 / 2) + (ctx.measureText(NAME).width / 2), 0
  )
  applyGradientFill(ctx, gradient, FONTFILTER)

  ctx.shadowColor = "black"
  if (FONTWIDTH === 'strap') {
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 2
  } else {
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 5
  }
  ctx.textAlign = "center"
  if (FONTWIDTH === 'strap') {
    ctx.textAlign = 'right'
    ctx.fillText(NAME, -73, 57)
  } else {
    ctx.fillText(NAME, canvas.width * 1.21 / 2, (95 * canvas.height / 100) * 1.047)
  }
  ctx.scale(1, 1)
  ctx.restore()

  // 绘制签名弧形文字
  const centerX = canvas.width - 56.3
  const centerY = canvas.height - 294
  const angle = Math.PI * 0.57
  const radius = 45.8

  ctx.save()
  ctx.scale(1, 1)
  ctx.font = "normal 100 8px 'Venus Rising Regular'"
  const gradient2 = ctx.createLinearGradient(
    (canvas.width * 1.21 / 2) - (ctx.measureText(NAME).width / 2), 0,
    (canvas.width * 1.21 / 2) + (ctx.measureText(NAME).width / 2), 0
  )
  applyGradientFill(ctx, gradient2, FONTFILTER)

  ctx.shadowColor = "black"
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 7

  drawTextAlongArc(ctx, SIGN, centerX, centerY, radius, angle)

  ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI, false)
  ctx.restore()
}

// 核心渲染函数（可复用，支持单图和批量）
export async function renderFace(
  imageData: string,
  settings: FaceSettings,
  targetCanvas: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  const canvas = targetCanvas

  // 彻底重置 canvas 状态（清除残留的变换矩阵、裁剪路径等）
  canvas.width = canvas.width

  const ctx = canvas.getContext('2d')!

  const { name: NAME, nationImgSrc: NATION2, poten: POTEN, filter: FILTER, fontFilter: FONTFILTER, fontWidth: FONTWIDTH, sign: SIGN } = settings

  // 1. 绘制用户照片（圆角裁剪）
  const img = await cachedLoadImg(imageData)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  roundedImage(ctx, 1.6, 1.6, 346.5, 346.5, 60)
  ctx.clip()
  ctx.scale(1, 1)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  ctx.restore()

  // 2. 底层边框
  const filter = await cachedLoadImg('filter/og4.png')
  ctx.drawImage(filter, 0, 0, canvas.width, canvas.height)

  // 3. 照片滤镜
  const imgft = await cachedLoadImg(FILTER)
  ctx.drawImage(imgft, 0, 0, canvas.width, canvas.height)
  ctx.textAlign = "center"

  // 4. 国旗
  const img2 = await cachedLoadImg(NATION2)
  ctx.drawImage(img2, 0, 0, canvas.width, canvas.height)

  // 5. 潜力徽章
  if (POTEN && POTEN !== 'none') {
    const img3 = await cachedLoadImg(POTEN)
    ctx.drawImage(img3, 0, 0, canvas.width, canvas.height)
  }

  // 6. 绘制文字和签名
  drawText(ctx, canvas, canvas, NAME, FONTFILTER, FONTWIDTH, SIGN)

  return canvas
}
