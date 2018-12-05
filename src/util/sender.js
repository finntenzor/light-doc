'use strict'

import axios from 'axios'
import { wrapException } from './LightDocException'

const config = {
  baseURL: '/'
}

const _axios = axios.create(config)

_axios.interceptors.response.use(
  function(response) {
    // 在这里可以对响应进行判断转为异常，使用warpException指定错误类型
    return response
  },
  function({ response }) {
    // 在这里可以对异常进行判断，具体化异常类型
    // 也可以将异常转为正常响应
    if (response === undefined) {
      return wrapException('NetworkError', response)
    }
    return wrapException('ApiException', response)
  }
)

export default _axios
