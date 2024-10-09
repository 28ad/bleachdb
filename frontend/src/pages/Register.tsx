import RegLogNavbar from "../components/RegLogNavbar";
import FooterComp from "../components/FooterComp";
import Logo from "../assets/images/bleachdb-logo.webp";
import Characters from "../assets/images/characters/registration-img.webp";
import Ichigo from "../assets/avatars/ichigo-pfp.webp"
// @ts-ignore
import { avatars } from "../data/avatars.js";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { div } from "framer-motion/client";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// @ts-ignore
import { db, auth } from "../server/firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface User {

  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface Status {
  message: string;
  type: string;
}


function Register() {

  const [userCredentials, setUserCredentials] = useState<User>({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  const [statusMessage, setStatusMessage] = useState<Status>({
    message: '',
    type: ''
  });

  let popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    let handler = (e: any) => {

      if (!popupRef.current?.contains(e.target)) {
        setShowAvatarPopup(false);
      }
    }

    document.addEventListener("mousedown", handler);
  })

  const [showAvatarPopup, setShowAvatarPopup] = useState(false);

  // prevent form from submitting when clicking a button
  const preventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }

  // toggle avatar selection popup

  const toggleAvatarPopup = () => {
    setShowAvatarPopup(!showAvatarPopup);
  }

  const infoNotification = () => {

    toast.info(statusMessage.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",

    });

  }

  const successNotification = () => {

    toast.success(statusMessage.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",

    });

  }

  const errorNotification = () => {

    toast.error(statusMessage.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",

    });
  }

  useEffect(() => {

    if (statusMessage.type === 'info') {
      infoNotification();

    }
    else if (statusMessage.type === 'success') {

      successNotification();

    } else if (statusMessage.type === 'error') {
      errorNotification();
    }

  }, [statusMessage])

  // set user avatar
  const selectAvatar = (avatar: any) => {

    setSelectedAvatar(avatar);

  }

  useEffect(() => {
    console.log(selectedAvatar);
  }, [selectedAvatar])

  const validateEmail = (email: string) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  const validateForm = () => {

    if (userCredentials.email === '' || userCredentials.username === '' || userCredentials.password === '') {
      setStatusMessage({ message: 'All fields must be completed !', type: 'error' });
      return false;
    }

    if (!validateEmail(userCredentials.email)) {
      setStatusMessage({ message: 'You must insert a valid email address !', type: 'error' });
      return false;
    }

    if (userCredentials.password !== userCredentials.confirmPassword) {
      setStatusMessage({ message: 'Passwords do not match !', type: 'error' });
      return false;
    }

    return true;

  }

  // register user and send credentials tu firebase db
