// The debounce function receives our function as a parameter
import _debounce from 'lodash/debounce'

export const debounce = (fn, delay = 100) =>
  _debounce(fn, delay, { trailing: true })

export const throttleByFrame = fn => {
  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params) => {
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) {
      cancelAnimationFrame(frame)
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      // Call our function and pass any params we received
      fn(...params)
    })
  }
}
