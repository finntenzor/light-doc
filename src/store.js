import Vue from 'vue'
import Vuex from 'vuex'
import sender from '@/util/sender'
import { simpleMethods, complexMethods } from '@/consts'

Vue.use(Vuex)

function canMethodHasData(method) {
  return complexMethods.indexOf(method) !== -1
}

const store = new Vuex.Store({
  state: {
    request: {
      url: '',
      method: '',
      body: ''
    },
    results: []
  },
  getters: {
    results: state => state.results,
    requestUrl: state => state.request.url,
    requestMethod: state => state.request.method,
    requestBody: state => state.request.body,
    requestData(_, getters) {
      try {
        return JSON.parse(getters.requestBody)
      } catch (e) {
        return null
      }
    },
    requestDataValid: (_, getters) => getters.requestData !== null,
    requestBodyValid: (_, getters) => getters.requestBody === '' || getters.requestDataValid,
    requestCanHasData: (_, getters) => canMethodHasData(getters.requestMethod),
    request(_, getters) {
      if (!getters.requestCanHasData || !getters.requestDataValid) {
        return {
          url: getters.requestUrl,
          method: getters.requestMethod
        }
      } else {
        return {
          url: getters.requestUrl,
          method: getters.requestMethod,
          data: getters.requestData
        }
      }
    }
  },
  mutations: {
    setRequestUrl(state, payload) {
      state.request.url = payload
    },
    setRequestMethod(state, payload) {
      state.request.method = payload
    },
    setRequestBody(state, payload) {
      state.request.body = payload
    },
    /**
     * 添加成功请求结果
     */
    addSuccessResult(state, response) {
      state.results.unshift({
        id: state.results.length,
        type: 'Success',
        response
      })
    },

    /**
     * 添加失败请求结果
     */
    addErrorResult(state, error) {
      state.results.unshift({
        id: state.results.length,
        type: error.type,
        response: error.response
      })
    }
  },
  actions: {
    /**
     * 发送请求
     */
    async send({ commit }, config) {
      try {
        const response = await sender(config)
        commit('addSuccessResult', response)
        return response
      } catch (error) {
        commit('addErrorResult', error)
        throw error
      }
    }
  }
})

function buildSendWrapper(store) {
  const send = config => store.dispatch('send', config)
  simpleMethods.forEach(method => {
    send[method] = function(url, config = {}) {
      return send({
        ...config,
        method,
        url
      })
    }
  })
  complexMethods.forEach(method => {
    send[method] = function(url, data, config = {}) {
      return send({
        ...config,
        method,
        url,
        data
      })
    }
  })
  return send
}

export const sendWrapper = buildSendWrapper(store)

export default store
