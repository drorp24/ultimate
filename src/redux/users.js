import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUser } from '../api/fakeUsersApi'

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async ({ username, password }, thunkAPI) => {
    try {
      const data = await getUser({ username, password })
      if (!data) throw new Error('No data returned')
      if (data.error) throw new Error(data.error?.message?.toString())
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.toString())
    }
  }
)

const initialState = {
  currentRequestId: undefined,
  loading: 'idle',
  error: null,
  loggedIn: {},
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: {
    [fetchUser.pending]: (state, { meta: { requestId } }) => {
      if (state.loading === 'idle') {
        state.currentRequestId = requestId
        state.loading = 'pending'
        state.error = null
      }
    },

    [fetchUser.fulfilled]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = null
        state.loggedIn = payload
      }
    },

    [fetchUser.rejected]: (state, { meta: { requestId }, payload }) => {
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.currentRequestId = undefined
        state.loading = 'idle'
        state.error = payload
      }
    },
  },
})

const { reducer, actions } = usersSlice
export const { logout } = actions

export default reducer
