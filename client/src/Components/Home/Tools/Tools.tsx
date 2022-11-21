//PARA OBTENER LAS FECHAS EXACTAS
export const fechasMensajes = (e: string) => {
    const date = new Date(e)
    const newFecha = new Date()
    const diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const dia = date.toString().split(' ')[0]
    let diaNecesitado = ''
    const fechaMensaje = date.toString().split(' ')[2]
    const fechaActual = newFecha.toString().split(' ')[2]
    if(parseInt(date.getMonth().toString()) < parseInt(newFecha.getMonth().toString())){
        const nuevaFechaActual = parseInt(fechaActual) + 30 
        if(nuevaFechaActual - parseInt(fechaMensaje) > 6){
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }
    }else if(parseInt(fechaActual) - parseInt(fechaMensaje) > 6){
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }else if(fechaMensaje === fechaActual){
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if(minutes < 10) return (hours + ':0' + minutes)
        return (hours + ':' + minutes)
    }else if(parseInt(fechaActual) - parseInt(fechaMensaje) === 1 ){
        diaNecesitado = 'Yesterday'
    }
    else {
        if(dia === 'Mon')  diaNecesitado = diasSemana[0]
        if(dia === 'Tue')  diaNecesitado = diasSemana[1]
        if(dia === 'Wed')  diaNecesitado = diasSemana[2]
        if(dia === 'Thu')  diaNecesitado = diasSemana[3]
        if(dia === 'Fri')  diaNecesitado = diasSemana[4]
        if(dia === 'Sat')  diaNecesitado = diasSemana[5]
        if(dia === 'Sun')  diaNecesitado = diasSemana[6]
    }
    return diaNecesitado
}

//FECHA ACTUAL DE CHATS
export const fechaActual = (e: string) => {
    const date = new Date(e)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

export const date = new Date()