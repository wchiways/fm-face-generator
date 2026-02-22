import type { PotentialOption, FilterOption, FontWidthOption, FontColorOption } from '@/types'

export const potentialOptions: PotentialOption[] = [
  { value: "filter/filter1.png", label: "---潜力设置---", group: "header", disabled: true },
  // 固定潜力
  { value: "", label: "固定潜力", group: "fixed-header", disabled: true },
  { value: "images/poten/reboot/180.png", label: "180以上", group: "fixed" },
  { value: "images/poten/reboot/170.png", label: "170", group: "fixed" },
  { value: "images/poten/reboot/160.png", label: "160", group: "fixed" },
  { value: "images/poten/reboot/150.png", label: "150", group: "fixed" },
  { value: "images/poten/reboot/140.png", label: "140", group: "fixed" },
  { value: "images/poten/reboot/130.png", label: "130", group: "fixed" },
  { value: "images/poten/reboot/120.png", label: "120", group: "fixed" },
  // 随机潜力
  { value: "", label: "随机潜力", group: "random-header", disabled: true },
  { value: "images/poten/reboot/-10.png", label: "-10", group: "random" },
  { value: "images/poten/reboot/-95.png", label: "-9.5", group: "random" },
  { value: "images/poten/reboot/-9.png", label: "-9", group: "random" },
  { value: "images/poten/reboot/-85.png", label: "-8.5", group: "random" },
  { value: "images/poten/reboot/-8.png", label: "-8", group: "random" },
  { value: "images/poten/reboot/-75.png", label: "-7.5", group: "random" },
  { value: "images/poten/reboot/-7.png", label: "-7", group: "random" },
  // 随机人球员
  { value: "", label: "随机人球员", group: "gen-header", disabled: true },
  { value: "images/poten/reboot/gen/gen180.png", label: "180以上", group: "gen" },
  { value: "images/poten/reboot/gen/gen170.png", label: "170", group: "gen" },
  { value: "images/poten/reboot/gen/gen160.png", label: "160", group: "gen" },
  { value: "images/poten/reboot/gen/gen150.png", label: "150", group: "gen" },
  { value: "images/poten/reboot/gen/gen140.png", label: "140", group: "gen" },
  { value: "images/poten/reboot/gen/gen130.png", label: "130", group: "gen" },
  { value: "images/poten/reboot/gen/gen120.png", label: "120", group: "gen" },
  // 其他
  { value: "", label: "其他", group: "other-header", disabled: true },
  { value: "images/poten/reboot/special.png", label: "特别的", group: "other" },
  { value: "images/poten/reboot/celeb.png", label: "明星", group: "other" },
  { value: "images/poten/reboot/normal.png", label: "正常", group: "other" },
  { value: "images/poten/reboot/staff.png", label: "工作人员", group: "other" },
  // 固定潜力背带风格
  { value: "", label: "固定潜力背带风格", group: "strap-fixed-header", disabled: true },
  { value: "images/poten/reboot_strap/180.png", label: "背带风格 180", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/170.png", label: "背带风格 170", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/160.png", label: "背带风格 160", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/150.png", label: "背带风格 150", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/140.png", label: "背带风格 140", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/130.png", label: "背带风格 130", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/120.png", label: "背带风格 120", group: "strap-fixed" },
  // 随机潜力背带风格
  { value: "", label: "随机潜力背带风格", group: "strap-random-header", disabled: true },
  { value: "images/poten/reboot_strap/-10.png", label: "背带风格 -10", group: "strap-random" },
  { value: "images/poten/reboot_strap/-95.png", label: "背带风格 -95", group: "strap-random" },
  { value: "images/poten/reboot_strap/-9.png", label: "背带风格 -9", group: "strap-random" },
  { value: "images/poten/reboot_strap/-85.png", label: "背带风格 -85", group: "strap-random" },
  { value: "images/poten/reboot_strap/-8.png", label: "背带风格 -8", group: "strap-random" },
  { value: "images/poten/reboot_strap/-75.png", label: "背带风格 -75", group: "strap-random" },
  { value: "images/poten/reboot_strap/-7.png", label: "背带风格 -7", group: "strap-random" },
  // 背带风格 其他
  { value: "", label: "背带风格 其他", group: "strap-other-header", disabled: true },
  { value: "images/poten/reboot_strap/celeb.png", label: "背带风格 明星", group: "strap-other" },
  { value: "images/poten/reboot_strap/legend.png", label: "背带风格 传奇", group: "strap-other" },
  { value: "images/poten/reboot_strap/staff.png", label: "背带风格 工作人员", group: "strap-other" },
  { value: "images/poten/reboot_strap/normal.png", label: "背带风格 正常", group: "strap-other" },
]

export const filterOptions: FilterOption[] = [
  { value: "filter/filter1.png", label: "没有滤镜" },
  { value: "filter/filter2.png", label: "滤镜1" },
  { value: "filter/filter3.png", label: "滤镜2" },
  { value: "filter/filter4.png", label: "滤镜3" },
]

export const fontWidthOptions: FontWidthOption[] = [
  { value: "base", label: "基本" },
  { value: "long", label: "长名 LONG" },
  { value: "strap", label: "背带风格 STRAP" },
]

export const fontColorOptions: FontColorOption[] = [
  { value: "#ffd700", label: "金色" },
  { value: "#c0c0c0", label: "银色" },
  { value: "#7b68ee", label: "The Blue Lagoon" },
  { value: "#b0e0e6", label: "#b0e0e6" },
  { value: "#f0c27b", label: "#f0c27b" },
  { value: "#abbaab", label: "Metallic Toad" },
]
