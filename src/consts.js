/**
 * 不能包含请求体的请求方法
 */
export const simpleMethods = ['delete', 'get', 'head', 'options']

/**
 * 可以包含请求体的请求方法
 */
export const complexMethods = ['post', 'put', 'patch']

/**
 * 所有支持的请求方法
 */
export const allMethods = [...simpleMethods, ...complexMethods]
