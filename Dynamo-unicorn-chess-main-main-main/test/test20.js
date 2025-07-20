const data = [
        {
            "_id": "66e943a890f401d35b187161",
            "score": 0,
            "buchholz": 0,
            "sonnebornBerger": 0,
            "directEncounter": -2,
            "cumulativeScore": 0,
            "tournamentId": "66e9437090f401d35b186e86",
            "user": "66c2d648ff0133655ec3b38d",
            "userData": {
                "_id": "66c2d648ff0133655ec3b38d",
                "name": "user78",
                "email": "user78@gmail.com",
                "password": "$2a$10$o8BvSceksq0pFPodMKkJMOm0YMYUNh1.YvdQV2ClEft4BVzv4mQgW",
                "mobile": "9088705578",
                "role": "user",
                "otp": "",
                "blocked": false,
                "username": "user78",
                "online": true,
                "lastActivity": "2024-09-17T08:53:11.177Z",
                "country": "Brazil",
                "countryIcon": "https://flagcdn.com/br.svg",
                "rating": 1436.3365352076294,
                "dynamoCoin": 4201,
                "inviteCode": "66c2d648ff0133655ec3b38d"
            },
            "receivedBye": true,
            "roundWiseScore": [
                {
                    "roundNumber": 1,
                    "score": 0,
                    "_id": "66e9440490f401d35b187a6d"
                },
            ],
            "__v": 2
        },
        {
            "_id": "66e943a890f401d35b187165",
            "score": 2,
            "buchholz": 1,
            "sonnebornBerger": 1,
            "directEncounter": 2,
            "cumulativeScore": 2,
            "tournamentId": "66e9437090f401d35b186e86",
            "user": "66c2cf8eb099062316868876",
            "userData": {
                "_id": "66c2cf8eb099062316868876",
                "name": "user70",
                "email": "user70@gmail.com",
                "password": "$2a$10$keSISqwjQPmKrIx1V8/jiuQNdnBEwdgmt/Pa7wM4/YZAhwMVu29RS",
                "mobile": "9088705570",
                "role": "user",
                "otp": "",
                "blocked": false,
                "username": "user70",
                "online": false,
                "lastActivity": "2024-09-17T08:53:17.075Z",
                "country": "Japan",
                "countryIcon": "https://flagcdn.com/jp.svg",
                "rating": 1551.1011872945323,
                "dynamoCoin": 6300,
                "inviteCode": "66c2cf8eb099062316868876"
            },
            "receivedBye": false,
            "roundWiseScore": [
                {
                    "roundNumber": 1,
                    "score": 1,
                    "_id": "66e9440490f401d35b187a73"
                },
                {
                    "roundNumber": 2,
                    "score": 1,
                    "_id": "66e9449890f401d35b1884eb"
                }
            ],
            "__v": 2
        },
        {
            "_id": "66e943a890f401d35b187168",
            "score": 1,
            "buchholz": 2,
            "sonnebornBerger": 0,
            "directEncounter": 0,
            "cumulativeScore": 1,
            "tournamentId": "66e9437090f401d35b186e86",
            "user": "66c5d1910e31220ba17ab043",
            "userData": {
                "_id": "66c5d1910e31220ba17ab043",
                "name": "user215",
                "email": "user215@gmail.com",
                "password": "$2a$10$QCrtfioZhJyYyllrvpsEx./xhw44SrV7MEk47ks1D8Bb9W.RGkwoS",
                "mobile": "9088705525",
                "role": "user",
                "otp": "",
                "blocked": false,
                "username": "user215",
                "online": false,
                "lastActivity": "2024-09-17T08:53:30.638Z",
                "country": "China",
                "countryIcon": "https://flagcdn.com/cn.svg",
                "rating": 1257.0678094768678,
                "dynamoCoin": 34041,
                "inviteCode": "66c5d1910e31220ba17ab043"
            },
            "receivedBye": false,
            "roundWiseScore": [
                {
                    "roundNumber": 1,
                    "score": 1,
                    "_id": "66e9440490f401d35b187a78"
                },
                {
                    "roundNumber": 2,
                    "score": 0,
                    "_id": "66e9449890f401d35b1884f6"
                }
            ],
            "__v": 2
        },
        {
            "_id": "66e943a890f401d35b18716c",
            "score": 1,
            "buchholz": 1,
            "sonnebornBerger": 0,
            "directEncounter": 0,
            "cumulativeScore": 1,
            "tournamentId": "66e9437090f401d35b186e86",
            "user": "66bae7d821eeca63a179b964",
            "userData": {
                "_id": "66bae7d821eeca63a179b964",
                "name": "user1",
                "email": "user1@gmail.com",
                "password": "$2a$10$zgI5bzehFGqaSQVwcj4tA.mir6rcxaSkRiB//G.3L0ZJ/vP8zNu1O",
                "mobile": "9874123654",
                "role": "user",
                "otp": "",
                "blocked": false,
                "username": "user1",
                "online": false,
                "lastActivity": "2024-09-17T08:53:31.814Z",
                "country": "China",
                "countryIcon": "https://flagcdn.com/tw.svg",
                "rating": 1553.797001862194,
                "dynamoCoin": 51060,
                "inviteCode": "66bae7d821eeca63a179b964"
            },
            "receivedBye": true,
            "roundWiseScore": [
                {
                    "roundNumber": 1,
                    "score": 0,
                    "_id": "66e9440490f401d35b187a7e"
                },
                {
                    "roundNumber": 2,
                    "score": 1,
                    "_id": "66e9449890f401d35b1884fe"
                }
            ],
            "__v": 2
        }
    ]

    const getScoreByUserAndRound = (data, userId, roundNumber) => {
        // Find the user object by matching the 'user' field
        const userMatch = data.find(user => user.user === userId);
      
        // If the user is found, check for the round in 'roundWiseScore'
        if (userMatch) {
          const roundMatch = userMatch.roundWiseScore.find(round => round.roundNumber === roundNumber);
      
          // If the round is found, return the score, otherwise return null or a default value
          return roundMatch ? roundMatch.score : null;
        }
      
        // Return null or a default value if the user or round is not found
        return null;
      };
      
      // Example usage:
      const userId = "66c5d1910e31220ba17ab043";
      const roundNumber = 1;
      const score = getScoreByUserAndRound(data, userId, roundNumber);
      
      console.log(score); // Output: 0
      

      const byeUsers = data
  .filter(user => user.receivedBye === true) // Filter users who received a bye
  .map((user,index) => {
    // Extract the round number from roundWiseScore
    const roundNumber = user.roundWiseScore.length > 0 ? user.roundWiseScore[user.roundWiseScore.length-].roundNumber : 'N/A';
    return {
      username: user.userData.name,
      roundNumber: roundNumber
    };
  });

// Output the results
console.log(byeUsers,"BYE USER");