const registerUser = () => {
  // If no avatar is selected, set the default avatar first
  if (selectedAvatar === '') {
    setSelectedAvatar(Ichigo);
  }

  // After setting the avatar, proceed with registration (after a slight delay to ensure state update)
  setTimeout(() => {
    if (!validateForm()) {
      return;
    }

    // Now the registration process can proceed with the ensured value of selectedAvatar
    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            username: userCredentials.username,
            email: user.email,
            password: userCredentials.password,
            avatar_path: selectedAvatar || Ichigo // Just to ensure we have a value here
          });
          setStatusMessage({ message: 'Registration successful!', type: 'success' });
        } catch (e) {
          setStatusMessage({ message: 'Error adding document: ' + e, type: 'error' });
        }
      })
      .catch((error) => {
        setStatusMessage({ message: error.message, type: 'error' });
      });
  }, 0); // Slight delay to allow setState to update before running validateForm and continuing
};


  return (
    <>

      <div className="min-h-screen flex flex-col">

        <RegLogNavbar />

        {/* Main content */}

        <div className="flex-grow flex justify-evenly items-start pb-10">

          {/* characters image + logo */}

          <div className="hidden lg:flex flex-col items-center justify-center w-full pt-10">
            <img src={Logo} className="w-[400px]" />

            <img src={Characters} className="mt-10 max-h-[356px]"/>
          </div>

          {/* registration form */}
          <div className="flex flex-col justify-center items-center w-full pt-10">

            <form onSubmit={(e) => preventSubmit(e)} className="w-3/4 md:w-2/4 lg:w-7/12 xl:w-9/12 pb-8 box-content px-8 shadow-md rounded-md bg-gray-50">

              <div className="flex flex-col items-center justify-between gap-y-10 ">
                {/* header */}
                <div className="flex justify-center w-full bg-blue-800 box-content px-8 rounded-t-md">
                  <h1 className="text-3xl font-bold text-white  py-4">SIGN UP</h1>
                </div>

                {/* inputs */}
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-x-4 items-center gap-y-4">
                  <div className="flex flex-col w-[250px] xl:w-5/12">
                    <label htmlFor="username" className="font-bold">Username:</label>
                    <input
                      onChange={(e) => { setUserCredentials({ ...userCredentials, username: e.target.value }) }}
                      className="h-10 xl:w-full pl-2 text-xl placeholder:text-xl border-2 border-gray-500 rounded-sm outline-none focus:border-2 focus:rounded-md focus:border-blue-400 transition-all duration-300"
                      type="text"
                      name="username"
                      id="username"
                      placeholder="Username"
                    />
                  </div>

                  <div className="flex flex-col w-[250px] xl:w-5/12">
                    <label htmlFor="email" className="font-bold">Email:</label>
                    <input
                      onChange={(e) => { setUserCredentials({ ...userCredentials, email: e.target.value }) }}
                      className="h-10 xl:w-full pl-2 text-xl placeholder:text-xl border-2 border-gray-500 rounded-sm outline-none focus:border-2 focus:rounded-md focus:border-blue-400 transition-all duration-300"
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email"
                    />
                  </div>

                  <div className="flex flex-col w-[250px] xl:w-5/12">
                    <label htmlFor="password" className="font-bold">Password:</label>
                    <input
                      onChange={(e) => { setUserCredentials({ ...userCredentials, password: e.target.value }) }}
                      className="h-10 xl:w-full pl-2 text-xl placeholder:text-xl border-2 border-gray-500 rounded-sm outline-none focus:border-2 focus:rounded-md focus:border-blue-400 transition-all duration-300"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                    />
                  </div>

                  <div className="flex flex-col w-[250px] xl:w-5/12">
                    <label htmlFor="confPassword" className="font-bold">Confirm Password:</label>
                    <input
                      onChange={(e) => { setUserCredentials({ ...userCredentials, confirmPassword: e.target.value }) }}
                      className="h-10 xl:w-full pl-2 text-xl placeholder:text-xl border-2 border-gray-500 rounded-sm outline-none focus:border-2 focus:rounded-md focus:border-blue-400 transition-all duration-300"
                      type="password"
                      name="confPassword"
                      id="confPassword"
                      placeholder="Confirm Password"
                    />
                  </div>

                  <div className="flex flex-col items-center xl:items-start w-full relative xl:left-[7%]">
                    <button
                      onClick={toggleAvatarPopup}
                      className="bg-blue-800 hover:bg-blue-900 rounded-sm text-white font-bold cursor-pointer h-10 w-[250px] xl:w-[150px]">
                      SELECT AVATAR
                    </button>

                    {showAvatarPopup &&

                      <div ref={popupRef} className="absolute xl:left-40 w-96 h-72 bg-gray-200 overflow-y-scroll flex justify-center">

                        <div className="grid grid-cols-2 gap-y-10 gap-x-10 px-10 my-10">

                          {/* each avatar */}
                          {avatars.map((avatar: any, index: any) => (

                            <div key={index} onClick={() => {selectAvatar(avatar.path)}}>
                              <img className="cursor-pointer" src={avatar.path} />
                            </div>
                          ))}

                        </div>
                      </div>
                    }
                  </div>

                </div>

                {/* footer */}
                <div>
                  <button
                    onClick={registerUser}
                    className="bg-blue-800 hover:bg-blue-900 rounded-sm text-white font-bold cursor-pointer h-10 w-[250px]">
                    REGISTER NOW
                  </button>
                </div>

                {/* login redirect */}

                <div>
                  <h1 className="font-semibold">Already have an account ? <Link to="/login" className="font-bold text-blue-900 cursor-pointer">Login here</Link></h1>
                </div>

              </div>
            </form>
          </div>

        </div>

        {/* Footer always at the bottom */}
        <FooterComp />

      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </>
  );
}

export default Register;
