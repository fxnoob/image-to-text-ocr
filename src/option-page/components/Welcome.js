import React, { useState } from "react";
import constants from "../../../constants";
import firebaseService from "../../services/firebaseService";
import dbService from "../../services/dbService";
import Button from "@material-ui/core/Button";

export default function Welcome() {
  const [loggedIn, setLoggedIn] = useState(false);
  const login = async () => {
    try {
      const user = await firebaseService.getUser();
      console.log({ user });
      await dbService.set({ isAuthenticated: true });
      setLoggedIn(true);
    } catch (e) {
      await dbService.set({ isAuthenticated: false });
      setLoggedIn(false);
    }
  };
  return (
    <div
      className="h-screen pb-14 bg-right bg-cover"
      style={{ backgroundImage: "url('images/bg.svg')" }}
    >
      {/*Nav*/}
      <div className="w-full container mx-auto p-6">
        <div className="w-full flex items-center justify-between">
          <a
            className="flex items-center no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
            href="#"
            style={{ color: "var(--main-color)" }}
          >
            {constants.appConfig.appName}
          </a>
          <div className="flex w-1/2 justify-end content-center">
            <a className="inline-block text-blue-300 no-underline hover:text-indigo-800 hover:text-underline text-center h-10 p-2 md:h-auto md:p-4">
              <svg
                className="fill-current h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 6c-3.313 0-6 2.686-6 6 0 2.651 1.719 4.9 4.104 5.693.3.056.396-.13.396-.289v-1.117c-1.669.363-2.017-.707-2.017-.707-.272-.693-.666-.878-.666-.878-.544-.373.041-.365.041-.365.603.042.92.619.92.619.535.917 1.403.652 1.746.499.054-.388.209-.652.381-.802-1.333-.152-2.733-.667-2.733-2.965 0-.655.234-1.19.618-1.61-.062-.153-.268-.764.058-1.59 0 0 .504-.161 1.65.615.479-.133.992-.199 1.502-.202.51.002 1.023.069 1.503.202 1.146-.776 1.648-.615 1.648-.615.327.826.121 1.437.06 1.588.385.42.617.955.617 1.61 0 2.305-1.404 2.812-2.74 2.96.216.186.412.551.412 1.111v1.646c0 .16.096.347.4.288 2.383-.793 4.1-3.041 4.1-5.691 0-3.314-2.687-6-6-6z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/*Main*/}
      <div className="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        {/*Left Col*/}
        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
          <h1
            className="my-4 text-3xl md:text-5xl font-bold leading-tight text-center md:text-left slide-in-bottom-h1"
            style={{ color: "var(--main-color)" }}
          >
            Extract text from any page/pdf on the internet
          </h1>
          <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left slide-in-bottom-subtitle">
            {loggedIn ? (
              "Let's go!"
            ) : (
              <Button
                style={{ background: "var(--main-color)" }}
                onClick={login}
                style={{ fontSize: "1.5rem", textDecoration: "underline" }}
                className="btn-lite"
              >
                Login
              </Button>
            )}
          </p>
          <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left slide-in-bottom-subtitle">
            <a
              style={{ textDecoration: "underline" }}
              href={constants.support.howToVideoLink}
            >
              {" "}
              Watch Tutorial{" "}
            </a>
          </p>
        </div>
        {/*Right Col*/}
        <div className="w-full xl:w-3/5 py-6 overflow-y-hidden">
          <img
            className="w-5/6 mx-auto lg:mr-0 slide-in-bottom"
            src="images/devices.svg"
          />
        </div>
        {/*Footer*/}
        <div className="w-full pt-16 pb-6 text-sm text-center md:text-left fade-in">
          <a className="text-gray-500 no-underline hover:no-underline" href="#">
            copyright - Image to Text pro@ 2021
          </a>
        </div>
      </div>
    </div>
  );
}
