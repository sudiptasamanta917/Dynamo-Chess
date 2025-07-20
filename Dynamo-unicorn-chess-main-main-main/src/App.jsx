import { Suspense, lazy, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-toastify/dist/ReactToastify.css';

import bg from './assets/bg3.jpg'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Multiplayer from './pages/multiplayer/Multiplayer';
import Tournaments from './pages/Tournaments';
import Playwithfriend from './pages/Playwithfriend';
import './globalInit'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from 'react-toastify';
import BlogList from './pages/blogPage/blog';
import Blogdetails from './pages/blogPage/blogdetails';
import PlayerList from './pages/blogPage/player';
import Pieces from './pages/blogPage/pieces';
import Puzzle from './pages/puzzle/Puzzle';
import ProtectRoute from './components/auth/ProtectRoute';
import Trainer from './pages/Trainer';
import Profile from './pages/Profile';
import Games from './pages/Games';
import LeaveRoomWarning from './components/LeaveRoomWarning';
import './globalInit'
import socket from './pages/multiplayer/socket';
import { getUserdata } from './utils/getuserdata';
import { getApi, getApiWithToken } from './utils/api';
import Userprofile from './pages/Userprofile';
import AnalysisBoard from './pages/AnalysisBoard/AnalysisBoard';
import LiveTournamentDetail from './pages/LiveTournamentDetail';
import { useDispatch } from 'react-redux';
import { GameStatus } from './redux/action';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsCondition from './pages/TermsCondition';
import RefundCancelation from './pages/RefundCancelation';
import ProductList from './pages/product/ProductList';
import Checkout from './pages/product/Checkout';
import AccountDeleteForm from './pages/auth/AccountDelete';
import CompanyReview from './pages/CompanyReview';
import GameReview from './pages/GameReview';
import AuthenticationSuccess from './pages/AuthenticationSuccess';
// import Contact from "./pages/Contact"
const Header = lazy(() => import("./components/Header"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Passwordreset = lazy(() => import("./pages/auth/Passwordreset"));
const Chess8by8 = lazy(() => import("./pages/lichess/1by1/chess8by8"));
const LoginByEmail = lazy(() => import("./pages/auth/Loginbyemail"));
const Footer = lazy(() => import("./components/Footer"));
const ChessLearn = lazy(() => import("./pages/ChessLearn"));
const TournamentDetail = lazy(() => import("./pages/TournamentDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const RateUs = lazy(() => import("./pages/RateUs"));

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const dispatch=useDispatch();
  const navigate = useNavigate();
  const UserDetail = JSON.parse(localStorage.getItem("User Detail"));
  const location=useLocation();
  const isMultiplayerPresent = location.pathname.includes('multiplayer');
  // if(!isMultiplayerPresent){
  //   dispatch(GameStatus(false))
  // }
  

  let user
  if (localStorage.getItem('chess-user-token')) {
    user = true
  } else {
    user = false
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PROFILE}`;
        let id = localStorage.getItem("device_id");
        const userdata = await getApiWithToken(url);
        // console.log(userdata, "userdata", userdata?.data?.deviceId === id);
        
       
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, [navigate]); // Empty dependency array ensures it runs only once
  
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PROFILE}`;
        let id = localStorage.getItem("device_id");
        const userdata = await getApiWithToken(url);
  // console.log(userdata,"userdata" , userdata?.data?.deviceId === id);
  
        if (userdata?.data?.blocked === true) {
         localStorage.clear();
          // Refresh the page and navigate to the home page
          navigate("/"); // Use navigate directly here
          window.location.reload(); // Reload if needed (optional, but usually unnecessary with navigation)
        }
        else if (userdata?.data?.deviceId && userdata?.data?.deviceId !== id) {
          localStorage.clear();
          window.location.href = '/'; // Navigate to the home page
        }
      }
      catch (error) {
        console.error("Error fetching user data:", error);
      } 
    };
  
    const fetchActivityData = async () => {
      try {
        const userId = UserDetail?._id; // Assuming UserDetail is available in the scope
        if (userId) {
          const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_ACTIVITY}/${userId}`;
          await getApi(url); // Assuming getApi fetches data and no further processing is required
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };
  
    // Call both functions in parallel
    fetchUserData();
    fetchActivityData();
  }, [navigate]);
  



  // console.log(user, "iiu=>>>>>>>>!!!!!!");


  const queryClient = new QueryClient();
  // const [pageAccessedByReload, setPageAccessedByReload] = useState(false);

  // useEffect(() => {
  //   const checkPageAccess = () => {
  //     setPageAccessedByReload(
  //       window.performance &&
  //       (window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD ||
  //         window.performance.getEntriesByType('navigation').map((nav) => nav.type).includes('reload'))
  //     );
  //   };

  //   checkPageAccess();

  //   // Optionally, you can clear the state on component unmount
  //   return () => {
  //     setPageAccessedByReload(false);
  //   };
  // }, []);
  // console.log(pageAccessedByReload,"zzzzzzzzzzzzzzz");
  return (
      <>
          <div className={`pt-32 min-h-screen bg-[#302e2b] pl-44 2xl:pl-0`}>
              <div className={`max-w-[1200px] m-auto`}>
                  {/* <div id="google_translate_element"></div> */}
                  {<LeaveRoomWarning />}

                  <QueryClientProvider client={queryClient}>
                      <div
                          className=""
                          // style={{
                          //     background: `url(${bg}) cover/center no-repeat fixed`,
                          // }}
                      >
                          <Suspense fallback={<div>Loading...</div>}>
                              <Header
                                  isSidebarOpen={isSidebarOpen}
                                  setIsSidebarOpen={setIsSidebarOpen}
                              />
                          </Suspense>
                          <div className="pt-0 transition-all duration-300">
                              <Suspense fallback={<div>Loading...</div>}>
                                  <Routes>
                                      <Route
                                          element={<ProtectRoute user={user} />}
                                      >
                                          {/* <Route path='/' element={<Home />} /> */}
                                          {/* <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forget' element={<Passwordreset />} />
              <Route path='/loginbyemail' element={<LoginByEmail />} /> */}
                                          {/* <Route path='/chess8by8' element={<Chess8by8 />} /> */}
                                          {/* <Route path='/multiplayer/:time' element={<Multiplayer />} /> */}
                                          <Route
                                              path="/multiplayer/:roomId/:time"
                                              element={<Multiplayer />}
                                          />
                                          <Route
                                              path="/trainer"
                                              element={<Trainer />}
                                          />
                                          <Route
                                              path="/profile"
                                              element={<Profile />}
                                          />
                                          <Route
                                              path="/userprofile/:userId"
                                              element={<Userprofile />}
                                          />
                                          {/* <Route path='/tournaments' element={<Tournaments />} /> */}

                                          {/* <Route path='/chessLearn' element={<ChessLearn />} /> */}
                                          {/* <Route path='/TournamentDetail' element={<TournamentDetail />} /> */}
                                          {/* <Route path='/playwithfriend' element={<Playwithfriend />} /> */}
                                          {/* <Route path='/blog' element={<BlogList />} /> */}
                                          {/* <Route path='/puzzle' element={<Puzzle />} /> */}
                                          {/* <Route path='/blog' element={<BlogList />} /> */}
                                          {/* <Route path='/contact' element={<Contact />} /> */}
                                          {/* <Route path='/about' element={<AboutUs />} /> */}
                                          {/* <Route path='/rate' element={<RateUs />} /> */}
                                      </Route>
                                      <Route path="/" element={<Home />} />

                                      {/* <Route path='/register' element={<Register />} />
              <Route path='/forget' element={<Passwordreset />} />
              <Route path='/loginbyemail' element={<LoginByEmail />} /> */}
                                      <Route
                                          path="/chess10by10"
                                          element={<Chess8by8 />}
                                      />
                                      <Route
                                          path="/tournaments"
                                          element={<Tournaments />}
                                      />

                                      <Route
                                          path="/chessLearn"
                                          element={<ChessLearn />}
                                      />
                                      <Route
                                          path="/TournamentDetail"
                                          element={<TournamentDetail />}
                                      />
                                      <Route
                                          path="/LiveTournamentDetail/:id"
                                          element={<LiveTournamentDetail />}
                                      />
                                      <Route
                                          path="/playwithfriend/:time"
                                          element={<Playwithfriend />}
                                      />
                                      <Route
                                          path="/blog"
                                          element={<BlogList />}
                                      />
                                      <Route
                                          path="/puzzle"
                                          element={<Puzzle />}
                                      />
                                      <Route
                                          path="/blog"
                                          element={<BlogList />}
                                      />
                                      <Route
                                          path="/player"
                                          element={<PlayerList />}
                                      />
                                      <Route
                                          path="/blogdetails"
                                          element={<Blogdetails />}
                                      />
                                      <Route
                                          path="/pieces"
                                          element={<Pieces />}
                                      />
                                      <Route
                                          path="/contact"
                                          element={<Contact />}
                                      />
                                      <Route
                                          path="/aboutUs"
                                          element={<AboutUs />}
                                      />
                                      <Route
                                          path="/Games"
                                          element={<Games />}
                                      />
                                      <Route
                                          path="/rate"
                                          element={<RateUs />}
                                      />
                                      <Route
                                          path="/analysisBoard/:roomId"
                                          element={<AnalysisBoard />}
                                      />
                                      <Route
                                          path="/productList/"
                                          element={<ProductList />}
                                      />
                                      <Route
                                          path="/Checkout/:id"
                                          element={<Checkout />}
                                      />
                                      <Route
                                          path="/deleteAccount"
                                          element={<AccountDeleteForm />}
                                      />
                                      <Route
                                          path="/companyReview"
                                          element={<CompanyReview />}
                                      />
                                      <Route
                                          path="/gameReview"
                                          element={<GameReview />}
                                      />
                                  </Routes>
                              </Suspense>
                              <Suspense fallback={<div>Loading...</div>}>
                                  <Routes>
                                      <Route
                                          path="/privacy"
                                          element={<PrivacyPolicy />}
                                      />
                                      <Route
                                          path="/auth-success"
                                          element={<AuthenticationSuccess />}
                                      />
                                      <Route
                                          path="/termsCondition"
                                          element={<TermsCondition />}
                                      />
                                      <Route
                                          path="/refundCancelationPolicy"
                                          element={<RefundCancelation />}
                                      />
                                      <Route
                                          path="/register"
                                          element={
                                              <ProtectRoute
                                                  user={!user}
                                                  redirect="/"
                                              >
                                                  <Register />
                                              </ProtectRoute>
                                          }
                                      />
                                      <Route
                                          path="/login"
                                          element={
                                              <ProtectRoute
                                                  user={!user}
                                                  redirect="/"
                                              >
                                                  <Login />
                                              </ProtectRoute>
                                          }
                                      />
                                  </Routes>
                              </Suspense>
                          </div>
                          <div
                              className={`mt-10`}
                          >
                                  <Suspense fallback={<div>Loading...</div>}>
                                      <Footer />
                                  </Suspense>
                          </div>
                      </div>
                      <ReactQueryDevtools initialIsOpen={false} />
                  </QueryClientProvider>
              </div>
              {/* <ToastContainer /> */}
          </div>
      </>
  );
}

export default App
