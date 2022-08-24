import React, { Component } from 'react'
import Puck from '../Shapes/Puck'
import { initialize, start, update } from '../store/features/movingPuck'

export default class MovingPuck extends Component {

  shouldComponentUpdate(){
    return true
  }
    
  componentDidMount(){
    const { context, dispatch, width, height } = this.props
    const puck = new Puck(width/2,height/2,(width*0.1),'skyblue')
    puck.setConstraints(width,height)
    dispatch(initialize(puck))
    puck.setRetard(3)
    puck.draw(context)

    // called in every 40ms to update the state
    setInterval( this.updateState, 40 )

    requestAnimationFrame(this.updateOnCollision)
  }

  updateState = () => {
    const { dispatch, movingPuck } = this.props

    // update the state for newer coord & speed
    if(movingPuck.timestamp === null)
      dispatch(start(movingPuck.puck))
    else
      dispatch(update(movingPuck.puck))
  }

  updateOnCollision = () => {
    const { userStriker, movingPuck } = this.props
    const { xpos : strikerXpos, ypos : strikerYpos,rad : strikerRad } = userStriker.striker
    
    // check if collision occured
    const isCollisionOccured = movingPuck.puck.detectCollision(strikerXpos,strikerYpos,strikerRad)
    if( isCollisionOccured ){
      // console.log(userStriker.strikerSpeedY,userStriker.striker.dy)
      movingPuck.puck.update(userStriker.strikerSpeedX, userStriker.strikerSpeedY)
    }
    requestAnimationFrame(this.updateOnCollision)
  }

  render() {return}
  // this component render nothing just only gives functionaliy to Puck
}
