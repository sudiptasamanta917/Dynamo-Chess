function timeToMs(time, addMinutes = 0) {
    // Get current date
    const now = new Date();
    
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(":").map(Number);

    // Create a date object for today at the specified time
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // Convert the target time to milliseconds and add extra minutes
    const ms = targetTime.getTime();
    const addedMs = addMinutes * 60 * 1000;

    return ms + addedMs;
}

const remaining = timeToMs("14:28",1) - Date.now(); // Calculate the remaining time

// Check if the remaining time is less than or equal to 1 minute (60000 ms)
if (remaining <= 60000 && remaining >= 0) {
    // console.log(`Remaining time is ${remaining} milliseconds (less than or equal to 1 minute)`);
} else {
    // console.log(`Remaining time is more than 1 minute: ${remaining} milliseconds`);
}

const joinUrl='https:/dynamo-unicorn-chess.vercel.app/multiplayer/tournament:670f62bb9ef173319cf0f875:670f64359ef173319cf1485e:132ff6aa-5a5f-48a9-970c-fbf3ba037177/120'
const url=joinUrl.split("https:/dynamo-unicorn-chess.vercel.app/")[1];
console.log(url,"url");

