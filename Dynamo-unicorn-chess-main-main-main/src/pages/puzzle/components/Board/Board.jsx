import './Board.css'
import { useAppContext } from '../../contexts/Context'

import Ranks from './bits/Ranks'
import Files from './bits/Files'
import Pieces from '../Pieces/Pieces'
import PromotionBox from '../Popup/PromotionBox/PromotionBox'
import Popup from '../Popup/Popup'
import GameEnds from '../Popup/GameEnds/GameEnds'

import arbiter from '../../arbiter/arbiter'
import { getKingPosition } from '../../arbiter/getMoves'

import topbordergreen from '../../assets/topGreen.png'
import bottombordergreen from '../../assets/bottomgreen.png'
import topborderyellow from '../../assets/topyellow.png'
import bottomborderyellow from '../../assets/bottomyellow.png'

const Board = () => {
    const ranks = Array(10).fill().map((x, i) => 10 - i)
    const files = Array(10).fill().map((x, i) => i + 1)

    const { appState } = useAppContext();
    const position = appState.position[appState.position.length - 1]

    const checkTile = (() => {
        const isInCheck = (arbiter.isPlayerInCheck({
            positionAfterMove: position,
            player: appState.turn
        }))

        if (isInCheck)
            return getKingPosition(position, appState.turn)

        return null
    })()

    const getClassName = (i, j) => {
        let c = 'tile'
        c += (i + j) % 2 === 0 ? ' tile--dark ' : ' tile--light '
        if (appState.candidateMoves?.find(m => m[0] === i && m[1] === j)) {
            if (position[i][j]) {
                // console.log("attacking add");
                c += ' attacking'
            }
            else {
                // console.log('highlight added')
                c += ' highlight'
            }
        }

        if (checkTile && checkTile[0] === i && checkTile[1] === j) {
            c += ' checked'
        }

        return c
    }
    // Function to handle tile click

    return (


        <div className="border-[35px] relative border-[#57b3be]">
            <Ranks ranks={ranks} />
            <div className="border-4 border-black">
                <div className="border-[28px] border-[#f9f0cd] relative ">
                    <img src={topbordergreen} alt="" className="absolute h-6 w-6 z-40 left-[-28px] top-[-28px]" />
                    <img src={topborderyellow} alt="" className="absolute h-6 w-6 z-40 right-[-28px] top-[-28px]" />
                    <img src={bottombordergreen} alt="" className="absolute h-6 w-6 z-40 right-[-28px] bottom-[-28px]" />
                    <img src={bottomborderyellow} alt="" className="absolute h-6 w-6 z-40 left-[-28px] bottom-[-28px]" />
                    <div className='Board'>


                        <div className='tiles ' >
                            {ranks.map((rank, i) =>
                                files.map((file, j) =>
                                    <div
                                        key={file + '' + rank}
                                        i={i}
                                        j={j}
                                        className={`${getClassName(9 - i, j)} `}

                                    >

                                    </div>
                                )
                            )}
                        </div>




                        <Pieces />

                        <Popup>
                            <PromotionBox />
                            <GameEnds />
                        </Popup>

                       

                    </div>

                </div>

            </div>
             <Files files={files}/>
        
        </div>

    )

}

export default Board