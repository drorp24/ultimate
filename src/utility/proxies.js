const undefinedKeyHandler = {
  get(target, property) {
    return target[property]
      ? target[property]
      : target['UNDEFINED']
      ? target['UNDEFINED']
      : undefined
  },
}

export const keyProxy = obj => new Proxy(obj, undefinedKeyHandler)
