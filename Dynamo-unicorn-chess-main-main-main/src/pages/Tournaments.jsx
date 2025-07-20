import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "react-query";
import { getApi, postApi } from "../utils/api";
import { formatDate, formatTime } from "../utils/getuserdata";
import { toastSuccess, toastWarn } from "../utils/notifyCustom";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { isTournamentTimeNow } from "../utils/TournamenttimeJoin";

const Tournaments = () => {
  const [filter, setFilter] = useState("Upcoming");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1); // Start with page 1
  const tournamentsPerPage = 10; // Matches backend's default `limit`
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Fetch tournaments based on pagination or search
  const fetchTournaments = async () => {
    const baseUrl = import.meta.env.VITE_URL;
    const endpoint = searchTerm
      ? `${baseUrl}/searchTournament?searchTerm=${searchTerm}`
      : `${baseUrl}${import.meta.env.VITE_GET_ALL_TOURNAMENT}?page=${currentPage}&limit=${tournamentsPerPage}`;
    const response = await getApi(endpoint);
    return response.data;
  };

  const { data, isLoading } = useQuery(
    ["getAllTournaments", searchTerm, currentPage], // Include `searchTerm` and `currentPage` in the key
    fetchTournaments,
    { keepPreviousData: true } // Retain old data while fetching new data
  );

  const tournaments = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const tournamentJoin = async (id, date, time) => {
    try {
      setLoading(true);
      const joinUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_JOIN_TOURNAMENT}${id}`;
      const canJoin = isTournamentTimeNow(date,time)

      const result = !canJoin && await postApi(joinUrl);



      if (result.data.success) {
        toastSuccess("Joined Successfully");
        navigate(`/LiveTournamentDetail/${id}`);
      } else {
        toastWarn(result.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <h1 className="p-6 bg-green-800 text-center text-2xl font-semibold">
        Tournaments
      </h1>
      <p className='text-red-700 text-center text-xl' behavior="" direction="">players have to join the tournaments 1 minutes before the the given time below</p>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2 w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search for a Tournament"
              className="bg-transparent text-white focus:outline-none flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <button className="text-gray-400 hover:text-gray-200 ml-2">
              <FaSearch />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400">Loading tournaments...</div>
        ) : (
          <div className="overflow-x-auto text-xs sm:text-lg">
            <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
              <thead className="bg-gray-700">
                <tr>
                  <th className="sm:py-3 py-1 px-4 text-left">Name</th>
                  <th className="sm:py-3 py-1 px-4 text-left">Entry Fees</th>
                  <th className="sm:py-3 py-1 px-4 text-left">Players</th>
                  <th className="sm:py-3 py-1 px-4 text-left">Date</th>
                  <th className="sm:py-3 py-1 px-4 text-left">Time</th>
                  <th className="sm:py-3 py-1 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                      } hover:bg-gray-600 transition`}
                  >
                    <td className="sm:py-3 py-1 px-4">{tournament?.tournamentName}</td>
                    <td className="sm:py-3 py-1 px-4">{tournament?.entryFees}</td>
                    <td className="sm:py-3 py-1 px-4">
                      {tournament?.JoinedPlayerList?.length}
                    </td>
                    <td className="sm:py-3 py-1 px-4">{formatDate(tournament?.startDate, tournament?.time)}</td>
                    <td className="sm:py-3 py-1 px-4">{formatTime(tournament?.startDate, tournament?.time)}</td>
                    <td className="sm:py-3 py-1 px-4">
                      <div className="flex items-center justify-center">
                        {tournament?.status === "ongoing" ? (
                          <p className="bg-green-600 px-3 py-1 rounded-xl text-sm text-white">
                            Running
                          </p>
                        ) : tournament?.status === "completed" ? (
                          <p className="bg-blue-600 px-3 py-1 rounded-xl text-sm text-white">
                            Completed
                          </p>
                        ) : tournament?.status === "suspended" ? (
                          <p className="bg-red-600 px-3 py-1 rounded-xl text-sm text-white">
                            Canceled
                          </p>
                        ) : (

                          <button
                            onClick={() => tournamentJoin(tournament?._id, tournament?.startDate, tournament?.time, tournament?.startDate, tournament?.time)}
                            disabled={loading || isTournamentTimeNow(tournament?.startDate, tournament?.time)}
                            className={`${isTournamentTimeNow(tournament?.startDate, tournament?.time) ? "bg-gray-300 text-gray-600" : "bg-green-600 hover:bg-green-500 text-white"}  px-4 py-2 rounded-lg`}
                          >
                            Join
                          </button>

                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!searchTerm && ( // Pagination only shown if not searching
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
