'use strict'

import axios from 'axios'
import { wrapException } from './LightDocException'

const config = {
  baseURL: './'
}

const _axios = axios.create(config)

_axios.interceptors.response.use(
  function(response) {
    const data = response.data
    if (data !== undefined && data.ret !== undefined) {
      if (data.ret >= 200 && data.ret < 400) {
        // 正确响应
        return data.data
      } else {
        // 一般错误
        const msg = data.msg || '未知异常'
        return wrapException(msg, response)
      }
    } else {
      // 格式不正确，说明不是LightDoc后端
      return wrapException('不是有效的LightDoc后端', response)
    }
  },
  function({ response }) {
    if (response === undefined) {
      return wrapException('网络异常', response)
    }
    const data = response.data
    if (data !== undefined && data.ret !== undefined) {
      // 一般错误
      const msg = data.msg || '未知异常'
      return wrapException(msg, response)
    } else {
      // 格式不正确，说明不是LightDoc后端
      return wrapException('不是有效的LightDoc后端', response)
    }
  }
)

export default _axios
