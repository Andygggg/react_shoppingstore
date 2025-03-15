import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import { useRouter } from "@/router/useRouterManger";
import { logout } from "@/stores/userStore";
import layoutStyles from "../../styles/layout.module.scss";

const BackStage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const parentRoute = router.getCurrentParentRoute();

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        console.log("螢幕寬度小於 1024px，觸發方法");
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    alert("已登出");
    router.push('homePage')
  };

  const Navbar = () => {
    return (
      <div className={layoutStyles.navbar}>
        <span onClick={() => router.push("admin")}>Breeze & Co.後台</span>
        {parentRoute?.children
          ? parentRoute?.children.map((route) => {
              if (route.meta.isNavbar) {
                return (
                  <span
                    key={route.name}
                    onClick={() => router.push(route.path)}
                  >
                    {route.meta.title}
                  </span>
                );
              }
            })
          : ""}
        <i className="bx bxs-log-out bx-sm" onClick={handleLogout}></i>
      </div>
    );
  };

  const MobileNavbar = () => {
    const [isExtend, setIsExtend] = useState<boolean>(false);

    return (
      <div
        className={`${layoutStyles.mobile_navbar} ${
          isExtend ? layoutStyles.isExtend : ""
        }`}
      >
        <div className={layoutStyles.item}>
          <span onClick={() => router.push("/")}>Breeze & Co. 後台</span>
          <i
            className={`bx bx-menu-alt-right bx-sm ${layoutStyles.menu_btn}`}
            onClick={() => setIsExtend(!isExtend)}
          ></i>
        </div>

        <ul className={isExtend ? layoutStyles.show : ""}>
          {parentRoute?.children
            ? parentRoute?.children.map((route) => {
                if (route.meta.isNavbar) {
                  return (
                    <li
                      key={route.name}
                      onClick={() => router.push(route.path)}
                    >
                      {route.meta.title}
                    </li>
                  );
                }
                return null;
              })
            : ""}
          <i className="bx bxs-log-out bx-sm" onClick={handleLogout}></i>
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className={layoutStyles.container}>
        {!isSmallScreen ? <Navbar /> : <MobileNavbar />}
        <div className={layoutStyles.container_body}>
          <div className={layoutStyles.container_content}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default BackStage;
