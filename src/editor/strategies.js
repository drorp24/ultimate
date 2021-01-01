const applyCallbackByRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

// ToDo: remove
// Appending '#' or '@' in the text does not create entities.
// I'm leaving these 2 in since it might be helpful to identify texts with hashtags and mentions, but I suppose they're tracked.
const MENTION_REGEX = /@[\w]+/g
const HASHTAG_REGEX = /#[\w\u0590-\u05ff]+/g

export const mentionStrategy = (contentBlock, callback, contentState) => {
  applyCallbackByRegex(MENTION_REGEX, contentBlock, callback)
}

export const hashtagStrategy = (contentBlock, callback, contentState) => {
  applyCallbackByRegex(HASHTAG_REGEX, contentBlock, callback)
}

export const entityStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => !!character.getEntity(), callback)
}
