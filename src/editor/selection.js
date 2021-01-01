const parseSelection = editorState => {
  const selection = editorState.getSelection()
  const { anchorKey, anchorOffset, focusKey, focusOffset } = selection

  const content = editorState.getCurrentContent()
  const block = content.getBlockForKey(anchorKey)
  const selectedText = block.getText().slice(anchorOffset, focusOffset)
  return {
    content,
    selection,
    selectedText,
    anchorKey,
    anchorOffset,
    focusKey,
    focusOffset,
    selectionExists: anchorOffset !== focusOffset,
    selectionSpansBlocks: anchorKey !== focusKey,
  }
}

export default parseSelection
