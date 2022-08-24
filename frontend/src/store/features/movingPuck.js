import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    puck: null,
    xpos: null,
    ypos: null,
    timestamp: null,
    speedX: null,
    speedY: null,
}

const movingPuck = createSlice({
  name: 'movingPuck',
  initialState,
  reducers: {
    //called to initialize the Puck
    initialize: ( state, {payload} ) => {
        state.puck = payload
    },

    //called for the first time
    start: ( state, {payload} ) => {
        state.timestamp = Date.now()
        state.xpos = payload.xpos
        state.ypos = payload.ypos
    },

    //called continuously to update the coord & speed
    update: ( state, {payload} ) => {
        let now = Date.now()
        let dt = now - state.timestamp
        // converting speed from px/s to dot/s for communication b/w different devices
        let dx = (payload.xpos - state.xpos)*400/state.puck.groundWidth
        let dy = (payload.ypos - state.ypos)*700/state.puck.groundHeight
        let speedX = Math.round( dx / dt * 1000 )
        let speedY = Math.round( dy / dt * 1000 )
        state.timestamp = now
        state.xpos = payload.xpos
        state.ypos = payload.ypos
        state.speedX = speedX
        state.speedY = speedY
    }
  }
});

export const { initialize, start, update } = movingPuck.actions

export default movingPuck.reducer