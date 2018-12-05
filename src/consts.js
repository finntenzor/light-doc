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

/**
 * 结果显示的所有类型
 */
export const typeConfig = [
  {
    name: 'Success', // 类型识别表示名
    text: '成功', // 该类型对应的文本
    className: 'success' // 该类型对应添加的类名
  },
  {
    name: 'NetworkError',
    text: '网络异常',
    className: 'network-error'
  },
  {
    name: 'ApiException',
    text: 'API错误',
    className: 'api-exception'
  }
]
