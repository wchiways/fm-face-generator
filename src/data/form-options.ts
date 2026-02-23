import type { PotentialOption, FilterOption, FontWidthOption, FontColorOption, ExportFormat } from '@/types'

export const potentialOptions: PotentialOption[] = [
  { value: "filter/filter1.png", label: "option.potentialHeader", group: "header", disabled: true },
  { value: "none", label: "option.noPotential", group: "none" },
  // 固定潜力
  { value: "", label: "option.fixedPotential", group: "fixed-header", disabled: true },
  { value: "images/poten/reboot/180.png", label: "option.above180", group: "fixed" },
  { value: "images/poten/reboot/170.png", label: "170", group: "fixed" },
  { value: "images/poten/reboot/160.png", label: "160", group: "fixed" },
  { value: "images/poten/reboot/150.png", label: "150", group: "fixed" },
  { value: "images/poten/reboot/140.png", label: "140", group: "fixed" },
  { value: "images/poten/reboot/130.png", label: "130", group: "fixed" },
  { value: "images/poten/reboot/120.png", label: "120", group: "fixed" },
  // 随机潜力
  { value: "", label: "option.randomPotential", group: "random-header", disabled: true },
  { value: "images/poten/reboot/-10.png", label: "-10", group: "random" },
  { value: "images/poten/reboot/-95.png", label: "-9.5", group: "random" },
  { value: "images/poten/reboot/-9.png", label: "-9", group: "random" },
  { value: "images/poten/reboot/-85.png", label: "-8.5", group: "random" },
  { value: "images/poten/reboot/-8.png", label: "-8", group: "random" },
  { value: "images/poten/reboot/-75.png", label: "-7.5", group: "random" },
  { value: "images/poten/reboot/-7.png", label: "-7", group: "random" },
  // 随机人球员
  { value: "", label: "option.randomPlayer", group: "gen-header", disabled: true },
  { value: "images/poten/reboot/gen/gen180.png", label: "option.above180", group: "gen" },
  { value: "images/poten/reboot/gen/gen170.png", label: "170", group: "gen" },
  { value: "images/poten/reboot/gen/gen160.png", label: "160", group: "gen" },
  { value: "images/poten/reboot/gen/gen150.png", label: "150", group: "gen" },
  { value: "images/poten/reboot/gen/gen140.png", label: "140", group: "gen" },
  { value: "images/poten/reboot/gen/gen130.png", label: "130", group: "gen" },
  { value: "images/poten/reboot/gen/gen120.png", label: "120", group: "gen" },
  // 其他
  { value: "", label: "option.other", group: "other-header", disabled: true },
  { value: "images/poten/reboot/special.png", label: "option.special", group: "other" },
  { value: "images/poten/reboot/celeb.png", label: "option.celebrity", group: "other" },
  { value: "images/poten/reboot/normal.png", label: "option.normal", group: "other" },
  { value: "images/poten/reboot/staff.png", label: "option.staff", group: "other" },
  // 固定潜力背带风格
  { value: "", label: "option.strapFixedPotential", group: "strap-fixed-header", disabled: true },
  { value: "images/poten/reboot_strap/180.png", label: "option.strap180", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/170.png", label: "option.strap170", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/160.png", label: "option.strap160", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/150.png", label: "option.strap150", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/140.png", label: "option.strap140", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/130.png", label: "option.strap130", group: "strap-fixed" },
  { value: "images/poten/reboot_strap/120.png", label: "option.strap120", group: "strap-fixed" },
  // 随机潜力背带风格
  { value: "", label: "option.strapRandomPotential", group: "strap-random-header", disabled: true },
  { value: "images/poten/reboot_strap/-10.png", label: "option.strapRandom10", group: "strap-random" },
  { value: "images/poten/reboot_strap/-95.png", label: "option.strapRandom95", group: "strap-random" },
  { value: "images/poten/reboot_strap/-9.png", label: "option.strapRandom9", group: "strap-random" },
  { value: "images/poten/reboot_strap/-85.png", label: "option.strapRandom85", group: "strap-random" },
  { value: "images/poten/reboot_strap/-8.png", label: "option.strapRandom8", group: "strap-random" },
  { value: "images/poten/reboot_strap/-75.png", label: "option.strapRandom75", group: "strap-random" },
  { value: "images/poten/reboot_strap/-7.png", label: "option.strapRandom7", group: "strap-random" },
  // 背带风格 其他
  { value: "", label: "option.strapOther", group: "strap-other-header", disabled: true },
  { value: "images/poten/reboot_strap/celeb.png", label: "option.strapCelebrity", group: "strap-other" },
  { value: "images/poten/reboot_strap/legend.png", label: "option.strapLegend", group: "strap-other" },
  { value: "images/poten/reboot_strap/staff.png", label: "option.strapStaff", group: "strap-other" },
  { value: "images/poten/reboot_strap/normal.png", label: "option.strapNormal", group: "strap-other" },
]

export const filterOptions: FilterOption[] = [
  { value: "filter/filter1.png", label: "option.noFilter" },
  { value: "filter/filter2.png", label: "option.filter1" },
  { value: "filter/filter3.png", label: "option.filter2" },
  { value: "filter/filter4.png", label: "option.filter3" },
]

export const fontWidthOptions: FontWidthOption[] = [
  { value: "base", label: "option.fontBase" },
  { value: "long", label: "option.fontLong" },
  { value: "strap", label: "option.fontStrap" },
]

export const fontColorOptions: FontColorOption[] = [
  { value: "#ffd700", label: "option.gold" },
  { value: "#c0c0c0", label: "option.silver" },
  { value: "#7b68ee", label: "option.blueLagoon" },
  { value: "#b0e0e6", label: "option.powderBlue" },
  { value: "#f0c27b", label: "option.warmSunset" },
  { value: "#abbaab", label: "option.metallicToad" },
]

export const exportFormatOptions: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'option.pngLossless' },
  { value: 'jpeg', label: 'option.jpegLossy' },
]
