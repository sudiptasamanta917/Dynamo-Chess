import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useQuery } from "react-query";
import { getApi } from "../utils/api";

const Slider = (props) => {
  const { height, eventDetails, images: propImages } = props;

  // API URL for fetching banner data
  const Url = `https://chess.dynamochess.in/getBanner?type=Home upper banner`;

  // Fetching banner data using useQuery
  const queryBanner = useQuery(
    ["banner", Url], // Query key
    () => getApi(Url), // Query function
    {
      staleTime: 300000, // Optional: Cache for 5 mins
      refetchOnWindowFocus: false,
    }
  );

  // Extracting banner data from API response
  const bannerData = queryBanner?.data?.data?.data || [];

  // Transforming banner data for OwlCarousel
  const bannerImages = bannerData.flatMap((banner) =>
    banner.images.map((image) => ({
      img: image,
    }))
  );

  // Final images to be used in the carousel (API or passed via props)
  const finalImages = bannerImages.length > 0 ? bannerImages : propImages || [];

  return (
    <div>
      <section className="text-gray-600 body-font bg-slate-200 flex justify-center overflow-hidden">
        {queryBanner.isLoading ? (
          <p className="text-center text-lg font-semibold">Loading banners...</p>
        ) : queryBanner.isError ? (
          <p className="text-center text-red-500">
            Error fetching banners: {queryBanner.error.message}
          </p>
        ) : (
          <OwlCarousel
            className="owl-theme"
            loop={true}
            margin={0}
            autoplay={true}
            autoplayTimeout={3000}
            autoplaySpeed={2000}
            items={1}
            dots={false}
            nav={false}
            responsive={{
              0: { items: 1 },
              600: { items: 1 },
              1000: { items: 1 },
            }}
          >
            {finalImages.map((item, index) => (
              <div key={index} className="relative rounded-md">
                <img
                  loading="lazy"
                  className="w-full rounded-md"
                  style={{ height: height }}
                  src={item.img}
                  alt={`Banner ${index + 1}`}
                />
                {eventDetails && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white text-center p-4">
                    <div>
                      {eventDetails.split("\n").map((line, i) => (
                        <p key={i} className="text-4xl font-semibold text-white">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </OwlCarousel>
        )}
      </section>
    </div>
  );
};

export default Slider;
