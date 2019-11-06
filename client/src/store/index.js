import Vue from 'vue'
import Vuex from 'vuex'
import socketio from 'socket.io-client'

const io = socketio({
  path: '/api/socket.io/'
})
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    strips: [ ],
    mode: { },
    existingModes: [ ]
  },
  mutations: {
    setStrips (state, n) {
      state.strips = n
    },
    updateStripData (state, n) {
      for (let i = 0; i < n.length; i++) {
        const strip = n[i]
        if (strip != null) {
          for (let f = 0; f < strip.length; f++) {
            state.strips[i].data[f] = strip[f]
          }
        }
      }
    },
    setMode (state, n) {
      state.mode = n
    },
    setExistingModes (state, n) {
      state.existingModes = n
    }
  },
  getters: {
    modeId (state) {
      return state.mode.id
    },
    modeNamesAndIds (state) {
      return state.existingModes.reduce((prev, cur, index) => {
        prev.push({
          text: cur.name,
          value: cur.id
        })
        return prev
      }, [])
    }
  },
  actions: {
    setMode ({ commit }, n) {
      console.log('SETMODE', n)
      io.emit('setMode', n)
    }
  },
  modules: {
  }
})

io.on('connect', () => {
  console.log('Connected!')
  // io.emit('setMode', 'TEST')
  // io.emit('fillAllStrips', [ 1, 1, 1 ])
  // io.emit('fillPixels', [
  //   { strip: 1, address: 25, red: 0, green: 255, blue: 255 },
  //   { strip: 1, address: 26, red: 255, green: 0, blue: 255 },
  //   { strip: 1, address: 27, red: 255, green: 255, blue: 0 },
  //   { strip: 1, address: 28, red: 0, green: 255, blue: 255 },
  //   { strip: 1, address: 29, red: 255, green: 0, blue: 255 },
  //   { strip: 1, address: 30, red: 255, green: 255, blue: 0 },
  //   { strip: 1, address: 31, red: 0, green: 255, blue: 255 },
  //   { strip: 1, address: 32, red: 255, green: 0, blue: 255 },
  //   { strip: 1, address: 33, red: 255, green: 255, blue: 0 }
  // ])
})

io.on('strips', (strips) => {
  store.commit('setStrips', strips)
})

io.on('mode', (mode) => {
  store.commit('setMode', mode)
})

io.on('existingModes', (modes) => {
  store.commit('setExistingModes', modes)
})

io.on('stripData', (strips) => {
  store.commit('updateStripData', strips)
})

export default store