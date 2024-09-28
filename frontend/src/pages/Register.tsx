import Navbar from "../components/Navbar";
import FooterComp from "../components/FooterComp";
import Kenpachi from "../assets/images/characters/kenpachi.png";
import Yamamoto from "../assets/images/characters/yamamoto.png";
import { useState } from "react";

function Characters() {
  return (
    <>
      <div className="min-h-screen flex flex-col">

        {/* Main content */}
        
        <div className="flex-grow">
          <Navbar />

          {/* registration form */}
          <div className="flex flex-col justify-center items-center relative">
            {/* character images */}
            <img src={Yamamoto} className="hidden xl:block absolute xl:w-[350px] 2xl:w-[400px] left-2" />
            <img src={Kenpachi} className="hidden xl:block absolute xl:w-[300px] 2xl:w-[350px] right-2" />

            <form className="w-3/4 md:w-2/4 lg:w-5/12 pb-8 shadow-md rounded-md bg-gray-50 my-24">
              <div className="flex flex-col items-center justify-between gap-y-10">
                {/* header */}
                <div className="flex justify-center w-full bg-blue-800 rounded-t-md">
                  <h1 className="text-3xl font-bold text-white  py-4">SIGN UP</h1>
                </div>

                {/* inputs */}
                <div className="flex flex-col xl:flex-row xl:flex-wrap xl:justify-center gap-x-4 items-center gap-y-4">
                  <div className="flex flex-col w-[250px] xl:w-5/12">
                    <label htmlFor="username" className="font-bold">Username:</label>
                    <input
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
                      className="h-10 xl:w-full pl-2 text-xl placeholder:text-xl border-2 border-gray-500 rounded-sm outline-none focus:border-2 focus:rounded-md focus:border-blue-400 transition-all duration-300"
                      type="password"
                      name="confPassword"
                      id="confPassword"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>

                {/* footer */}
                <div>
                  <button className="bg-blue-800 hover:bg-blue-900 rounded-sm text-white font-bold cursor-pointer h-10 w-[250px]">
                    REGISTER NOW
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer always at the bottom */}
        <FooterComp />
      </div>
    </>
  );
}

export default Characters;
