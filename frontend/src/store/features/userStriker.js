import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    striker: null,
    timestamp: null,
    lastMouseX: null,
    lastMouseY: null,
    xpos: null,
    ypos: null,
    speedX: null,
    speedY: null,
    strikerSpeedX: null,
    strikerSpeedY: null,
    lastStrikerSpeedUpdateTime: null,
    maxSpeed: 0,
    stuckX: 0,
    stuckY: 0
}

const UserStriker = createSlice({
  name: 'userStriker',
  initialState,
  reducers: {
    //called to initialize the Striker
    initialize: ( state, {payload} ) => {
        state.striker = payload
    },

    //called for the first time
    start: ( state, {payload} ) => {
        state.timestamp = Date.now()
        state.lastMouseX = payload.pageX
        state.lastMouseY = payload.pageY
        state.xpos = state.striker.xpos
        state.ypos = state.striker.ypos
    },

    //called after every pointer move event
    update: ( state, {payload} ) => {
        let now = Date.now()
        let dt =  now - state.timestamp
        // converting speed from px/s to dot/s for communication b/w different devices
        let dx = (payload.pageX - state.lastMouseX)*400/state.striker.groundWidth
        let dy = (payload.pageY - state.lastMouseY)*700/state.striker.groundHeight
        let speedFactor = (payload.pointerType == 'touch') ? 1.2 : 1
        let speedX = Math.round(dx / dt * 1000 * speedFactor)
        let speedY = Math.round(dy / dt * 1000 * speedFactor)
        speedX = (Math.abs(speedX) < 10000) ? speedX : 10000 * Math.sign(speedX)
        speedY = (Math.abs(speedY) < 10000) ? speedY : 10000 * Math.sign(speedY)
        state.timestamp = now

        console.log(state.stuckX)
        if(state.stuckX && Math.sign(speedX) == state.stuckX){
          state.striker.dx = 0
          state.speedX = 0
        }
        else{
          state.speedX = speedX
        }
        
        if(state.stuckY && Math.sign(speedY) == state.stuckY){
          state.speedY = 0
          // state.stuckY = 0
          // console.log('stuck')
        }
        else{
          state.speedY = speedY
        }
        
        state.lastMouseX = payload.pageX
        state.lastMouseY = payload.pageY
        
    },

    updateSpeed: ( state, {payload} ) => {
      let dx = payload.dx * 400 / state.striker.groundWidth
      let dy = payload.dy * 700 / state.striker.groundHeight
      state.strikerSpeedX = Math.round(dx * 60)
      state.strikerSpeedY = Math.round(dy * 60)
      state.xpos = payload.xpos * 400 / state.striker.groundWidth
      state.ypos = payload.ypos * 700 / state.striker.groundHeight
    },

    stuck: ( state, {payload} ) => {
      if(payload.Xcollision && Math.sign(state.speedX) == payload.Xcollision){
        if(state.isWaiting) return;

        state.stuckX = payload.Xcollision
        // debouncedStuckUpdate(payload.Xcollision)
        // state.isWaiting = true
        // setTimeout(()=>{state.isWaiting = false},40)
        state.striker.dx = 0
      }
      
      if(payload.Ycollision && payload.Ycollision == Math.sign(state.speedY))
        state.stuckY = payload.Ycollision
      else
        state.stuckY = 0
    },
    setStuckX: (state,{payload})=>{
      console.log('called')
      state.stuckX = typeof(payload)=='number'? payload :0
    },

    //called after pointer stops
    stop: state => {
        state.speedX = 0
        state.speedY = 0
        state.strikerSpeedX = 0
        state.strikerSpeedY = 0
    },
  }
});

export const { initialize, start, update, updateSpeed, stuck,setStuckX, stop } = UserStriker.actions

export default UserStriker.reducer