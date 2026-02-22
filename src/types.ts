export interface FaceSettings {
  name: string
  nationImgSrc: string
  poten: string
  filter: string
  fontFilter: string
  fontWidth: 'base' | 'long' | 'strap'
  sign: string
}

export interface BatchNameMode {
  type: 'filename' | 'fixed' | 'csv'
}

export interface BatchProgress {
  current: number
  total: number
  currentFile: string
  status: 'idle' | 'processing' | 'packing' | 'done' | 'error'
  successCount: number
  errorMessage?: string
}

export type NameScript = 'lowercase' | 'uppercase' | 'korean' | 'other'

export interface PotentialOption {
  value: string
  label: string
  group: string
  disabled?: boolean
}

export interface FilterOption {
  value: string
  label: string
}

export interface FontWidthOption {
  value: 'base' | 'long' | 'strap'
  label: string
}

export interface FontColorOption {
  value: string
  label: string
}
