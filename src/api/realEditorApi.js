import axios from 'axios'

import objectify from '../utility/objectify'
import { keyProxy } from '../utility/proxies'

const convertAPI = () => {}

const realEditorApi = fileId => {
  // const analysis = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_ANALYSIS_ENDPOINT}${fileId}`
  // const lists = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_LISTS_ENDPOINT}`
  // const getAnalysis = () => axios.get(analysis)
  // const getLists = () => axios.get(lists)
  // return Promise.all([getAnalysis(), getLists()])
  //   .then(([analysis, lists]) =>
  //     convertAPI(/* analysis.data, keyProxy(objectify(lists.data)) */)
  //   )
  //   .catch(error => {
  //     console.error(error.message)
  //   })
}

export default realEditorApi
