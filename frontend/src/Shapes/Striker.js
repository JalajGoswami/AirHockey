export default class Striker {
    constructor(x,y,r,color){
        this.xpos = x
        this.ypos = y
        this.rad = r
        this.color = color
        this.dx = 0
        this.dy = 0
        this.overlapped = false
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

    move(context){
        this.xpos += this.dx
        this.ypos += this.dy

        if((this.xpos + this.rad) >= this.groundWidth)
            this.xpos = this.groundWidth - this.rad
        if((this.ypos + this.rad) >= this.groundHeight)
            this.ypos = this.groundHeight - this.rad
        if((this.xpos - this.rad) <= 0)
            this.xpos = this.rad
        if((this.ypos - this.rad) <= 0)
            this.ypos = this.rad
            
        // context.clearRect(0,0,this.groundWidth,this.groundHeight)
        this.draw(context)
    }

    update(speedX,speedY){
        if(this.overlapped) return
        // if striker overlapped with puck don't move according to mouse
        
        // convert speed from dot/s to px/s
        this.dx = speedX * this.groundWidth / (400 * 60)
        this.dy = speedY * this.groundHeight / (700 * 60)
    }

    handleOverlap(puckXpos,puckYpos,puckRad){
        let x = (puckXpos - this.xpos) * (puckXpos - this.xpos)
        let y = (puckYpos - this.ypos) * (puckYpos - this.ypos)
        let distance = Math.sqrt(x + y)

        if(distance < (this.rad + puckRad - this.dotLength*40)){
            this.overlapped = true
            this.dx = (this.xpos - puckXpos)/distance
            this.dy = (this.ypos - puckYpos)/distance
        }
        else {
            this.overlapped = false
        }
    }
}