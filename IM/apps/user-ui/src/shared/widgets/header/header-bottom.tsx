'use client';
import { AlignLeft, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

const HeaderBottom = () => {
      const [show, setShow] = useState(false);
      const [isSticky, setIsSticky] = useState(false);

      // Track scroll position
      useEffect(() =>{
        const handleScroll = () => {
            if(window.screenY > 100){
                setIsSticky(true);
            }else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);

    return(
        <div className={`w-full transition-all duration-300 ${isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg": "relative"}`}
        >

          <div className={`w-[80%] relative m-auto flex items-center justify-between ${
            isSticky ? "pt-3" : "py-0"
        }`}
        >
            {/* All Dropdowns*/}
            <div className={`w-[260px] ${isSticky && "-mb-2"} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
            onClick={() => setShow(!show)}
            >
              <div className="flex items-center gap-2">
                 <AlignLeft color="white" />
                  <span className="text-white font-medium">All Departments</span>      
              </div>
              <ChevronDown color="white" />
            </div>

            {/* Dropdown menu */}
            {show && (
                <div className={`absolute left-0 ${isSticky ? "top-[700px]" : "top-[50px]"}
                w-[260px] h-[400px] bg-[#f5f5f5]`}
                ></div> 
            )}

            {/* Navigation Links*/}
            <div className="flex items-center">
                
            </div>
        </div>
      </div>  
    );
};

export default HeaderBottom