const isOverflown = ({
  clientWidth,
  clientHeight,
  scrollWidth,
  scrollHeight,
}) => scrollHeight > clientHeight || scrollWidth > clientWidth

window.isOverflown = isOverflown
export default isOverflown
