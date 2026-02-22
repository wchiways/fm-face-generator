import { useAppState } from '@/context/AppContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SimpleSelect, SelectOption } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { countries } from '@/data/countries'
import { potentialOptions, filterOptions, fontWidthOptions, fontColorOptions, exportFormatOptions } from '@/data/form-options'

export default function SettingsForm() {
  const { state, dispatch } = useAppState()

  // 将 countries 转为 Select options 格式
  const countryOptions = countries.map(c => ({ value: c.value, label: `${c.label} (${c.value})` }))

  return (
    <div className="flex flex-col gap-4">
      {/* 球员名称 */}
      <div className="space-y-1.5">
        <Label htmlFor="firstname">球员名称</Label>
        <Input
          id="firstname"
          value={state.settings.name}
          onChange={(e) => dispatch({ type: 'SET_SETTING', key: 'name', value: e.target.value })}
        />
      </div>

      {/* 国籍 — 238条数据，使用带搜索的 Select */}
      <div className="space-y-1.5">
        <Label>国籍</Label>
        <Select
          defaultValue="China"
          onValueChange={(v) => dispatch({ type: 'SET_NATION', nation: v })}
          options={countryOptions}
          placeholder="搜索国家..."
        />
      </div>

      {/* 潜力（勋章）— 选项多且有分组 */}
      <div className="space-y-1.5">
        <Label>潜力（勋章）</Label>
        <Select
          defaultValue="filter/filter1.png"
          onValueChange={(v) => dispatch({ type: 'SET_SETTING', key: 'poten', value: v })}
          options={potentialOptions}
          placeholder="选择潜力..."
        />
      </div>

      {/* 照片滤镜 — 4个选项，SimpleSelect */}
      <div className="space-y-1.5">
        <Label>照片滤镜</Label>
        <SimpleSelect
          defaultValue="filter/filter1.png"
          onValueChange={(v) => dispatch({ type: 'SET_SETTING', key: 'filter', value: v })}
        >
          {filterOptions.map((opt) => (
            <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
          ))}
        </SimpleSelect>
      </div>

      {/* 字体颜色 */}
      <div className="space-y-1.5">
        <Label>字体颜色</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={state.settings.fontFilter}
            onChange={(e) => dispatch({ type: 'SET_SETTING', key: 'fontFilter', value: e.target.value })}
            className="w-12 h-9 p-1 cursor-pointer"
          />
          <SimpleSelect
            value={state.settings.fontFilter}
            onValueChange={(v) => dispatch({ type: 'SET_SETTING', key: 'fontFilter', value: v })}
            className="flex-1"
          >
            {fontColorOptions.map((opt) => (
              <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
            ))}
          </SimpleSelect>
        </div>
      </div>

      {/* 字体长度 */}
      <div className="space-y-1.5">
        <Label>字体长度</Label>
        <SimpleSelect
          defaultValue="base"
          onValueChange={(v) => dispatch({ type: 'SET_SETTING', key: 'fontWidth', value: v })}
        >
          {fontWidthOptions.map((opt) => (
            <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
          ))}
        </SimpleSelect>
      </div>

      {/* 制作者签名 */}
      <div className="space-y-1.5">
        <Label htmlFor="madeby">制作者签名</Label>
        <Input
          id="madeby"
          value={state.settings.sign}
          onChange={(e) => dispatch({ type: 'SET_SETTING', key: 'sign', value: e.target.value })}
        />
      </div>

      <Separator />

      {/* 导出格式 */}
      <div className="space-y-1.5">
        <Label>导出格式</Label>
        <SimpleSelect
          value={state.exportFormat}
          onValueChange={(v) => dispatch({ type: 'SET_EXPORT_FORMAT', format: v as 'png' | 'jpeg' })}
        >
          {exportFormatOptions.map((opt) => (
            <SelectOption key={opt.value} value={opt.value}>{opt.label}</SelectOption>
          ))}
        </SimpleSelect>
      </div>

      {/* JPEG 质量滑块 — 仅 JPEG 时显示 */}
      {state.exportFormat === 'jpeg' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>JPEG 质量</Label>
            <span className="text-xs text-muted-foreground">{Math.round(state.exportQuality * 100)}%</span>
          </div>
          <Slider
            min={0.5}
            max={1}
            step={0.01}
            value={state.exportQuality}
            onValueChange={(v) => dispatch({ type: 'SET_EXPORT_QUALITY', quality: v })}
          />
        </div>
      )}
    </div>
  )
}
