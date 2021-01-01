import { configureStore } from '@reduxjs/toolkit'

import app from './app'
import users from './users'
import content from './content'

const store = configureStore({
  reducer: {
    app,
    users,
    content,
  },
})

export default store
