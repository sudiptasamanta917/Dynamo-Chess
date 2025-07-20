import { areSameColorTiles, findPieceCoords } from '../helper';
import { getKnightMoves, getRookMoves, getBishopMoves, getQueenMoves, getKingMoves, getPawnMoves, getPawnCaptures, getCastlingMoves, getPieces, getKingPosition, getMissileMoves } from './getMoves'
import { movePiece, movePawn } from './move';

const arbiter = {

    getRegularMoves: function ({ position, piece, rank, file, playerId }) {
        // console.log(playerId,"pppppppppppp");
        if (piece.endsWith('n'))
            return getKnightMoves({ position, rank, file });
        if (piece.endsWith('b'))
            return getBishopMoves({ position, piece, rank, file });
        if (piece.endsWith('r'))
            return getRookMoves({ position, piece, rank, file });
        if (piece.endsWith('q'))
            return getQueenMoves({ position, piece, rank, file });
        if (piece.endsWith('k'))
            return getKingMoves({ position, piece, rank, file, playerId });
        if (piece.endsWith('p'))
            return getPawnMoves({ position, piece, rank, file, playerId })
        if (piece.endsWith('m'))
            return getMissileMoves({ position, piece, rank, file })
    },

    getValidMoves: function ({ position, castleDirection, prevPosition, piece, rank, file, playerId }) {
        let moves = this.getRegularMoves({ position, piece, rank, file, playerId })
        const notInCheckMoves = []
        console.log(playerId, "ppppppppppppvalid moves", castleDirection);

        if (piece.endsWith('p')) {
            moves = [
                ...moves,
                ...getPawnCaptures({ position, prevPosition, piece, rank, file, playerId })
            ]
        }
        if (piece.endsWith('k'))
            moves = [
                ...moves,
                ...getCastlingMoves({ position, castleDirection, piece, rank, file })
            ]

        moves.forEach(([x, y]) => {
            const positionAfterMove =
                this.performMove({ position, piece, rank, file, x, y })

            if (!this.isPlayerInCheck({ positionAfterMove, position, player: piece[0], playerId })) {
                notInCheckMoves.push([x, y])
            }
        })
        // console.log(moves,"valoid moves");
        return notInCheckMoves
    },

    isPlayerInCheck: function ({ positionAfterMove, position, player, playerId }) {
        // console.log(player,"player");

        const enemy = player && player.startsWith('w') ? 'b' : 'w';
        let kingPos = getKingPosition(positionAfterMove, player)
        const enemyPieces = getPieces(positionAfterMove, enemy)
        // console.log(playerId,"isplayer");
        const enemyMoves = enemyPieces.reduce((acc, p) => acc = [
            ...acc,
            ...(p?.piece?.endsWith('p')
                ? getPawnCaptures({
                    position: positionAfterMove,
                    prevPosition: position,
                    ...p,
                    playerId
                })
                : this.getRegularMoves({
                    position: positionAfterMove,
                    ...p,
                    playerId

                })
            )
        ], [])

        // console.log(enemyMoves,"ggggggggggggggggggggggggggggggg------------------");
        if (enemyMoves.some(([x, y]) => kingPos[0] === x && kingPos[1] === y))
            return true

        else
            return false

    },

    performMove: function ({ position, piece, rank, file, x, y }) {
        if (piece.endsWith('p'))
            return movePawn({ position, piece, rank, file, x, y })
        else
            return movePiece({ position, piece, rank, file, x, y })
    },

    isStalemate: function (position, player, castleDirection, playerId) {
        const isInCheck = this.isPlayerInCheck({ positionAfterMove: position, player })

        if (isInCheck)
            return false

        const pieces = getPieces(position, player)
        const moves = pieces.reduce((acc, p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                position,
                castleDirection,
                ...p,
                playerId
            })
            )
        ], [])

        return (!isInCheck && moves.length === 0)
    },

    insufficientMaterial: function (position) {

        const pieces =
            position.reduce((acc, rank) =>
                acc = [
                    ...acc,
                    ...rank.filter(spot => spot)
                ], [])

        // King vs. king
        if (pieces.length === 2)
            return true

        // King and bishop vs. king
        // King and knight vs. king
        if (pieces.length === 3 && pieces.some(p => p.endsWith('b') || p.endsWith('n')))
            return true

        // King and bishop vs. king and bishop of the same color as the opponent's bishop
        if (pieces.length === 4 &&
            pieces.every(p => p.endsWith('b') || p.endsWith('k')) &&
            new Set(pieces).size === 4 &&
            areSameColorTiles(
                findPieceCoords(position, 'wb')[0],
                findPieceCoords(position, 'bb')[0]
            )
        )
            return true

        return false
    },

    isCheckMate: function (position, player, castleDirection, playerId) {
        const isInCheck = this.isPlayerInCheck({ positionAfterMove: position, player })

        if (!isInCheck)
            return false

        const pieces = getPieces(position, player)
        const moves = pieces.reduce((acc, p) => acc = [
            ...acc,
            ...(this.getValidMoves({
                position,
                castleDirection,
                ...p,
                playerId
            })
            )
        ], [])

        // console.log(moves,"moves checkmate",pieces);
        return (isInCheck && moves.length === 0)
    },




}


export default arbiter