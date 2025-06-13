import { BiUser } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import React from "react";
import { Card } from "./ui/card";

const Navbar = () => {
  return (
    <div className="w-[100%] md:w-[100%] lg:w-[83%] fixed top-0 right-0 z-50 max-h-12 bg-fill_bg p-2">
      <div className="flex w-full space-x-2  justify-between">
        <Card className=" rounded-full h-12 p-3 bg-background  text-2xl">
          <AiOutlineHome />
        </Card>
        <Card className=" w-full p-2 h-12  bg-background flex justify-center items-center text-gray-500">
          <h1 className="text-2xl font-bold">CafePilot</h1>
        </Card>
        <Card className=" rounded-full h-12 p-3 bg-background text-2xl">
          <BiUser />
        </Card>
      </div>
    </div>
  );
};

export default Navbar;
