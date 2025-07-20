export const getUserdata = () => {
    const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
    return UserDetail

}

export const getNotificationdata = () => {
    const Notificationdata = JSON.parse(localStorage.getItem("notification"));
    return Notificationdata

}

export const minutesToSeconds = (minutes) => {
    return minutes * 60;
}

function convertToISO(date, time) {
    if (!date && !time) {
        return ''; // or return a default value like 'Invalid time'
    }
    // Split the time into hours and minutes
    let [hours, minutes] = time && time.split(":").map(Number);
    // Determine if it's AM or PM
    let isPM = hours >= 12;
    let adjustedHours = isPM ? (hours === 12 ? 12 : hours - 12) : (hours === 0 ? 12 : hours);
    // Format time as HH:mm (12-hour format with AM/PM suffix)
    let formattedTime = `${adjustedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
    // Adjust time for the India timezone (IST)
    let tournamentTimeInIndia = `${date}T${time}:00+05:30`;
    return { formattedTime, tournamentTimeInIndia };
}

function getTournamentTimeInCountry(indianTime, timeZone) {
    // Convert Indian time to the target time zone
    const date = new Date(indianTime);
    return date.toLocaleString("en-US", { timeZone: timeZone });
}

export const formatDate = (date, time) => {
    if (!date && !time) {
        return ''; // or return a default value like 'Invalid time'
    }
    const { tournamentTimeInIndia } = convertToISO(date, time);

    let indTime = tournamentTimeInIndia

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(tz);
    // Tournament start time in India (6th January 2025, 10:30 AM)
    const tournamentTimeInIndias = indTime;
    // Time in New York (EST - GMT-5)
    const newYorkTime = getTournamentTimeInCountry(tournamentTimeInIndias, tz);

    const [date1, time1] = newYorkTime.split(', ')
    return date1

};

export function formatTime(date, time) {
    if (!date && !time) {
        return ''; // or return a default value like 'Invalid time'
    }

    const { tournamentTimeInIndia } = convertToISO(date, time);

    let indTime = tournamentTimeInIndia

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(tz);
    // Tournament start time in India (6th January 2025, 10:30 AM)
    const tournamentTimeInIndias = indTime;
    // Time in New York (EST - GMT-5)
    const newYorkTime = getTournamentTimeInCountry(tournamentTimeInIndias, tz);

    const [date1,time1] = newYorkTime.split(', ')
    const [hour, minute, secondAndPeriod] = time1.split(":");
    const [second, period] = secondAndPeriod.split(" ");
    
    // Format the time, excluding the seconds
    const formattedTime = `${hour}:${minute} ${period}`; // Hours and minutes with AM/PM
    return formattedTime
}



export const getScoreByUserAndRound = (data, userId, roundNumber) => {
    // console.log(data, userId, roundNumber, "round=====");
    // Find the user object by matching the 'user' field
    const userMatch = data.find(user => user.user === userId);
    // If the user is found, check for the round in 'roundWiseScore'
    if (userMatch) {
        const roundMatch = userMatch.roundWiseScore.find(round => round.roundNumber == roundNumber);
        // If the round is found, return the score, otherwise return null or a default value
        return roundMatch ? roundMatch.score : null;
    }

    // Return null or a default value if the user or round is not found
    return null;
};


// export const generateRoundHeaders = (totalRounds) => {
//     if (totalRounds <= 0) return null; // Return null if there are no rounds

//     return Array.from({ length: totalRounds }, (_, i) => (
//         <th key={i} className="py-2 px-4 text-center">{`Round ${i + 1}`}</th>
//     ));
// };



