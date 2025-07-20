import React from "react";
import { getApi } from "../utils/api";
import { useQuery } from "react-query";

const HeaderNote = () => {
    const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_scrollText}scrollingText`;

    // Fetching scrolling text
    const getScrollingText = useQuery("scrollingText", () => getApi(url), {
      refetchOnWindowFocus: false,
    });
  
  
    const scrollingText = getScrollingText?.data?.data?.data;
  return (
    <div className="bg-slate-200">
      <div className="overflow-hidden">
        <marquee
          className="text-red-600 font-semibold text-lg md:text-xl"
        >
          <span dangerouslySetInnerHTML={{ __html: scrollingText }} />
        </marquee>
      </div>
    </div>
  );
};

export default HeaderNote;
