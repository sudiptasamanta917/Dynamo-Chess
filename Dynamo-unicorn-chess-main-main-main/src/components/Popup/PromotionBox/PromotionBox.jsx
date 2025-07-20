import arbiter from '../../../arbiter/arbiter';
import { useAppContext }from '../../../contexts/Context'
import { copyPosition, getNewMoveNotation,  } from '../../../helper';
import { detectCheckmate, detectInsufficientMaterial, detectStalemate } from '../../../pages/AnalysisBoard/reducer/actions/game';
import { makeNewMove , clearCandidates } from '../../../pages/AnalysisBoard/reducer/actions/move';
import './PromotionBox.css'

const PromotionBox = ({onClosePopup}) => {

    const { appState , dispatch } = useAppContext();
    const {promotionSquare} = appState;
    // console.log(promotionSquare,"dddddddddddd");

    if (!promotionSquare)
        return null

    const color = promotionSquare.x === 9 ? 'w' : 'b'
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
        player: opponent
    }))
    const isInCheckmate=(arbiter.isCheckMate(newPosition, opponent, castleDirection))
    const newMove = getNewMoveNotation({
        ...promotionSquare,
        position: appState.position[appState.position.length - 1],
        promotesTo:option,
        piece: promotionSquare.x === 9 ? "wp" : "bp",
        isPlayerInCheck:isInCheck,
        isplayerIncheckMate:isInCheckmate,
      });

      dispatch(makeNewMove({newPosition,newMove}))

      if (arbiter.insufficientMaterial(newPosition))
        dispatch(detectInsufficientMaterial())
    else if (arbiter.isStalemate(newPosition, opponent, castleDirection)) {
        dispatch(detectStalemate())
    }
    else if (arbiter.isCheckMate(newPosition, opponent, castleDirection)) {
        dispatch(detectCheckmate(color))
    }
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