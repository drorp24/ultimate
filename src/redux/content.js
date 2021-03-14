import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  // current,
} from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

import { getContent } from '../api/fakeEditorApi'
import realEditorApi from '../api/realEditorApi'

// * normalization
const contentAdapter = createEntityAdapter({
  selectId: ({ data: { id } }) => id,
  sortComparer: (a, b) => Number(b.data?.score) - Number(a.data?.score),
})

// * thunk
export const fetchContent = createAsyncThunk(
  'content/fetch',
  async ({ convertContent, showContent }, thunkAPI) => {
    try {
      const rawContent = await realEditorApi('doc_80')
      if (!rawContent) throw new Error('No rawContent returned')
      if (rawContent.error)
        throw new Error(rawContent.error.message?.toString())

      return {}
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString())
    }
  }
)

// * reducers / actions
const initialState = contentAdapter.getInitialState({
  loading: 'idle',
  changes: 0,
  selected: null,
})

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clear: () => initialState,
    add: contentAdapter.addOne,
    update: contentAdapter.updateOne,
    error: (state, { payload: error }) => ({ ...state, error }),
  },
  extraReducers: {
    [fetchContent.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchContent.fulfilled]: (
      state,
      { meta: { requestId }, payload: { entities, relations } }
    ) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        contentAdapter.setAll(state, {})
      }
    },

    [fetchContent.rejected]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

// * memoized selectors (reselect)
// common selector functions should be defined here rather than in the callers for memoization
const contentSelectors = contentAdapter.getSelectors()

// combine createAsyncThunk's loading/error states with createEntityAdapter's ids/entities join
// 'entities' in this selector are returned as a sorted array rather than keyed
export const selectContent = ({ content }) => {
  const entities = contentSelectors.selectAll(content)
  const { loading, error, relations, selected } = content
  const loaded = entities.length > 0 && loading === 'idle' && !error
  return { entities, relations, selected, loading, error, loaded }
}

// this will return entities keyed, as they naturally appear in redux
// todo: memoize with reselect
export const selectEntities = ({ content: { entities, relations } }) => ({
  entities,
  relations,
})

export const selectEntityById = id => ({ content }) =>
  contentSelectors.selectById(content, id)

export const selectIds = ({ content }) => contentSelectors.selectIds(content)

export const selectSelectedId = ({ content: { selected } }) => selected

export const selectSelectedEntity = ({ content }) => {
  const { selected } = content
  if (!selected) return null

  const selectedE = selectEntityById(selected)({ content })
  if (!selectedE?.data?.geoLocation) return null
  const id = selected

  const {
    data: {
      geoLocation: {
        geometry: { type, coordinates },
      },
    },
  } = selectedE
  return { id, type, coordinates }
}

const { reducer, actions } = contentSlice
export const { clear, add, update, error } = actions

export default reducer

// ! reselect
// Following is a failed attempt to have reselect return an identical selectedEntity *reference* with every call,
// so long as the selectedId has been cached already.
//
// Since selectSelectedEntity returns a partial object rather than the entire entity,
// I was hoping that reselect would return the same reference when other, irrelevant changes were made to the entity.
//
// That didn't happen. Maybe because of the dependency on 'entities'.
//
// Whatever the reason, instead of forcing reselect to return an identical entity reference, I ended up
// using useMemo in SelectedGeo to coerce the selected entity record to remain identical in spite of the deep change.

const selectOnlyEntities = ({ content: { entities } }) => entities

const reselectSelected = createSelector(
  [selectSelectedId],
  selected => selected
)

const reselectOnlyEntities = createSelector([selectOnlyEntities], entities => {
  return entities
})

// ! reselect end
