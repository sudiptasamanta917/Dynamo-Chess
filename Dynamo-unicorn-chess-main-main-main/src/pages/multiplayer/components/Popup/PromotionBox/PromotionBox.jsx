import { UserDetail } from '../../../Utils/getLocalStorageData';
import { useAppContext }from '../../../../../contexts/Context'
import { copyPosition, getNewMoveNotation,  } from '../../../helper';
import { makeNewMove , clearCandidates } from '../../../../../reducer/actions/move';
import socket from '../../../socket';
import './PromotionBox.css'
import arbiter from '../../../arbiter/arbiter';

const PromotionBox = ({onClosePopup,Position}) => {
    const RoomId = localStorage.getItem("RoomId");
    const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
    const userId = UserDetail?._id;
    const { appState , dispatch } = useAppContext();
    const {promotionSquare} = appState;
    const playerId=appState.PlayerId
// console.log(promotionSquare,"ttttttttttttt");
    if (!promotionSquare)
        return null

    const color =userId===playerId ? promotionSquare.x === 9 ? 'b' : 'w':promotionSquare.x === 9 ? 'w' : 'b'
    const options = ['q','r','b','n','m']

    const getPromotionBoxPosition = () => {
        let style = {}

        if (promotionSquare.x === 9) {
            style.top = '-14%'
        }
        else{
            style.top = '103%'
        }

        if (promotionSquare.y <= 1){
            style.left = '25%'
        }
        else if (promotionSquare.y >= 5){
            style.right = '25%'
        }
        else {
            style.left = `${12.5*promotionSquare.y - 20}%`
        }

        return style
    }
  
    const onClick = option => {
        onClosePopup()
        const newPosition = copyPosition (appState.position[appState.position.length - 1])
        // console.log(newPosition,"promotion box position");
        newPosition[promotionSquare.rank][promotionSquare.file] = ''
        newPosition[promotionSquare.x][promotionSquare.y] = color+option
      const opponent = color.startsWith('b') ? 'w' : 'b'
      const castleDirection = appState.castleDirection[`${color.startsWith('b') ? 'white' : 'black'}`]

      const isInCheck = (arbiter.isPlayerInCheck({
        positionAfterMove: newPosition,
        player: opponent,
        playerId
    }))
    const isInCheckmate = (arbiter.isCheckMate(newPosition, opponent, castleDirection,playerId))
    // console.log(promotionSquare,"dddddddddddddddddddssssssssssss");
   
    
    const newMove = getNewMoveNotation({
        ...promotionSquare,
        position: appState.position[appState.position.length - 1],
        promotesTo:option,
        piece: promotionSquare.x === 9 ? "wp" : "bp",
        isPlayerInCheck:isInCheck,
        isplayerIncheckMate:isInCheckmate,
      });

      socket.emit('boardUpdate', { roomId: RoomId, playerId: userId, boardData: { newPosition }, move: newMove });

     
      if (arbiter.insufficientMaterial(newPosition)) {
        socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: true })
        // dispatch(detectInsufficientMaterial());
    } else if (arbiter.isStalemate(newPosition, opponent, castleDirection,playerId)) {
        socket.emit("DrawStatus", { roomId: RoomId, DrawStatus: true })
        // dispatch(detectStalemate());
    } else if (arbiter.isCheckMate(newPosition, opponent, castleDirection,playerId)) {
        socket.emit("CheckMate", { roomId: RoomId, playerId: userId });
        // dispatch(detectCheckmate(piece[0]));
    }
    // console.log(isInCheck,isInCheckmate,"after promotion check");
      dispatch(clearCandidates())

    }

    return <div className="popup--inner promotion-choices f" style={getPromotionBoxPosition()}>
        {options.map (option => 
            <div key={option}
                onClick = {() => onClick(option)} 
                className={`piece ${color}${option}`}
            />
        )}
    </div>

}

export default PromotionBox