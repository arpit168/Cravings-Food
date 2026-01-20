import React, { useState,useEffect} from "react";
import UserSideBar from "../../components/userDashboard/UserSidebar";
// import UserOverview from "../../components/userDashboard/userOverview";
import UserOverview from "../../components/userDashboard/UserOverview";

import UserProfile from "../../components/userDashboard/UserProfile";
import UserOrders from "../../components/userDashboard/UserOrders";
import UserTransactions from "../../components/userDashboard/UserTransaction";
import UserHelpDesk from "../../components/userDashboard/UserHelpDesk";
import UserBottombar from "../../components/userDashboard/UserBottombar";
import useWindowSize from "../../hooks/useWindowSize";

const UserDashboard = () => {
  const [active, setActive] = useState(
    JSON.parse(localStorage.getItem("UserDashboard-active")) || "overview",
  );
  const [isCollapsed, setIsCollapsed] = useState(true);
  const size = useWindowSize();
  useEffect(() => {
    localStorage.setItem("UserDashboard-active", JSON.stringify(active));
  }, [active]);

  return (
    <>
      <div className="w-full md:h-[90vh] md:flex md:overflow-hidden">
        <div
          className={`bg-blue-950 text-white duration-300 md:absolute md:h-screen   ${isCollapsed ? "w-3/60   overflow-hidden" : "w-10/60 z-10  "}  `}
        >
          {size.width < 645 ? (
            <UserBottombar
              active={active}
              setActive={setActive}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          ) : (
            <UserSideBar
              active={active}
              setActive={setActive}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}
        </div>
        {/* Main content */}
        <div className={`w-57/60 ml-auto ms-2 overflow-auto duration-300 ${isCollapsed?"":"overflow-hidden  opacity-50"}`} >
          {active === "overview" && <UserOverview />}
          {active === "profile" && <UserProfile />}
          {active === "orders" && <UserOrders />}
          {active === "transactions" && <UserTransactions />}
          {active === "helpdesk" && <UserHelpDesk />}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
