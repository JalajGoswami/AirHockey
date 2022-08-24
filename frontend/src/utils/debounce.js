
export default function( callback, delay, lastFnCall ){
    let timeout

    return (...args) => {
        console.log('first')
        if(timeout===undefined){
            callback(...args)
            console.log('stuck')
        }

        clearTimeout(timeout)
        
        timeout = setTimeout(() => {
            console.log('removed')
            !lastFnCall ? callback(...args) : lastFnCall(...args)
        }, delay )
    }
}