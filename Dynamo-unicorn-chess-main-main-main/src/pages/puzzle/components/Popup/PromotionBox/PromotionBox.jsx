import { useAppContext }from '../../../contexts/Context'
import { copyPosition, getNewMoveNotation,  } from '../../../helper';
import { makeNewMove , clearCandidates } from '../../../reducer/actions/move';
import './PromotionBox.css'

const PromotionBox = ({onClosePopup}) => {

    const { appState , dispatch } = useAppContext();
    const {promotionSquare} = appState;

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
        
        newPosition[promotionSquare.rank][promotionSquare.file] = ''
        newPosition[promotionSquare.x][promotionSquare.y] = color+option
        const newMove = getNewMoveNotation({
            ...promotionSquare,
            piece:color+'p',
            x : promotionSquare.rank,
            y : promotionSquare.file,
            position:appState.position[appState.position.length - 1],
            promotesTo :color+option
        })
        dispatch(clearCandidates())

        dispatch(makeNewMove({newPosition,newMove}))

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