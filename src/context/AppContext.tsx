import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { FaceSettings, BatchProgress } from '@/types'

interface AppState {
  settings: FaceSettings
  croppedImage: string | null
  fileName: string
  saveFileName: string
  batchNameMode: 'filename' | 'fixed' | 'csv'
  batchCsvText: string
  batchProgress: BatchProgress
  zoom: number
  rotation: number
  guidelinesVisible: boolean
}

const initialState: AppState = {
  settings: {
    name: 'Mr.Toni',
    nationImgSrc: './images/China.png',
    poten: 'filter/filter1.png',
    filter: 'filter/filter1.png',
    fontFilter: '#ffd700',
    fontWidth: 'base',
    sign: 'Chiway',
  },
  croppedImage: null,
  fileName: '',
  saveFileName: '',
  batchNameMode: 'filename',
  batchCsvText: '',
  batchProgress: {
    current: 0,
    total: 0,
    currentFile: '',
    status: 'idle',
    successCount: 0,
  },
  zoom: 1,
  rotation: 0,
  guidelinesVisible: true,
}

type Action =
  | { type: 'SET_SETTING'; key: keyof FaceSettings; value: string }
  | { type: 'SET_NATION'; nation: string }
  | { type: 'SET_CROPPED_IMAGE'; image: string | null }
  | { type: 'SET_FILE_NAME'; name: string }
  | { type: 'SET_SAVE_FILE_NAME'; name: string }
  | { type: 'SET_BATCH_NAME_MODE'; mode: 'filename' | 'fixed' | 'csv' }
  | { type: 'SET_BATCH_CSV'; text: string }
  | { type: 'SET_BATCH_PROGRESS'; progress: Partial<BatchProgress> }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_ROTATION'; rotation: number }
  | { type: 'TOGGLE_GUIDELINES' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SETTING':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } }
    case 'SET_NATION': {
      const nationImgSrc = action.nation === '' || action.nation === 'None'
        ? 'images/None.png'
        : `./images/${action.nation}.png`
      return { ...state, settings: { ...state.settings, nationImgSrc } }
    }
    case 'SET_CROPPED_IMAGE':
      return { ...state, croppedImage: action.image }
    case 'SET_FILE_NAME':
      return { ...state, fileName: action.name }
    case 'SET_SAVE_FILE_NAME':
      return { ...state, saveFileName: action.name }
    case 'SET_BATCH_NAME_MODE':
      return { ...state, batchNameMode: action.mode }
    case 'SET_BATCH_CSV':
      return { ...state, batchCsvText: action.text }
    case 'SET_BATCH_PROGRESS':
      return { ...state, batchProgress: { ...state.batchProgress, ...action.progress } }
    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom }
    case 'SET_ROTATION':
      return { ...state, rotation: action.rotation }
    case 'TOGGLE_GUIDELINES':
      return { ...state, guidelinesVisible: !state.guidelinesVisible }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
}>({ state: initialState, dispatch: () => {} })

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  return useContext(AppContext)
}
