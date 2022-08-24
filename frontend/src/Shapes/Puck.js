export default class Puck {
    constructor(x,y,r,color){
        this.xpos = x
        this.ypos = y
        this.rad = r
        this.color = color
        this.dx = 0
        this.dy = 0
        this.retard = 0
        this.waiting = false
        this.dotLength = null
    }

    setConstraints(width,height){
        this.groundWidth = width
        this.groundHeight = height
        this.dotLength = width/400
    }

    draw(context){
        context.beginPath()
        context.arc(this.xpos,this.ypos,this.rad,0,Math.PI*2,false)
        context.fillStyle = this.color
        context.strokeStyle = this.color
        context.stroke()
        context.fill()
        context.closePath()
    }

    setRetard(retardFactor){
        this.retard = (this.groundHeight / (700*60)) * retardFactor
    }

    move(context){
        this.xpos += this.dx
        this.ypos += this.dy

        if( Math.abs(this.dx) > Math.abs(this.retard) )
            this.dx -= (Math.sign(this.dx) * this.retard)
        else
            this.dx = 0
        if( Math.abs(this.dy) > Math.abs(this.retard) )
            this.dy -= (Math.sign(this.dy) * this.retard)
        else
            this.dy = 0
        
        this.Xcollision = 0
        this.Ycollision = 0
        // bounce mechanism of puck against wall with some momentum loss
        if((this.xpos + this.rad + this.dotLength) >= this.groundWidth){
            this.dx = Math.abs(this.dx) * (-0.8)
            this.Xcollision = 1
        }
        if((this.ypos + this.rad + this.dotLength) >= this.groundHeight){
            this.dy = Math.abs(this.dy) * (-0.8)
            this.Ycollision = 1
        }
        if((this.xpos - this.rad) < this.dotLength){
            this.dx = Math.abs(this.dx) * 0.8
            this.Xcollision = -1
        }
        if((this.ypos - this.rad) < this.dotLength){
            this.dy = Math.abs(this.dy) * 0.8
            this.Ycollision = -1
        }

        this.draw(context)
    }

    detectCollision(strikerXpos,strikerYpos,strikerRad,withoutWait = false){
        if(this.waiting && !withoutWait)
            return false

        let x = (strikerXpos - this.xpos) * (strikerXpos - this.xpos)
        let y = (strikerYpos - this.ypos) * (strikerYpos - this.ypos)
        let distance = Math.sqrt(x + y)

        if(distance > (this.rad + strikerRad + this.dotLength))
            return false
        else{
            if(withoutWait)
                return true
            else {
                this.waiting = true
                setTimeout(()=>{this.waiting = false},40)
                return true
            }
        }
    }

    stuck(){
        // if(this.Xcollision && this.Ycollision)
        //     this.dx = this.dy = 0
    }

    update(speedX,speedY){
        // comes from userStriker in dot/s so convert in px/s
        let incidentSpeedX = (speedX * this.groundWidth ) / (400 * 60)
        let incidentSpeedY = (speedY * this.groundHeight ) / (700 * 60)

        // resultant speed of puck after collision with striker with some momentum loss
        this.dx = (Math.sign(incidentSpeedX)==Math.sign(this.dx)) ? (this.dx + incidentSpeedX)
            : (incidentSpeedX - this.dx)
        this.dy = (Math.sign(incidentSpeedY)==Math.sign(this.dy)) ? (this.dy + incidentSpeedY)
            : (incidentSpeedY - this.dy)
    }
}