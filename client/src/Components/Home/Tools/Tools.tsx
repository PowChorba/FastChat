import { Chats, Messages } from "../../../types"

//PARA OBTENER LAS FECHAS EXACTAS
export const fechasMensajes = (e: string) => {
    const date = new Date(e)
    const newFecha = new Date()
    const diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const dia = date.toString().split(' ')[0]
    let diaNecesitado = ''
    const fechaMensaje = date.toString().split(' ')[2]
    const fechaActual = newFecha.toString().split(' ')[2]
    if (parseInt(date.getMonth().toString()) < parseInt(newFecha.getMonth().toString())) {
        const nuevaFechaActual = parseInt(fechaActual) + 30
        if (nuevaFechaActual - parseInt(fechaMensaje) > 6) {
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }
    } else if (parseInt(fechaActual) - parseInt(fechaMensaje) > 6) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    } else if (fechaMensaje === fechaActual) {
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if (minutes < 10) return (hours + ':0' + minutes)
        return (hours + ':' + minutes)
    } else if (parseInt(fechaActual) - parseInt(fechaMensaje) === 1) {
        diaNecesitado = 'Yesterday'
    }
    else {
        if (dia === 'Mon') diaNecesitado = diasSemana[0]
        if (dia === 'Tue') diaNecesitado = diasSemana[1]
        if (dia === 'Wed') diaNecesitado = diasSemana[2]
        if (dia === 'Thu') diaNecesitado = diasSemana[3]
        if (dia === 'Fri') diaNecesitado = diasSemana[4]
        if (dia === 'Sat') diaNecesitado = diasSemana[5]
        if (dia === 'Sun') diaNecesitado = diasSemana[6]
    }
    return diaNecesitado
}

//FECHA ACTUAL DE CHATS
export const fechaActual = (e: string) => {
    const date = new Date(e)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

export const date = new Date()

//FECHA PARA PRIVATE CHATS
export const newDate = (e: string) => {
    const date = new Date(e)
    const hours = date.getHours()
    let minutes = date.getMinutes()
    if (minutes < 10) return (hours + ':0' + minutes)
    return (hours + ':' + minutes)
}
// FECHA PARA ULTIMA VEZ CONECTADO 
export const lastConnectionDate = (e: string) => {
    const date = new Date(e)
    let hours = (date.getHours())
    let minutes = (date.getMinutes())
    let month = date.getMonth()
    let day = date.getDate()
    const today = new Date()
    let dd:any = String(today.getDate()).padStart(2, '0');
    let mm: any = String(today.getMonth()).padStart(2, '0');
    let hr: any = String(today.getHours()).padStart(2, '0');
    let mn: any = String(today.getMinutes()).padStart(2, '0');
    month = mm - month
    day = dd - day
    hours = hr - hours
    minutes = mn - minutes
    
    console.log(month)
    console.log(day)
    console.log(hours)
    console.log(minutes)

    if (month == 1) return (`Last connection was ${month} month ago`)
    else if (month > 0) return (`Last connection was ${month} months ago`)
    if (day == 1) return (`Last connection was ${day} day ago`)
    else if (day > 0) return (`Last connection was ${day} days ago`)
    else if (hours == 0 && minutes < 2) return ("Last connection was 1 minute ago")
    else if (hours == 0) return (`Last connection was ${minutes} minutes ago`)
    else if (hours == 1)return (`Last connection was 1 hour ago `)
    else if (hours > 1)return (`Last connection was ${hours} hours ago `)
}


// PARA EL SORT DE LOS CHATS
export const sortChats = (mensajes: Messages[], chats: Chats[]) => {
    let arrayUno = []
    for (let i = 0; i < chats.length; i++) {
        if (mensajes[0]?.chatId === chats[i]?._id) {
            arrayUno.push(chats[i])
        }
    }
    return arrayUno
}

export const sortMessagees = (messages: Messages[]) => {
    const array = messages?.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1
        if (a.createdAt < b.createdAt) return 1
        return 0
    })
    return array
}

//SORT PARA FILTRAR LOS MENSAJES EN CHATS

export const sortMessagesChat = (messages: Messages[]) => {
    const sort = messages.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -1
        if (a.createdAt > b.createdAt) return 1
        else return 0
    })
    return sort
}
