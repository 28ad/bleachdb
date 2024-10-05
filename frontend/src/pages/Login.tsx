import RegLogNavbar from "../components/RegLogNavbar";
import FooterComp from "../components/FooterComp";
import Logo from "../assets/images/bleachdb-logo.webp";
import Ichigo from "../assets/images/characters/ichigo-login.png";
import Yamamoto from "../assets/images/characters/yamamoto.png";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { div } from "framer-motion/client";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// @ts-ignore
import { db, auth } from "../server/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


interface User {

  email: string;
  password: string;

}

interface Status {
  message: string;
  type: string;
}


function Login() {

  const [userCredentials, setUserCredentials] = useState<User>({
    email: '',
    password: '',

  });

  const [statusMessage, setStatusMessage] = useState<Status>({
    message: '',
    type: ''
  });

  // prevent form from submitting when clicking a button
  const preventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const validateForm = async () => {

    if (userCredentials.email === '' || userCredentials.password === '') {
      setStatusMessage({ message: 'All fields must be completed !', type: 'error' });
      return false;
    }

    if (!validateEmail(userCredentials.email)) {
      setStatusMessage({ message: 'You must insert a valid email address !', type: 'error' });
      return false;
    }

    return true;

  }

  // add user details to firebase db
  const loginUser = () => {

    if (!validateForm()) {
      return;
    }

    // call function to authenticate user details
    signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        window.location.href = "/";
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);

        if (errorCode === "auth/invalid-credential") {
          setStatusMessage({message: "Invalid credentials ! Your email or password is incorrect.", type: "error"})
        } else {
          setStatusMessage({message: errorMessage, type: "error"});
        }
        
      });

    console.log(userCredentials);

  }

  return (
    <>

      <div className="min-h-screen flex flex-col">

        <RegLogNavbar />

        {/* Main content */}

        <div className="flex-grow flex justify-evenly items-start pb-10">

          {/* registration form */}
          <div className="flex flex-col justify-center items-center w-full pt-10">

            <form onSubmit={(e) => preventSubmit(e)} className="w-3/4 md:w-2/4 lg:w-7/12 pb-8 box-content px-8 shadow-md rounded-md bg-gray-50">

              <div className="flex flex-col items-center justify-between gap-y-10 ">
                {/* header */}
                <div className="flex justify-center w-full bg-blue-800 box-content px-8 rounded-t-md">
                  <h1 className="text-3xl font-bold text-white  py-4">SIGN IN</h1>
                </div>

                {/* inputs */}
                <div className="flex flex-col w-full gap-x-4 items-center gap-y-4">

                  <div className="flex flex-col w-[250px] xl:w-9/12">
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

                  <div className="flex flex-col w-[250px] xl:w-9/12">
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

                </div>

                {/* footer */}
                <div>
                  <button
                    onClick={loginUser}
                    className="bg-blue-800 hover:bg-blue-900 rounded-sm text-white font-bold cursor-pointer h-10 w-[250px]">
                    LOGIN
                  </button>
                </div>

                {/* login redirect */}

                <div>
                  <h1 className="font-semibold">Don't have an account yet ? <Link to="/register" className="font-bold text-blue-900 cursor-pointer">Register</Link></h1>
                </div>

              </div>
            </form>
          </div>

          {/* characters image + logo */}

          <div className="hidden lg:flex flex-col items-center justify-center w-full pt-10">
            <img src={Logo} className="w-[400px] relative" />

            <img src={Ichigo} className="max-h-[350px]" />
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

export default Login;
