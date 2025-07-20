import React from 'react';

export const generateRoundHeaders = (totalRounds) => {
    if (totalRounds <= 0) return null;

    return Array.from({ length: totalRounds }, (_, i) => (
        <th key={i} className="py-2 px-4 text-center">{`Round ${i + 1}`}</th>
    ));
};
