import React from "react";
import { TbChartTreemap } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { TiShoppingCart } from "react-icons/ti";
import { TbTransactionRupee } from "react-icons/tb";
import { RiCustomerService2Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

const UserBottombar = ({ active, setActive, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { key: "overview", title: "Overview", icon: <TbChartTreemap /> },
    { key: "profile", title: "Profiles", icon: <ImProfile /> },
    { key: "orders", title: "Order", icon: <TiShoppingCart /> },
    { key: "transactions", title: "Transaction", icon: <TbTransactionRupee /> },
    { key: "helpdesk", title: "Help Desk", icon: <RiCustomerService2Fill /> },
  ];

  return (
    <>
      <div className=" fixed bottom-0 bg-(--color-primary) w-full  flex z-99 py-3">
        <div className="py-1 space-y-3  w-full flex ">
          {menuItems.map((item, idx) => (
            <button
              className={`flex justify-center m-auto gap-3 items-center  text-lg  rounded-xl h-10 w-full  overflow-hidden duration-300
                ${
                  active === item.key
                    ? "bg-blue-800 text-white "
                    : " "
                } 
              `}
              onClick={() => setActive(item.key)}
              key={idx}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserBottombar;
