import actionTypes from '../actionTypes';

export const openPromotion = ({rank,file,x,y,a,b}) => {
    return {
        type: actionTypes.PROMOTION_OPEN,
        payload: {rank,file,x,y,a,b}
    }
}

export const closePopup = () => {
    return {
        type: actionTypes.PROMOTION_CLOSE,
    }
}
