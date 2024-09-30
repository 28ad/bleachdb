import RegLogNavbar from "../components/RegLogNavbar";
import FooterComp from "../components/FooterComp";

import Kenpachi from "../assets/images/characters/kenpachi.png";
import Yamamoto from "../assets/images/characters/yamamoto.png";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { div } from "framer-motion/client";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// @ts-ignore
import { db, auth } from "../server/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; 

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

  const [selectedAvatar, setSelectedAvatar] = useState();

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
      setStatusMessage({message: 'You must insert a valid email address !', type: 'error'});
      return false;
    }

    if (userCredentials.password !== userCredentials.confirmPassword) {
      setStatusMessage({message: 'Passwords do not match !', type: 'error'});
      return false;
    }

    return true;

  }

  // add user details to firebase db
  const registerUser = () => {

    if (!validateForm()) {
      return;
    } 

    // call function to save user to firebase
    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
  .then(async (userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user);
    
    // save user data to firestore db
    try {
      const docRef = await addDoc(collection(db, "users"), {
        uid: user.uid,
        username: userCredentials.username,
        email: user.email,
        password: userCredentials.password
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setStatusMessage({message: errorMessage, type: 'error'});
    // ..
  });
    console.log(userCredentials);
  }

  return (
    <>

      <div className="min-h-screen flex flex-col">

        {/* Main content */}

        <div className="flex-grow">

          <RegLogNavbar />

          {/* registration form */}
          <div className="flex flex-col justify-center items-center relative ">

            {/* character images */}
            {/* <img src={Yamamoto} className="hidden xl:block absolute xl:w-[350px] 2xl:w-[400px] left-2" />
            <img src={Kenpachi} className="hidden xl:block absolute xl:w-[300px] 2xl:w-[350px] right-2" /> */}

            <form onSubmit={(e) => preventSubmit(e)} className="w-3/4 md:w-2/4 lg:w-5/12 pb-8 box-content px-8 shadow-md rounded-md bg-gray-50 my-24 border border-blue-400">

              <div className="flex flex-col items-center justify-between gap-y-10 ">
                {/* header */}
                <div className="flex justify-center w-full bg-blue-800 box-content px-8 rounded-t-md">
                  <h1 className="text-3xl font-bold text-white  py-4">SIGN UP</h1>
                </div>

                {/* inputs */}
                <div className="flex flex-col xl:flex-row xl:flex-wrap xl:justify-center gap-x-4 items-center gap-y-4">
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

                  <div className="flex flex-col items-center xl:items-start w-full relative xl:left-11">
                    <button
                      onClick={toggleAvatarPopup}
                      className="bg-blue-800 hover:bg-blue-900 rounded-sm text-white font-bold cursor-pointer h-10 w-[250px] xl:w-[150px]">
                      SELECT AVATAR
                    </button>

                    {showAvatarPopup &&

                      <div ref={popupRef} className="absolute xl:left-40 w-80 h-72 bg-gray-200 overflow-y-scroll flex justify-center">

                        <div className="grid grid-cols-2 gap-10 my-10">

                          {/* each avatar */}
                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

                          <div className="w-20 h-20 border border-black">

                          </div>

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
