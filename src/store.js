import Vue from 'vue'
import Vuex from 'vuex'
import sender from '@/util/sender'
import { simpleMethods, complexMethods, typeConfig } from '@/consts'
import { generateTypeTextMap, generateTypeClassNameMap } from '@/util/types'

Vue.use(Vuex)

function canMethodHasData(method) {
  return complexMethods.indexOf(method) !== -1
}

const store = new Vuex.Store({
  state: {
    request: {
      title: '(unknown)',
      url: '',
      method: '',
      body: ''
    },
    results: [],
    activeNames: [],
    toTextMap: generateTypeTextMap(typeConfig),
    toClassNameMap: generateTypeClassNameMap(typeConfig)
  },
  getters: {
    results: state => state.results,
    requestTitle: state => state.request.title,
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
    },
    activeNames: state => state.activeNames,
    typeToText: state => name => state.toTextMap[name] || '未知结果',
    typeToClassName: state => name => state.toClassNameMap[name] || 'unknown'
  },
  mutations: {
    setRequestTitle(state, payload) {
      state.request.title = payload
    },
    setRequestUrl(state, payload) {
      state.request.url = payload
      this.commit('clearRequestTitle')
    },
    setRequestMethod(state, payload) {
      state.request.method = payload
      this.commit('clearRequestTitle')
    },
    setRequestBody(state, payload) {
      state.request.body = payload
    },
    clearRequestTitle(state) {
      this.commit('setRequestTitle', '(unknown)')
    },

    /**
     * 添加请求结果
     */
    addResult(state, { type, response, title }) {
      const first = state.results[0]
      if (first) {
        const index = state.activeNames.indexOf(first.id)
        state.activeNames.splice(index, 1)
      }
      state.results.unshift({
        id: state.results.length,
        title,
        type,
        response
      })
    },

    setActiveNames(state, activeNames) {
      state.activeNames = activeNames
    }
  },
  actions: {
    /**
     * 发送请求
     */
    async send({ commit, getters }, config) {
      try {
        const response = await sender(config)
        commit('addResult', {
          type: 'Success',
          title: getters.requestTitle,
          response
        })
        return response
      } catch (error) {
        commit('addResult', {
          type: error.type,
          title: getters.requestTitle,
          response: error.response
        })
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
