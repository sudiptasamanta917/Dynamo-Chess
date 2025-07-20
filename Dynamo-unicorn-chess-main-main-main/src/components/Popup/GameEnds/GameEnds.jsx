import { Status } from '../../../constants';
import { useAppContext }from '../../../contexts/Context'
import { setupNewGame } from '../../../pages/AnalysisBoard/reducer/actions/game';
import './GameEnds.css'
import winMp3 from '../../../assets/sound/win.mp3'
import drawMp3 from '../../../assets/sound/draw.mp3'
const winSound=new Audio(winMp3)
const drawSound=new Audio(drawMp3)

const GameEnds = ({onClosePopup}) => {

    const { appState : {status} , dispatch } = useAppContext();
    
    if (status === Status.ongoing || status === Status.promoting)
        return null

    const newGame = () => {
        dispatch(setupNewGame())
    }

    const isWin = status.endsWith('wins')
    if(isWin){
        winSound.play()
    }
    else{
        drawSound.play();
    }

    return <div className="popup--inner popup--inner__center bg-white text-black">
        <h1>{isWin ? status : 'Draw'}</h1>
        <p>{!isWin && status}</p>
        <div className={`${status}`}/>
        <button onClick={newGame} className='text-black'>New Game</button>
    </div>
   
}

export default GameEnds