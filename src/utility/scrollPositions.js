const atScrollBottom = el =>
  el.offsetHeight + el.scrollTop >= el.scrollHeight - 2

const atScrollTop = el => el.scrollTop < 2

export { atScrollBottom, atScrollTop }
