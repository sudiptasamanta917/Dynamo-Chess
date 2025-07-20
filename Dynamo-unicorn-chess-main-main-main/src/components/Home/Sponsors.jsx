import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import logo1 from "../../assets/logo/logo1.png";
import logo2 from "../../assets/logo/logo2.png";
import logo3 from "../../assets/logo/logo3.png";
import logo4 from "../../assets/logo/logo4.png";
import logo5 from "../../assets/logo/logo5.png";
import axios from "axios";
function Sponsors() {
    // const [sponserimages,setSponserimages]=useState([])
    const Sponsor = [
        {
            logo: logo1,
        },
        {
            logo: logo2,
        },
        {
            logo: logo3,
        },
        {
            logo: logo4,
        },
        {
            logo: logo5,
        },
    ];
    // useEffect(async()=>{
    //   try {
    //     const response= await axios.get("https://dynamo-unicorn-chess-backend.onrender.com/api/getRule")
    //     if(response){
    //       setSponserimages(response.data.data)
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }

    // },[])
    // console.log(sponserimages,"+++++++++++sponserimages+++++++++++")

    return (
        <>
            <div className="my-2 py-5 bg-[#262522] px-2 relative rounded">
                <div className="">
                    <div className="flex flex-col justify-center">
                        <div className="text-center">
                            <h2 className="font-semibold text-[#fade47] md:text-3xl text-2xl">
                                Our Sponsors
                            </h2>
                            <p className="mx-auto max-w-lg md:text-lg text-md font-semibold my-4 text-[#16a34a]">
                                We are thankful to each and every company
                                sponsored our plugin which helped us to continue
                                working on it.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-h-96">
                    <div>
                        <OwlCarousel
                            className="owl-theme"
                            loop={true}
                            margin={6}
                            autoplay={true}
                            autoplayTimeout={5000}
                            autoplaySpeed={2000}
                            items={1}
                            dots={false}
                            nav={false}
                            dotsEach={true}
                            dotData={true}
                            responsive={{
                                0: {
                                    items: 2,
                                },
                                600: {
                                    items: 3,
                                },
                                1000: {
                                    items: 5,
                                },
                            }}
                        >
                            {Sponsor.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-md"
                                >
                                    <img
                                        loading="lazy"
                                        className="h-40 w-full rounded-md"
                                        src={item.logo}
                                        alt=""
                                    />
                                </div>
                            ))}
                        </OwlCarousel>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sponsors;
