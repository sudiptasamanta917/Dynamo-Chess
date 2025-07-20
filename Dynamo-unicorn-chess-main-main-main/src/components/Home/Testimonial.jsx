import React, { useRef, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { useQuery } from "react-query";
import { getApi, getApiWithToken } from "../../utils/api";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Testimonial = () => {
    const containerRef = useRef(null);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const scrollPrev = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -540,
                behavior: "smooth",
            });
        }
    };

    const scrollNext = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: 540,
                behavior: "smooth",
            });
        }
    };

    const url = `${import.meta.env.VITE_URL}${
        import.meta.env.VITE_GET_RATINGS
    }`;
    const { data, error, isLoading } = useQuery("GET_RATINGS_LIST", () =>
        getApi(url)
    );

    console.log("API response data:", data);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data</p>;
    }

    if (!data?.data?.ratings || data.data.ratings.length === 0) {
        return <p>No ratings available</p>;
    }

    // console.log(data?.data?.ratings, "hhhhhhhhhhhhhhhkkkkkkkkkkk");

    return (
        <section className="rounded py-5 my-5 bg-[#262522]">
            <div className="">
                <div className="">
                    <div className="max-sm:pt-0 max-sm:text-center px-3 ">
                        <h2 className="text-2xl text-center font-sans font-semibold tracking-tight text-[#fade47] sm:text-3xl">
                            Player Feedback
                        </h2>

                        {/* <p className="mt-4 text-[#dddd23]">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas veritatis illo placeat
                            harum porro optio fugit a culpa sunt id!
                        </p> */}

                        {/* <div className="hidden lg:mt-8 lg:flex lg:gap-4">
                            <button
                                aria-label="Previous slide"
                                id="keen-slider-previous-desktop"
                                className="rounded-full border border-[#86efa5] p-3 text-[#86efa5] transition hover:bg-[#86efa5] hover:text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="size-5 rtl:rotate-180"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                </svg>
                            </button>

                            <button
                                aria-label="Next slide"
                                id="keen-slider-next-desktop"
                                className="rounded-full border border-[#86efa5] p-3 text-[#86efa5] transition hover:bg-[#86efa5] hover:text-white"
                            >
                                <svg
                                    className="size-5 rtl:rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 5l7 7-7 7"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                    />
                                </svg>
                            </button>
                        </div> */}
                    </div>
                    <div className="mt-8 w-full max-sm:w-full">
                        <div className="">
                            <OwlCarousel
                                className="owl-theme"
                                loop={true}
                                margin={3}
                                autoplay={false}
                                autoplayTimeout={3000}
                                autoplaySpeed={2000}
                                items={4}
                                dots={false}
                                nav={false}
                                dotsEach={true}
                                dotData={true}
                                responsive={{
                                    0: {
                                        items: 1,
                                    },
                                    600: {
                                        items: 2,
                                    },
                                    1000: {
                                        items: 4,
                                    },
                                }}
                            >
                                {data.data.ratings.map((item, index) => (
                                    <blockquote
                                        key={index}
                                        className="rounded-lg bg-[#302e2b] mx-2 block shadow-sm p-2  overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-12">
                                                <img
                                                    alt=""
                                                    src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                                                    className="h-full rounded-full"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-center gap-0.5 text-green-500">
                                                    {[...Array(5)].map(
                                                        (star, starIndex) => {
                                                            const ratingValue =
                                                                starIndex + 1;
                                                            const fullStar =
                                                                ratingValue <=
                                                                Math.floor(
                                                                    item.rating
                                                                );
                                                            const halfStar =
                                                                !fullStar &&
                                                                ratingValue -
                                                                    0.5 <=
                                                                    item.rating;
                                                            return (
                                                                <span
                                                                    key={
                                                                        starIndex
                                                                    }
                                                                >
                                                                    {fullStar ? (
                                                                        <FaStar
                                                                            color="#ffc107"
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    ) : halfStar ? (
                                                                        <FaStarHalfAlt
                                                                            color="#ffc107"
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <FaRegStar
                                                                            color="#e4e5e9"
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    )}
                                                                </span>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-lg font-medium text-gray-900">
                                                    {item.userName}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="my-4 text-gray-700 text-xs break-words">
                                            {item.messages}
                                        </p>
                                    </blockquote>
                                ))}
                            </OwlCarousel>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
