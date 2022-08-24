import React, { Component } from 'react'
import {initialize, start, update, updateSpeed, stop, stuck} from '../store/features/userStriker'
import Striker from '../Shapes/Striker'
import throttle from '../utils/throttle'

export default class UserStriker extends Component {

  shouldComponentUpdate(nextProps,nextState){
    return true
  }
  
  componentDidUpdate(prevProps,prevState){
    const { striker, speedX, speedY } = this.props.userStriker
    if(prevProps.userStriker.striker){
      if((prevProps.userStriker.speedX !== speedX) || (prevProps.userStriker.speedY !== speedY)){
        striker.update( speedX, speedY ) // update speed every time state changes
      }
    }
  }
  
  componentDidMount(){
    const { context,width,height,dispatch } = this.props
    const striker = new Striker(width/2,height*0.9,(width*0.12),'tomato')
    striker.setConstraints(width,height)
    dispatch(initialize(striker))
    striker.draw(context);
    
    this.speedUpdaterTimer = setInterval(this.updateSpeed,20)
    
    // listener to change speed according to mouse speed
    window.addEventListener('pointermove',e=>{
      this.throttledUpdate(e)
    })

    requestAnimationFrame(this.checkForStuck)
  }
  componentWillUnmount(){
    clearInterval(this.speedUpdaterTimer)
  }

  checkForStuck = () => {
    const { dispatch,userStriker } = this.props
    const { puck } = this.props.movingPuck
    const { xpos : strikerXpos, ypos : strikerYpos } = userStriker.striker
    const { rad : strikerRad } = userStriker.striker
    
    this.checkForOverlap() // handles motion of striker in case of overlaping

    if(puck.detectCollision(strikerXpos,strikerYpos,strikerRad,true)){
      dispatch(stuck(puck))
      puck.stuck()
    }
    requestAnimationFrame(this.checkForStuck)
  }

  updateSpeed = () => {
    const { xpos, ypos, dx, dy } = this.props.userStriker.striker
    const { dispatch } = this.props
    dispatch(updateSpeed({ xpos, ypos, dx, dy }))
  }
  checkForOverlap = () => {
    const { userStriker, movingPuck } = this.props
    const { xpos , ypos  } = movingPuck
    const { rad } = movingPuck.puck
    userStriker.striker.handleOverlap(xpos,ypos,rad)
  }
  throttledUpdate = throttle((e)=>{
    const { timestamp } = this.props.userStriker
    const { dispatch } = this.props
    if (timestamp === null) {
      dispatch(start(e))
      return;
    }

    dispatch(update(e))
    //update the speed and last mouse position
  }, 40 , () => {
    this.props.dispatch(stop())
    // make the speed to zero
  })

  render() {return}
  // this component render nothing just only gives functionaliy to Striker
}