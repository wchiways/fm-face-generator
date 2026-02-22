# FM Face Generator

Football Manager 球员头像生成器，基于 [FMGUNZO](http://fmgunzo.tistory.com) / [Mr.Potato](http://mrpotato.tistory.com) 的原始项目重构。

## 功能

- 上传照片并裁剪为正方形头像
- 238 个国家/地区国旗叠加
- 多种潜力徽章（120-180 PA、传奇、名人等）
- 多种滤镜风格（经典、现代、复古、赛季）
- 可自定义球员名称、签名、字体颜色和宽度
- 批量生成并打包为 ZIP 下载
- 支持 CSV 映射批量命名
- 响应式布局，支持桌面端和移动端

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.7 |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS 4 |
| 图片裁剪 | react-easy-crop |
| 渲染 | Canvas 2D（8 层合成） |
| 批量处理 | JSZip + file-saver |
| 图标 | lucide-react |
| 包管理 | pnpm |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 项目结构

```
src/
├── components/
│   ├── ui/              # 基础 UI 组件（Button, Select, Toast 等）
│   ├── Header.tsx        # 顶部导航栏
│   ├── ImageUploader.tsx # 图片上传与裁剪
│   ├── SettingsForm.tsx  # 参数设置表单
│   ├── PreviewPanel.tsx  # 预览与下载
│   └── BatchSection.tsx  # 批量生成
├── context/
│   └── AppContext.tsx    # 全局状态管理（Context + useReducer）
├── lib/
│   ├── render.ts        # Canvas 渲染管线
│   └── batch-utils.ts   # 批量处理工具函数
├── data/
│   ├── countries.ts     # 238 条国家数据
│   └── form-options.ts  # 表单选项数据
├── types.ts
├── App.tsx
└── index.css            # 主题变量 + 自定义字体
```

## Canvas 渲染管线

头像通过 8 层 Canvas 合成生成：

1. 用户照片（圆角裁剪）
2. 底层边框
3. 照片滤镜
4. 字体滤镜
5. 国旗
6. 潜力徽章
7. 占位滤镜
8. 名称文字 + 弧形签名

## 致谢

- 原始项目：[FMGUNZO](http://fmgunzo.tistory.com)
- 头像模板：[Mr.Potato](http://mrpotato.tistory.com)
- 汉化/二改：[Chiway Wang](https://chiway.blog)

## License

MIT
