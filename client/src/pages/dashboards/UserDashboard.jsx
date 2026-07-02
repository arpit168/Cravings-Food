import React, { useState, useEffect } from "react";
import UserSideBar from "../../components/userDashboard/UserSidebar";
import UserOverview from "../../components/userDashboard/UserOverview";
import UserProfile from "../../components/userDashboard/UserProfile";
import UserOrders from "../../components/userDashboard/UserOrders";
import UserTransactions from "../../components/userDashboard/UserTransaction";
import UserHelpDesk from "../../components/userDashboard/UserHelpDesk";
import UserBottombar from "../../components/userDashboard/UserBottombar";
import useWindowSize from "../../hooks/useWindowSize";

const UserDashboard = () => {
  const [active, setActive] = useState(
    JSON.parse(localStorage.getItem("UserDashboard-active")) || "overview"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const size = useWindowSize();

  useEffect(() => {
    localStorage.setItem("UserDashboard-active", JSON.stringify(active));
  }, [active]);

  return (
    <div className="min-h-[88vh] bg-background flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar / Bottombar */}
      <div className="w-full md:w-64 lg:w-72 bg-surface border-b md:border-b-0 md:border-r border-border shrink-0">
        {size.width < 768 ? (
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

      {/* Main Content Pane */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {active === "overview" && <UserOverview setActive={setActive} />}
        {active === "profile" && <UserProfile />}
        {active === "orders" && <UserOrders />}
        {active === "transactions" && <UserTransactions />}
        {active === "helpdesk" && <UserHelpDesk />}
      </div>
    </div>
  );
};

export default UserDashboard;
