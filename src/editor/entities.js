import { add } from '../redux/content'

import { EditorState, Modifier, SelectionState } from 'draft-js'

import decorator from './decorator'
import entityTypes from './entityTypes'
import parseSelection from './selection'

export const createEntityFromSelection = ({ editorState, data, dispatch }) => {
  const { entityType: type } = data
  const { mutability } = entityTypes[type]

  const {
    content,
    selection,
    anchorKey,
    anchorOffset,
    focusOffset,
    selectedText,
  } = parseSelection(editorState)

  const blockKey = anchorKey
  const offset = anchorOffset
  const length = focusOffset - anchorOffset
  const position = {}
  const entityRanges = [
    {
      blockKey,
      offset,
      length,
      position,
      text: selectedText,
    },
  ]

  const contentWithNewEntity = content.createEntity(type, mutability, data)

  const entityKey = contentWithNewEntity.getLastCreatedEntityKey()
  const contentWithUpdatedEntity = contentWithNewEntity.mergeEntityData(
    entityKey,
    { id: entityKey, entityRanges }
  )

  const contentWithAppliedEntity = Modifier.applyEntity(
    contentWithUpdatedEntity,
    selection,
    entityKey
  )

  const newEditorState = EditorState.set(editorState, {
    currentContent: contentWithAppliedEntity,
    decorator,
    selection: SelectionState.createEmpty(anchorKey),
  })

  dispatch(
    add({
      type,
      mutability,
      data: { ...data, id: entityKey },
      entityRanges,
    })
  )

  return newEditorState
}

export const createEntitiesFromContent = content => {
  const entities = {}

  let entity, entityKey

  content.getBlockMap().forEach(block => {
    const blockKey = block.getKey()
    const blockText = block.getText()
    block.findEntityRanges(
      character => {
        entityKey = character.getEntity()

        if (entityKey) {
          entity = content.getEntity(entityKey)
          return true
        }
      },
      (from, to) => {
        if (!entities[entityKey]) {
          const entityToJs = entity.toJS()
          entityToJs.entityKey = entityKey
          entityToJs.entityRanges = []
          entityToJs.data = { ...entityToJs.data, inputs: [], outputs: [] }
          entities[entityKey] = entityToJs
        }

        const index = entities[entityKey].entityRanges.length

        // Offset and length will change if user is allowed to edit.
        // They are kept for reconciliation and export.
        // index on the other hand will remain intact.
        // Every entityRange is uniquely identified by the entity ID + entityRange's index.
        const entityRange = {
          blockKey,
          offset: from,
          length: to - from,
          text: blockText.substring(from, to),
          index,
        }

        entities[entityKey].entityRanges.push(entityRange)

        content.mergeEntityData(entityKey, {
          entityRanges: entities[entityKey].entityRanges,
        })
      }
    )
  })
  return Object.values(entities)
}
