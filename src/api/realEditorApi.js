import axios from 'axios'

import objectify from '../utility/objectify'
import { keyProxy } from '../utility/proxies'

const convertShayToRaw = (
  { entities, offsets, relations: sRelations, text },
  lists
) => {
  const entityMap = {}
  const blocks = [
    {
      key: 'b1',
      text,
      entityRanges: offsets.map(({ id, length, offset }) => ({
        key: id,
        length,
        offset,
      })),
    },
  ]

  Object.values(entities).forEach(
    ({ id, geolocation, score, sub_type_id, type_id, word }) => {
      const type = lists[type_id]?.value
      const mutability = 'IMMUTABLE'
      const data = {
        id,
        score,
        subTypes: [lists[sub_type_id[0]]?.value],
        word,
        geoLocation: { geometry: geolocation },
      }
      const entity = { type, mutability, data }
      entityMap[id] = entity
    }
  )

  const relations = sRelations.map(
    ({ from_entity_id, list_item_id, to_entity_id }) => ({
      from: from_entity_id,
      to: to_entity_id,
      type: lists[list_item_id]?.value,
    })
  )

  return { blocks, entityMap, relations }
}

const realEditorApi = fileId => {
  const analysis = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_ANALYSIS_ENDPOINT}${fileId}`
  const lists = `${process.env.REACT_APP_API_SERVER}${process.env.REACT_APP_LISTS_ENDPOINT}`

  const getAnalysis = () => axios.get(analysis)
  const getLists = () => axios.get(lists)

  return Promise.all([getAnalysis(), getLists()])
    .then(([analysis, lists]) =>
      convertShayToRaw(analysis.data, keyProxy(objectify(lists.data)))
    )
    .catch(error => {
      console.error(error.message)
    })
}

export default realEditorApi
