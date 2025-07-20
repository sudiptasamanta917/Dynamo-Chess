import React, { useEffect, useState, useMemo } from 'react';
import fast from "../assets/fast.png";
import second from "../assets/second.png";
import thard from "../assets/thard.png";
import { getApi, getApiWithToken, postApiWithTokenRowData } from '../utils/api';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom'
import { formatDate, formatTime, getScoreByUserAndRound, getUserdata } from '../utils/getuserdata';
import { generateRoundHeaders } from '../components/generateRoundHeaders';
import Timer from '../components/Timer';
import { FaSearch, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
const LiveTournamentDetail = () => {
    const [search, setSearch] = useState(''); // State for search input
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const itemsPerPage = 5; // Number of items per page
    const [result, setResult] = useState({});
    let { id } = useParams();

    // URLs
    const tournamentsuUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_MY_TOURNAMENT_BY_ID}${id}`;
    const PAIR_PLAYERS = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_PAIR_PLAYERS_BY_ID}${id}`;
    const PAIREDLISTURL = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_PAIRED_LIST}${id}`;
    // Fetch Tournament Data
    const queryGetTournamentById = useQuery(
        ["GetTournamentById", tournamentsuUrl],
        () => getApiWithToken(tournamentsuUrl),
        // {
        //     refetchOnWindowFocus: false,
        //     refetchInterval: 10000,
        //     enabled: !!tournamentsuUrl,
        //     onSuccess: (data) => {
        //         console.log("Tournament data fetched successfully:", data);
        //     },
        //     onError: (error) => {
        //         console.error("Query error:", error);
        //     },
        // } 
    );

    const queryGETPAIREDLIST = useQuery(
        ["GetPAIREDLIST", PAIREDLISTURL],
        () => getApiWithToken(PAIREDLISTURL),
    );

    // console.log(queryGetTournamentById, "queryGetTournamentById");

    // Extract Data and Status
    const tournamentData = queryGetTournamentById?.data?.data?.data || {};
    const tournamentStatus = tournamentData?.status;
    const totalRounds = tournamentData?.rounds?.length || 0;
    const roundId = tournamentData?.rounds || 0
    const totalPlayers = tournamentData?.players?.length || 0;
    const PAIREDLISTDATA = queryGETPAIREDLIST?.data?.data?.data
    const userData = getUserdata()

    // console.log(PAIREDLISTDATA, "tournament=====", tournamentData?.rounds);

    const baseUrl = import.meta.env.VITE_URL;
    const resultUrl = `${baseUrl}${import.meta.env.VITE_GET__TOURNAMENT_RESULT}${id}`;
    const matchDataUrl = `${baseUrl}${import.meta.env.VITE_GET__TOURNAMENT_MATCH_DATA}${id}`;

    // Fetch Tournament Results
    async function fetchTournamentResult() {

        try {
            // console.log("Fetching tournament result...");

            // Conditionally fetch results based on tournament status
            const resultPromise = tournamentStatus === "completed" || totalRounds > 0
                ? getApiWithToken(resultUrl)
                : Promise.resolve({ data: { data: null } });

            const matchDataPromise = tournamentStatus === "ongoing" || totalRounds > 0
                ? getApiWithToken(matchDataUrl)
                : Promise.resolve({ data: { data: null } });

            // Wait for all promises to resolve
            const [GetTournamentResult, GetOngoingResult] = await Promise.all([resultPromise, matchDataPromise]);

            setResult({
                Result: GetTournamentResult?.data?.data || null,
                OngoingResult: GetOngoingResult?.data?.data || null
            })

            // console.log("Fetched data:", result);
            // return result;
        } catch (error) {
            console.error("Error fetching tournament result:", error);
            // setError(error);
            return null;
        }
    }

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (queryGetTournamentById.isSuccess && (tournamentStatus === "ongoing" || tournamentStatus === "completed")) {
                // console.log("Query successful, fetching tournament result...");
                try {
                    // Conditionally fetch results based on tournament status
                    const resultPromise = tournamentStatus === "completed" || totalRounds > 0
                        ? getApiWithToken(resultUrl)
                        : Promise.resolve({ data: { data: null } });

                    const matchDataPromise = tournamentStatus === "ongoing" || totalRounds > 0
                        ? getApiWithToken(matchDataUrl)
                        : Promise.resolve({ data: { data: null } });

                    // Wait for all promises to resolve
                    const [GetTournamentResult, GetOngoingResult] = await Promise.all([resultPromise, matchDataPromise]);

                    setResult({
                        Result: GetTournamentResult?.data?.data || null,
                        OngoingResult: GetOngoingResult?.data?.data || null
                    })


                } catch (error) {
                    console.error("Error fetching tournament result:", error);
                }

                // Call fetchData again after 10 seconds
                if (isMounted) {
                    setTimeout(fetchData, 10000); // Recursively call after 10 seconds
                }
            }
        };

        // Initial call to fetch data
        fetchData();

        return () => {
            isMounted = false;
            // console.log("Cleanup, component unmounted");
        };
    }, [queryGetTournamentById.isSuccess, tournamentStatus, fetchTournamentResult]);
    // Aggregate Scores
    const ongoingResult = result?.Result || [];
    // console.log(result, "ongoingResult------");

    // Aggregating the scores based on ongoingResult data
    const aggregatedScores = ongoingResult.reduce((acc, item) => {
        if (!acc[item.userData._id]) {
            acc[item.userData._id] = {
                name: item.userData.name,
                rating: item.userData.rating,
                scores: Array(totalRounds).fill("-"), // Initialize an array for rounds with default score "-"
                totalPoints: 0,
            };
        }

        const userScores = acc[item.userData._id];

        // Update only if roundWiseScore is available
        if (item.roundWiseScore.length > 0) {
            item.roundWiseScore.forEach(round => {
                // Update score only if round has been played; otherwise keep "-"
                if (round.score !== undefined) {
                    userScores.scores[round.roundNumber - 1] = round.score;
                }
            });
        }

        // Calculate total points excluding "-"
        userScores.totalPoints = userScores.scores.reduce((sum, score) => {
            return score !== "-" ? sum + score : sum;
        }, 0);

        return acc;
    }, {});



    // Filter data based on search input
    const filteredPlayers = useMemo(() => {
        const players = queryGetTournamentById?.data?.data?.data?.JoinedPlayerList || [];
        return players.filter(participant =>
            participant?.userData?.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, queryGetTournamentById?.data?.data?.data?.JoinedPlayerList]);

    // Calculate total pages based on filtered data
    const totalPageCount = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);

    // Get data to display on the current page
    const playersToDisplay = useMemo(() => {
        const startIndex = (currentPageNumber - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredPlayers.slice(startIndex, endIndex);
    }, [currentPageNumber, filteredPlayers]);

    // Handle pagination
    const goToNextPage = () => {
        setCurrentPageNumber(prev => (prev < totalPageCount ? prev + 1 : prev));
    };

    const goToPreviousPage = () => {
        setCurrentPageNumber(prev => (prev > 1 ? prev - 1 : prev));
    };


    const filteredData = useMemo(() => {
        return Object.entries(aggregatedScores)
            .filter(([userId, userData]) =>
                userData.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort(([userIdA, userDataA], [userIdB, userDataB]) =>
                userDataB.totalPoints - userDataA.totalPoints
            );
    }, [search, aggregatedScores]);

    // bye users
    const byeUsers = ongoingResult
        .filter(user => user.receivedBye === true) // Filter users who received a bye
        .map((user, index) => {
            // Extract the round number from roundWiseScore
            const roundNumber = user.roundWiseScore.length > 0 ? user.roundWiseScore[user.roundWiseScore.length - 1].roundNumber : 'N/A';
            return {
                username: user.userData.name,
                roundNumber: roundNumber
            };
        });

    // console.log(byeUsers,"byeUsers");

    // Calculate total pages based on filtered data
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    // Get data to display on the current page
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredData.slice(start, end);
    }, [currentPage, filteredData]);

    // Handle pagination
    const nextPage = () => {
        setCurrentPage(prev => (prev < pageCount ? prev + 1 : prev));
    };

    const prevPage = () => {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    };


    // Sort Players by Total Points
    const sortedPlayers = Object.entries(aggregatedScores).sort(([, a], [, b]) => b.totalPoints - a.totalPoints);
    const players = Object.entries(aggregatedScores)
    // console.log(sortedPlayers, "Total Points", players,);
    const [BoardData, setBoardData] = useState([])
    const [CombinedData, setCombinedData] = useState([]); // State to store combined data
    useEffect(() => {
        const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_BOARD_DATA}${id}`;
        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",url,roundId[roundId.length-1]);
        const fetch = async () => {
            try {
                const data = await getApi(url)
                setBoardData(data?.data?.data)
                // console.log(data, "&&&&&&&&&&&&&&&&&&");
            } catch (error) {
                // console.log(error);

            }


        }
        fetch();
    }, [roundId])

    useEffect(() => {
        // Combine the data when both are available
        if (PAIREDLISTDATA && BoardData.length > 0) {
            // Filter out items that don't have a boardNumber
            // console.log(PAIREDLISTDATA, "paired list data a gaya hai");

            const combined = BoardData
                .filter((boardItem) => boardItem.boardNumber) // Keep only items with boardNumber
                .map((boardItem, index) => ({
                    ...PAIREDLISTDATA[index], // Combine with corresponding PAIREDLISTDATA item
                    boardData: boardItem, // Add the corresponding boardData
                }));
            setCombinedData(combined);
        }
    }, [PAIREDLISTDATA, BoardData]);


    // Generate Round Headers
    const roundHeaders = generateRoundHeaders(totalRounds);
    const UpcomingRound = queryGetTournamentById?.data?.data?.data?.upComingRound;
    const TotalRounds = queryGetTournamentById?.data?.data?.data?.noOfRounds;

    // console.log(currentData, "currentData");

    return (
        <div className="bg-white text-white p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tournament Info */}
            <div className="sm:col-span-1 col-span-2 bg-gray-800 p-4 rounded-lg flex flex-col justify-between">
                <div>
                    <div className="flex items-center">
                        <div className="text-3xl mr-4">🛡️</div>
                        <div>
                            {/* <p className="text-xl font-semibold">1.5+0 • Bullet • Rated</p>
                            <p className="text-blue-400 underline cursor-pointer">Swiss</p> */}
                            <div className=' flex items-center'>
                                <p>{UpcomingRound > TotalRounds ? TotalRounds : UpcomingRound}/{TotalRounds} rounds</p>
                                {
                                    UpcomingRound <= TotalRounds &&
                                    <div className='ml-2 flex items-center'>
                                        <p>Timer: </p>
                                        <div className='ml-2'>
                                            <Timer data={queryGetTournamentById?.data?.data?.data?.time} />

                                        </div>
                                    </div>
                                }


                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-blue-400 font-semibold">{userData?.name}</p>
                        <p>Fixed line-up</p>
                        <p>Play your games</p>
                        {
                            totalPlayers > 0 &&
                            <p>No. of Players : {totalPlayers}</p>

                        }
                        <p className="text-gray-400 mt-4">by <span className="text-blue-400">Admin</span></p>
                        <p className="text-gray-400">{formatDate(queryGetTournamentById?.data?.data?.data?.startDate,queryGetTournamentById?.data?.data?.data?.time)}, {formatTime(queryGetTournamentById?.data?.data?.data?.startDate,queryGetTournamentById?.data?.data?.data?.time)}</p>
                    </div>
                </div>

                {/* Bye Paired List*/}
                {

                    <div className={`mt-4 bg-gray-700 rounded-lg space-y-4 overflow-auto ${byeUsers.length > 0 && 'h-40 p-4 '}`}>
                        {byeUsers?.map((user, index) => {
                            // Check if boardData and users are valid
                            // const { boardData } = combinedData;
                            // const hasValidUsers = boardData?.user1 && boardData?.user2 && combinedData.player1Name && combinedData.player2Name;

                            return (
                                <div key={index} className="relative bg-gray-800 p-6 rounded-lg">
                                    {/* Round Title - centered at the top */}
                                    <div
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 px-2 py-1 rounded-full"
                                        style={{ maxWidth: "90%", textAlign: "center" }}
                                    >
                                        <h3 className="text-white text-xs sm:text-xs md:text-base font-semibold">
                                            Round {index + 1 || 'N/A'} - Bye
                                        </h3>
                                    </div>

                                    {/* Player 1 vs Player 2 Section */}
                                    <div className="  mt-2">
                                        {/* Player 1 Section */}
                                        <div className={`text-white mb-4 sm:mb-0 font-bold  order-1`}>
                                            <h2 className="text-lg font-semibold text-center">
                                                {user.username || 'Player 1'}
                                            </h2>
                                            {/* <p className="text-sm">{boardData.user1Color === 'w' ? 'White' : 'Black'}</p> */}
                                        </div>

                                    </div>
                                </div>
                            )// Return null if user data is invalid
                        })}
                    </div>
                }

                {/* Paired list with board number */}
                <div className="mt-4 bg-gray-700 p-4 rounded-lg space-y-4 overflow-auto h-80">
                    {CombinedData?.map((combinedData, index) => {
                        // Check if boardData and users are valid
                        const { boardData } = combinedData;
                        const hasValidUsers = boardData?.user1 && boardData?.user2 && combinedData.player1Name && combinedData.player2Name;

                        return hasValidUsers ? (
                            <div key={index} className="relative bg-gray-800 p-6 rounded-lg">
                                {/* Round Title - centered at the top */}
                                <div
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 px-4 py-1 rounded-full"
                                    style={{ maxWidth: "90%", textAlign: "center" }}
                                >
                                    <h3 className="text-white text-xs sm:text-xs md:text-base font-semibold">
                                        Round {combinedData.roundNumber || 'N/A'} - Board {boardData.boardNumber || 'N/A'}
                                    </h3>
                                </div>

                                {/* Player 1 vs Player 2 Section */}
                                <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
                                    {/* Player 1 Section */}
                                    <div className={`text-white mb-4 sm:mb-0 font-bold ${boardData.user1Color === 'w' ? 'order-1' : 'order-3'}`}>
                                        <h2 className="text-lg font-semibold">
                                            {combinedData.player1Name || 'Player 1'}
                                        </h2>
                                        {/* <p className="text-sm">{boardData.user1Color === 'w' ? 'White' : 'Black'}</p> */}
                                    </div>

                                    <span className="text-white font-bold mb-4 sm:mb-0 order-2">VS</span>

                                    {/* Player 2 Section */}
                                    <div className={`text-white font-bold ${boardData.user2Color === 'w' ? 'order-1' : 'order-3'}`}>
                                        <h2 className="text-lg font-semibold">
                                            {combinedData.player2Name || 'Player 2'}
                                        </h2>
                                        {/* <p className="text-sm">{boardData.user2Color === 'w' ? 'White' : 'Black'}</p> */}
                                    </div>
                                </div>
                            </div>
                        ) : null; // Return null if user data is invalid
                    })}
                </div>



            </div>

            {/* Leaderboard */}


            <div className="sm:col-span-1 col-span-2 bg-gray-800 p-4 rounded-lg text-center">
                <h2 className="text-2xl text-blue-400 mb-4">{queryGetTournamentById?.data?.data?.data.tournamentName} Tournament</h2>
                {tournamentStatus === "pending" ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-center items-center bg-gray-600 p-2 rounded-lg mt-3">
                            <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                                <FaSearch className="text-gray-400 w-5 h-5 mr-4 cursor-pointer" />
                                <input
                                    type="text"
                                    className="text-gray-400 bg-transparent border-b border-gray-400 p-1 focus:outline-none w-full sm:w-auto"
                                    placeholder="Search player"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => setCurrentPageNumber(1)}
                                    disabled={currentPageNumber === 1}
                                >
                                    <FaAngleDoubleLeft className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={goToPreviousPage}
                                    disabled={currentPageNumber === 1}
                                >
                                    <FaAngleLeft className="w-5 h-5" />
                                </button>
                                <span className="text-white">{`${currentPageNumber}/${totalPageCount}`}</span>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={goToNextPage}
                                    disabled={currentPageNumber === totalPageCount}
                                >
                                    <FaAngleRight className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => setCurrentPageNumber(totalPageCount)}
                                    disabled={currentPageNumber === totalPageCount}
                                >
                                    <FaAngleDoubleRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto mt-1">
                            <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-700 text-gray-400">
                                        <th className="py-2 px-4 text-left">#</th>
                                        <th className="py-2 px-4 text-left">Player</th>
                                        <th className="py-2 px-4 text-center">Rating</th>
                                        <th className="py-2 px-4 text-center">Country</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playersToDisplay.map((participant, index) => (
                                        <tr key={index} className="border-t border-gray-700">
                                            <td className="py-2 px-4">{(currentPageNumber - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                            <td className="py-2 px-4">{participant?.userData?.username}</td>
                                            <td className="py-2 px-4 text-center text-green-500">
                                                {participant?.userData?.rating?.toFixed(2)}
                                            </td>
                                            <td className="py-2 px-4 text-center text-red-500">
                                                <img
                                                    src={participant?.userData?.countryIcon} // Replace `countryIcon` with the actual image URL or import path
                                                    alt="Country Icon"
                                                    className="w-4 h-4 inline-block mr-2"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : tournamentStatus === "ongoing" ? (
                    <>
                        <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-600 p-2 rounded-lg mt-1">
                            <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                                <FaSearch className="text-gray-400 w-5 h-5 mr-4 cursor-pointer" />
                                <input
                                    type="text"
                                    className="text-gray-400 bg-transparent border-b border-gray-400 p-1 focus:outline-none w-full sm:w-auto"
                                    placeholder="Search player"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    <FaAngleDoubleLeft className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    <FaAngleLeft className="w-5 h-5" />
                                </button>
                                <span className="text-white">{`${currentPage}/${pageCount}`}</span>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={nextPage}
                                    disabled={currentPage === pageCount}
                                >
                                    <FaAngleRight className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => setCurrentPage(pageCount)}
                                    disabled={currentPage === pageCount}
                                >
                                    <FaAngleDoubleRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto mt-4">
                            {/* <div className="mb-4 text-white">
                                Total Players: {totalPlayers}
                            </div> */}
                            <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-700 text-gray-400">
                                        <th className="py-2 px-4 text-left">#</th>
                                        <th className="py-2 px-4 text-left">Player</th>
                                        {roundHeaders}
                                        {/* <th className="py-2 px-4 text-center">Points</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.length > 0 ? (
                                        currentData.map(([userId, userData], index) => (
                                            <tr key={userId} className="border-t border-gray-700">
                                                <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="py-2 px-4">
                                                    {userData.name} <span className="text-gray-400">{userData.rating.toFixed(0)}</span>
                                                </td>
                                                {userData.scores.map((score, i) => (
                                                    <td key={i} className={`py-2 px-4 text-center ${score > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {score}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={totalRounds + 3} className="py-4 text-center">
                                                No results found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : queryGetTournamentById?.data?.data?.data.status === "completed" ? (
                    <>
                        <div className="flex justify-around items-center">
                            {result && result?.Result?.length > 0 && (
                                <>
                                    {
                                        result?.Result[1]?.userData?.username &&
                                        <div className="flex flex-col items-center">
                                            <div className="mb-2">
                                                <img
                                                    src={second}
                                                    alt="Silver Medal"
                                                    className="w-12 h-17 object-cover"
                                                />
                                            </div>
                                            <p className="text-lg font-semibold">{result?.Result[1]?.userData?.username || 'Username not available'}</p>
                                            {/* <p>Points {result[1]?.score - 1}</p> */}
                                        </div>
                                    }
                                    {
                                        result?.Result[0]?.userData?.username &&

                                        <div className="flex flex-col items-center">
                                            <div className="mb-2">
                                                <img
                                                    src={fast}
                                                    alt="Gold Medal"
                                                    className="w-18 h-20 object-cover"
                                                />
                                            </div>
                                            <p className="text-lg font-semibold">{result?.Result[0]?.userData?.username || 'Username not available'}</p>
                                            {/* <p>Points {result[0]?.score - 1}</p> */}
                                        </div>
                                    }

                                    {
                                        result?.Result[2]?.userData?.username &&
                                        <div className="flex flex-col items-center">
                                            <div className="mb-2">
                                                <img
                                                    src={thard}
                                                    alt="Bronze Medal"
                                                    className="w-12 h-17 object-cover"
                                                />
                                            </div>
                                            <p className="text-lg font-semibold">{result?.Result[2]?.userData?.username || 'Username not available'}</p>
                                            {/* <p>Points {result[2]?.score - 1}</p> */}
                                        </div>
                                    }
                                </>
                            )}
                        </div>
                        <div>
                            {/* Search and Pagination Controls */}
                            <div className="flex flex-col md:flex-row justify-center items-center bg-gray-600 p-4 rounded-lg mt-3">
                                <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
                                    <FaSearch className="text-gray-400 w-5 h-5 mr-3 cursor-pointer" />
                                    <input
                                        type="text"
                                        className="text-gray-400 bg-transparent border-b border-gray-400 p-2 focus:outline-none w-full md:w-auto"
                                        placeholder="Search player"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center space-x-3 mt-3 md:mt-0">
                                    <button
                                        className="text-gray-400 hover:text-white disabled:opacity-50"
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <FaAngleDoubleLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-gray-400 hover:text-white disabled:opacity-50"
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                    >
                                        <FaAngleLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-white text-sm md:text-base">{`${currentPage}/${pageCount}`}</span>
                                    <button
                                        className="text-gray-400 hover:text-white disabled:opacity-50"
                                        onClick={nextPage}
                                        disabled={currentPage === pageCount}
                                    >
                                        <FaAngleRight className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-gray-400 hover:text-white disabled:opacity-50"
                                        onClick={() => setCurrentPage(pageCount)}
                                        disabled={currentPage === pageCount}
                                    >
                                        <FaAngleDoubleRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>



                            {/* Table with Players and Scores */}
                            <div className="overflow-x-auto mt-1">
                                <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-400">
                                            <th className="py-2 px-4 text-left">#</th>
                                            <th className="py-2 px-4 text-left">Player</th>
                                            {Array.from({ length: totalRounds }, (_, index) => (
                                                <th key={index} className="py-2 px-4 text-center">Round {index + 1}</th>
                                            ))}
                                            <th className="py-2 px-4 text-center">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ? (
                                            currentData.map(([userId, userData], index) => (
                                                <tr key={userId} className="border-t border-gray-700">
                                                    <td className="py-2 px-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td className="py-2 px-4">
                                                        {userData.name} <span className="text-gray-400">{userData.rating.toFixed(0)}</span>
                                                    </td>
                                                    {userData.scores.map((score, i) => (
                                                        <td key={i} className={`py-2 px-4 text-center ${score > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                            {score}
                                                        </td>
                                                    ))}
                                                    <td className="py-2 px-4 text-center">{userData.totalPoints}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={totalRounds + 3} className="py-4 text-center">
                                                    No results found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : null}

            </div>
        </div>

    );
};

export default LiveTournamentDetail;
