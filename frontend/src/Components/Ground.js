import React, { Component } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {setDim} from '../store/features/groundDetail';
import '../App.css';
import UserStriker from './UserStriker';
import MovingPuck from './MovingPuck';

class Ground extends Component {
    constructor(props) {
      super(props)
        
      this.canvasRef = React.createRef()
      this.canvasContainerRef = React.createRef()
      this.state = {
        context: null
      }
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
        const { dispatch,userStriker } = this.props
        const canvas = this.canvasRef.current
        const canvasContainer = this.canvasContainerRef.current
        canvas.style.background = 'palegreen'
        let width = canvas.width = canvasContainer.getBoundingClientRect().width
        let height = canvas.height  = canvasContainer.getBoundingClientRect().height
        dispatch(setDim({width,height}));
        const context = canvas.getContext("2d")
        this.setState({ context })

        this.waitForAnimation(context)
        //wait until Striker is mounted on DOM
    }
    componentWillUnmount(){
      clearTimeout(this.animationTimer)
    }

    waitForAnimation(context){
      if(this.props.userStriker.striker && this.props.movingPuck.puck)
        this.startAnimation(context)
      else
        this.animationTimer = setTimeout(()=>this.waitForAnimation(context),500)
    }

    startAnimation(context){
      console.log('wait over')
      const striker = this.props.userStriker.striker
      const puck = this.props.movingPuck.puck
      const { width, height } = this.props.ground

      const mover = function(){
        context.clearRect(0, 0, width, height)
        striker.move(context)
        puck.move(context)
        requestAnimationFrame(mover)
      }
      // continuously move/update the Striker position
      requestAnimationFrame(mover)
    }

  render() {
    const { speedX, speedY, maxSpeed } = this.props.userStriker
    const { dispatch,userStriker,movingPuck,ground } = this.props
    const { context } = this.state
    return (
      <>
        <div className='container'>
          <div style={{display:'flex',flexDirection:'column'}}>
            <div>{`${speedX}`}</div>
            <div>{`${speedY}`}</div>
          </div>

          <div className='canvasContainer' ref={this.canvasContainerRef} >
              <canvas ref={this.canvasRef}></canvas>
              {context && 
                <>
                  <UserStriker context={this.state.context} dispatch={dispatch}
                    userStriker={userStriker} movingPuck={movingPuck}
                    width={ground.width} height={ground.height} />
                  
                  <MovingPuck context={this.state.context} dispatch={dispatch}
                    movingPuck={movingPuck} userStriker={userStriker}
                    width={ground.width} height={ground.height} />
                </>
              }
          </div>
        </div>
      </>
    )
  }
}

export default function GroundFunc(){
  return <Ground userStriker = {useSelector(state=>state.userStriker)}
            movingPuck = {useSelector(state=>state.movingPuck)}
            dispatch = {useDispatch()} ground={useSelector(state=>state.ground)} />
}
