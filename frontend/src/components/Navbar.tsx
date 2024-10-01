import Logo from '../assets/images/bleachdb-logo.webp'
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

function useWindowSize() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
  
      // Add event listener to handle window resize
      window.addEventListener('resize', handleResize);
  
      // Clean up the event listener on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowWidth;
  }

function Navbar() {

    const userDeviceWidth = useWindowSize();

    // check user's device width and fore shuts menu off if not on mobile
    const checkUserDeviceWidth = () => {

        if (userDeviceWidth > 768) {
            setOpenMenu(false);
        }
    }

    useEffect(() => {   
        checkUserDeviceWidth();
    }, [userDeviceWidth])

    const [openMenu, setOpenMenu] = useState(false);

    const toggleMenu = () => {

        setOpenMenu(!openMenu);
    }

    const menuLinks = [
        {
            name: 'home',
            path: '/'
        },
        {
            name: 'characters',
            path: '/characters'
        },
        {
            name: 'sign up',
            path: '/register'
        },
        {
            name: 'login',
            path: '/login'
        },

    ]

    return (

        <>
            <nav className="w-full bg-blue-800 h-24 flex justify-center items-center md:justify-between px-4 overflow-y-hidden shadow-md">

                <div className=''>

                    {/* toggle menu icon */}
                    <div className='absolute left-2 top-6 md:hidden'>
                        {openMenu ? (

                            <>
                                <svg
                                    onClick={toggleMenu}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-10 cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>

                            </>

                        ) : (

                            <>
                                <svg
                                    onClick={toggleMenu}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="size-10 cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                                </svg>
                            </>
                        )}

                    </div>

                    {/* logo */}
                    <img src={Logo} className='w-64' />

                </div>

                {/* navlinks for desktop */}
                <div className='hidden md:flex md:items-center'>

                    {/* search bar */}
                    <div className='hidden md:flex md:items-center px-2'>
                        <SearchBar />
                    </div>

                    {menuLinks.map((link, index) => (
                        <Link key={index} to={link.path} className='capitalize text-white font-semibold px-2 mx-1 cursor-pointer text-center hover:border-b-4 hover:border-red-600 transition-all duration-300 ease-in-out'>{link.name}</Link>
                    ))}

                </div>

            </nav>

            {/* hamburger menu */}
            <AnimatePresence>
                {openMenu && 
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.25,
                                    duration: 0.5
                                },
                            },
                        }}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        className="relative top-0 w-full py-4 bg-blue-800 flex flex-col justify-center items-center border-t-[1px] border-blue-300">

                        {/* search bar */}
                        <div className='flex md:hiddne md:items-center px-2 mb-4'>
                            <SearchBar />
                        </div>

                        {menuLinks.map((link, index) => (

                            <motion.div
                                key={index}
                                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                                className='py-2 capitalize text-white font-semibold hover:bg-blue-700 w-full text-center'>
                                <Link to={link.path} className="text-xl">{link.name}</Link>
                            </motion.div>

                        ))}



                    </motion.div>}
            </AnimatePresence>
        </>
    )
}

export default Navbar;