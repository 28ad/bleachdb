import Logo from '../assets/images/bleachdb-logo.webp'
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// @ts-ignore
import {auth, db} from "../server/firebase";

import { DocumentData } from "firebase/firestore";
import { signOut } from 'firebase/auth';

import { div } from 'framer-motion/client';


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



function Navbar({ user, isAuth }: DocumentData) {

    let popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        let handler = (e: any) => {

            if (!popupRef.current?.contains(e.target)) {
                setOpenAccountMenu(false);
            }
        }

        document.addEventListener("mousedown", handler);
    })

    const loggedInUser = user;

    const userDeviceWidth = useWindowSize();

    const [openAccountMenu, setOpenAccountMenu] = useState(false);

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

    const toggleAccountMenu = () => {

        setOpenAccountMenu(!openAccountMenu);

    }

    const menuLinks = [
        {
            name: 'home',
            path: '/',
        },
        {
            name: 'characters',
            path: '/characters',
        },
        {
            name: 'sign up',
            path: '/register',
        },
        {
            name: 'login',
            path: '/login',
        },

    ]

    const Logout = () => {

        signOut(auth).then(() => {
            // Sign-out successful.
            window.location.href = "/login";
        }).catch((error) => {
            // An error happened.
            alert(error);
        });
    }

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
                <div className='hidden md:flex md:items-center' style={{ paddingRight: isAuth ? '48px' : '0' }}>

                    {/* search bar */}
                    <div className='hidden md:flex md:items-center px-2'>
                        <SearchBar />
                    </div>

                    {menuLinks
                        .filter(link => {
                            // exclude register and login if user is signed in

                            if (isAuth && (link.name === "login" || link.name === "sign up")) {
                                return false;
                            }
                            return true;
                        })
                        .map((link, index) => (

                            <Link key={index} to={link.path} className='capitalize text-white font-semibold px-2 mx-1 cursor-pointer text-center hover:border-b-4 hover:border-red-600 transition-all duration-300 ease-in-out'>{link.name}</Link>
                        ))}

                </div>

                {/* my account menu if user is signed in */}
                {isAuth &&
                    <div
                        onClick={toggleAccountMenu}
                        className='absolute right-2 flex flex-col items-center justify-center'>

                        <div className='w-10 h-10 rounded-full bg-white cursor-pointer'></div>

                    </div>}

                {/*  popup menu */}
                {openAccountMenu &&
                    <>
                        {/* menu */}
                        <div ref={popupRef} className='absolute w-64 top-28 right-1 z-10 bg-white border-2 border-gray-200 flex flex-col items-center'>

                            {/* user general info */}
                            <div className='flex flex-col items-center justify-center py-3 border-b w-10/12'>
                                {/* avatar + username */}
                                <div className='flex jusitfy-center items-center'>

                                    <div className='w-10 h-10 rounded-full bg-gray-200 cursor-pointer'></div>
                                    <span className='font-semibold pl-2'>{loggedInUser.username}</span>
                                </div>
                                {/* email */}
                                <div>
                                    <span className='font-semibold pl-2'>{loggedInUser.email}</span>
                                </div>
                            </div>

                            {/* menu options */}
                            <div className='flex flex-col items-center w-full gap-y-2 py-2'>

                                <div className='flex items-center justify-center gap-x-1 hover:bg-gray-100 py-3 w-full cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>

                                    <Link className='font-semibold' to="/account">My Account</Link>
                                </div>

                                <hr className='w-7/12 h-[1.5px] bg-gray-50'/>

                                <div className='flex items-center justify-center gap-x-1 hover:bg-gray-100 py-3 w-full cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>

                                    <Link className='font-semibold' to="/account">Settings</Link>
                                </div>

                                <hr className='w-7/12 h-[1.5px] bg-gray-50'/>

                                <div onClick={Logout} className='flex items-center justify-center gap-x-1 hover:bg-gray-100 py-3 w-full cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>
                                    <span className='font-semibold'>Logout</span></div>

                            </div>

                        </div>

                        {/* triangle detail */}
                        <div className='w-6 h-6 bg-white absolute top-[100px] right-4 rotate-45 border-t-2 border-l-2 z-20'>

                        </div>
                    </>
                }

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

                        {menuLinks
                            .filter(link => {

                                if (isAuth && (link.name === "login" || link.name === "sign up")) {
                                    return false;
                                }

                                return true;
                            })
                            .map((link, index) => (

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