export default class LightDocException extends Error {
  constructor(type, response) {
    super(type)
    this.type = type
    this.response = response
  }
}

export function wrapException(type, response) {
  return Promise.reject(new LightDocException(type, response))
}
