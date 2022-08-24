
export default function throttle(callback, delay, lastfncall) {

    let shouldWait = false
    let timeout

    return (...args)=>{
        if(shouldWait)  return
          
        callback(...args)

        // only if there is last function call in arguments
        if(lastfncall){
            clearTimeout(timeout)
            timeout = setTimeout(()=>{
                lastfncall()
                // to do some task after the last call to the throttled function
            },(delay*1.5))
        }

        shouldWait = true
        setTimeout(()=>{shouldWait = false},delay)
    }
}