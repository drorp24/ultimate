const objectify = array =>
  array.reduce(
    (obj, item) => ({
      ...obj,
      [item.id]: item,
    }),
    {}
  )

export default objectify
