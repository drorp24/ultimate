import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    mode: 'light',
    locale: 'en',
    drawerOpen: true,
    window: {},
    view: { tags: true },
    hide: { relations: false },
    editor: { scrolling: 0 },
  },
  reducers: {
    toggleMode: state => ({
      ...state,
      mode: state.mode === 'light' ? 'dark' : 'light',
    }),
    toggleLocale: state => ({
      ...state,
      locale: state.locale === 'en' ? 'he' : 'en',
    }),
    toggleDrawer: state => ({
      ...state,
      drawerOpen: !state.drawerOpen,
    }),
    setDimensions: (state, { payload: { height, width } }) => ({
      ...state,
      window: {
        height,
        width,
      },
    }),
    setAppProp: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    scrolling: state => ({
      ...state,
      editor: {
        ...state.editor,
        scrolling: state.editor.scrolling + 1,
      },
    }),
    view: (state, { payload }) => ({
      ...state,
      view: {
        ...state.view,
        ...payload,
        exclusiveRelations: payload.relations
          ? false
          : payload.exclusiveRelations || state.view.exclusiveRelations,
      },
    }),
    hide: (state, { payload }) => ({
      ...state,
      hide: {
        ...state.hide,
        ...payload,
      },
    }),
  },
})

const { actions, reducer } = appSlice

export default reducer
export const {
  toggleMode,
  toggleLocale,
  toggleDrawer,
  setDimensions,
  view,
  hide,
  setAppProp,
  scrolling,
} = actions
