const epsilon = 2

export const atScrollBottom = ({ offsetHeight, scrollTop, scrollHeight }) =>
  offsetHeight + scrollTop >= scrollHeight - epsilon

export const atScrollTop = ({ scrollTop }) => scrollTop < epsilon
