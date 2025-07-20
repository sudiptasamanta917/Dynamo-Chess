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
  
  export function isTournamentTimeNow(date, time) {
    const { tournamentTimeInIndia } = convertToISO(date, time);
  
    // Get the timezone of the user's current location
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Get the tournament time in the target timezone (e.g., New York)
    const newYorkTime = getTournamentTimeInCountry(tournamentTimeInIndia, tz);
    
    // Get current local time in the same timezone
    const currentTime = new Date().toLocaleString("en-US", { timeZone: tz });
  
    // Compare the tournament time with the current time (ignoring seconds)
    const tournamentDate = new Date(newYorkTime);
    const currentDate = new Date(currentTime);
  
    // Calculate the difference in minutes
    const diffMinutes = Math.abs(tournamentDate.getTime() - currentDate.getTime()) / (1000 * 60);
    
    // Allow a ±1 minute tolerance for the match
    const isMatch = diffMinutes <= 1;
  
    console.log(isMatch, "isMatch");
  
    return isMatch;
  }
  
  // Example usage
  const date = "2025-01-09";  // Example date
  const time = "15:47";        // Example time (12-hour format)
  
  const isMatch = isTournamentTimeNow(date, time);
  console.log(isMatch); // true or false based on the comparison
  