// 图片内存缓存 — 避免重复加载静态资源
const imageCache = new Map<string, HTMLImageElement>()

// 字体预加载状态
let fontsPreloaded = false

/**
 * 带缓存的图片加载
 * 对于静态资源（filter/、images/）命中缓存直接返回，不再重复网络请求
 * data: URL 不缓存（用户上传的图片每次不同）
 */
export function cachedLoadImg(src: string): Promise<HTMLImageElement> {
  // data URL 不缓存
  if (src.startsWith('data:')) {
    return loadImgRaw(src)
  }

  const cached = imageCache.get(src)
  if (cached) {
    return Promise.resolve(cached)
  }

  return loadImgRaw(src).then((img) => {
    imageCache.set(src, img)
    return img
  })
}

function loadImgRaw(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image load failed: ' + src))
    img.src = src
  })
}

/**
 * 预加载关键资源：核心滤镜 + 字体
 * 在应用启动时调用一次，后续渲染无需等待
 */
export async function preloadResources(): Promise<void> {
  // 1. 预加载每次渲染都需要的核心图片
  const criticalImages = [
    'filter/og4.png',        // 底层边框 — 每次渲染必用
    'filter/filter1.png',    // 默认滤镜
    'filter/fontfilter2.png', // 字体滤镜
  ]

  await Promise.all(criticalImages.map((src) => cachedLoadImg(src)))

  // 2. 预加载字体（确保 Canvas 绘制时字体已就绪）
  if (!fontsPreloaded && typeof document !== 'undefined') {
    fontsPreloaded = true
    await Promise.all([
      document.fonts.load("36px 'Bebas Neue'"),
      document.fonts.load("italic 40px 'koverwatch'"),
      document.fonts.load("normal 100 8px 'Venus Rising Regular'"),
    ]).catch(() => {
      // 字体加载失败不阻塞应用
    })
  }
}

/**
 * 清除指定缓存或全部缓存
 */
export function clearImageCache(src?: string): void {
  if (src) {
    imageCache.delete(src)
  } else {
    imageCache.clear()
  }
}
