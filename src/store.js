import Vue from 'vue'
import Vuex from 'vuex'
import sender from '@/util/sender'
import request from '@/util/request'
import { simpleMethods, complexMethods, typeConfig } from '@/consts'
import { generateTypeTextMap, generateTypeClassNameMap } from '@/util/types'

Vue.use(Vuex)

function canMethodHasData(method) {
  return complexMethods.indexOf(method) !== -1
}

const store = new Vuex.Store({
  state: {
    loading: true,
    documents: [],
    currentDocument: null,
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
    loading: state => state.loading,
    documents: state => state.documents,
    currentDocument: state => state.currentDocument,
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
    setLoading(state, payload) {
      state.loading = payload
    },
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
      const id = state.results.length
      state.results.unshift({
        id,
        title,
        type,
        response
      })
      state.activeNames.push(id)
    },

    setActiveNames(state, activeNames) {
      state.activeNames = activeNames
    },

    /**
     * 切换到目标版本的文档
     */
    switchDocument(state, version) {
      // 已经在目标版本则什么都不做
      if (state.currentDocument && state.currentDocument.version === version) {
        return
      }
      const targetDocument = state.documents.find(doc => doc.version === version)
      if (targetDocument) {
        state.currentDocument = targetDocument
      } else {
        throw new Error('未找到文档')
        console.warn('Document not found: ', version) // eslint-disable-line
      }
    },

    setDocuments(state, payload) {
      state.documents = payload
      state.currentDocument = payload[0] || null
    }
  },
  actions: {
    async getDocuments({ commit }) {
      try {
        const versions = await request.get('./docs')
        const promises = versions.map(version => request.get('./docs/' + version))
        const documents = await Promise.all(promises)
        commit('setDocuments', documents)
        commit('setLoading', false)
      } catch (err) {
        commit('setLoading', err)
      }
    },
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
