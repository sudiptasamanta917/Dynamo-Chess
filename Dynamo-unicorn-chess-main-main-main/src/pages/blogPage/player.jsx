import React, { useState } from "react";
import { FaCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import { getApi } from "../../utils/api";
import Pagination from "../../components/Pagination"; // Assuming you have a Pagination component

const Player = () => {
  const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_ONLINE}`;
  const alluserurl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_ALL_USERS}`;

  // States for search and pagination
  const [searchOnline, setSearchOnline] = useState("");
  const [searchLeaderboard, setSearchLeaderboard] = useState("");
  const [currentPageOnline, setCurrentPageOnline] = useState(1);
  const usersPerPage = 10; // Number of users per page

  const { data: queryGetonline, isLoading, isError } = useQuery(
    "getONLINE",
    () => getApi(url)
  );
  const { data: allUsers, isLoading: loading, isError: error } = useQuery(
    "getAllUsers",
    () => getApi(alluserurl)
  );

  if (isLoading || loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  if (isError || error) {
    console.error("Error fetching data", isError || error);
    return <p className="text-center text-red-500">Error loading data!</p>;
  }

  const filteredOnlineUsers = queryGetonline?.data?.filter((user) =>
    user?.name.toLowerCase().includes(searchOnline.toLowerCase())
  );

  const sortedUsers = allUsers?.data?.data
    ?.filter((user) =>
      user?.name.toLowerCase().includes(searchLeaderboard.toLowerCase())
    )
    ?.sort((a, b) => b.rating - a.rating);

  const indexOfLastUserOnline = currentPageOnline * usersPerPage;
  const indexOfFirstUserOnline = indexOfLastUserOnline - usersPerPage;
  const currentOnlineUsers = filteredOnlineUsers?.slice(
    indexOfFirstUserOnline,
    indexOfLastUserOnline
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Online Players Section */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-4 text-green-400">
            Online Players
          </h1>

          {/* Search Bar for Online Players */}
          <input
            type="text"
            placeholder="Search Online Players..."
            value={searchOnline}
            onChange={(e) => setSearchOnline(e.target.value)}
            className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
          />

          <div className="h-64 overflow-y-auto">
            {currentOnlineUsers?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-700 hover:bg-gray-600 transition p-3 rounded-lg mb-2"
              >
                <div className="flex items-center">
                  <FaCircle className="text-green-500 text-xl mr-3" />
                  <span className="font-medium">{item?.name}</span>
                </div>
                <span className="text-gray-300 font-semibold">
                  {item?.rating?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination for Online Players */}
          <Pagination
            currentPage={currentPageOnline}
            totalPages={Math.ceil(filteredOnlineUsers?.length / usersPerPage)}
            onPageChange={setCurrentPageOnline}
          />
        </div>

        {/* Leaderboard Section */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-4 text-yellow-400">
            Leaderboard
          </h1>

          {/* Search Bar for Leaderboard */}
          {/* <input
            type="text"
            placeholder="Search Leaderboard..."
            value={searchLeaderboard}
            onChange={(e) => setSearchLeaderboard(e.target.value)}
            className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
          /> */}

          <div className="h-96 overflow-y-auto">
            {sortedUsers?.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between items-center bg-gray-700 hover:bg-gray-600 transition p-3 rounded-lg mb-2 ${
                  index === 0
                    ? "bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                    : ""
                }`}
              >
                <div className="flex items-center flex-wrap">
                  <span className="text-lg font-bold mr-3">#{index + 1}</span>
                  <span>{item?.name}</span>
                </div>
                <span className="text-gray-300 font-semibold">
                  {item?.rating?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
