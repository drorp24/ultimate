const timeout = 100

const rawContent = {}

export const getContent = () =>
  new Promise((resolve, reject) => {
    if (!rawContent) {
      return setTimeout(() => reject(new Error('Content unavailable')), timeout)
    }

    setTimeout(() => resolve(rawContent), timeout)
  })
