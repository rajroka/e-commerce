"use client";
import { FaUserMd } from "react-icons/fa";
import { IoMdCart, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MdSearch } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import Logintoggle from "./LoginModal";
const Nav = () => {

    const [isLogin, setIsLogin] = useState(false);
       
    return (
      <div className="w-full px-6 md:px-12 lg:px-24 bg-white text-black ">
        <div className="flex items-center justify-between h-20 ">
          {/* Logo + Search */}
          <div className="flex flex-col-reverse w-full md:flex-row md:items-center gap-2 md:gap-8">
            <span className="font-bold text-2xl md:text-3xl lg:text-4xl">TechShed</span>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border border-black h-10 px-4 rounded-3xl pr-10"
              />
              <MdSearch className="absolute right-3 text-purple-400" size={20} />
            </div>
          </div>
  
          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={()=>setIsLogin(true)} className="px-4 sm:text-base py-2 border rounded-3xl flex items-center gap-2 hover:bg-black hover:text-white transition  duration-200 whitespace-nowrap">
              <FaUserMd /> Sign In
            </button>
            <span className=" gap-2 hidden md:flex items-center">
              <IoMdHeart size={24} className=" "  />
              <IoMdHeartEmpty size={24} />
            </span>
            <span className="flex items-center gap-1">
              0 <IoMdCart size={24} className="flex md:hidden" />
              <IoMdCart size={24} className=" hidden md:flex" />
            </span>
            <div className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200">

            <button ><GiHamburgerMenu size={24 } /></button>
            </div>
          </div>
        </div>
        <Logintoggle isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    );
  };

  export default Nav;