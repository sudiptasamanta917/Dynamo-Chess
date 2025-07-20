export const UserDetail=()=>{
    const userDetail=JSON.parse(localStorage.getItem('User Detail'))
    return userDetail
}
export const InitialPosition=()=>{
    const position=JSON.parse(localStorage.getItem('createPosition'))
    return position
}
export const Playerturn=()=>{
    const playerTurn=JSON.parse(localStorage.getItem('nextPlayerTurn'))
    return playerTurn
}
