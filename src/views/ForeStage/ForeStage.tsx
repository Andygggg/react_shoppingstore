import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import LoginModal from "@/components/Modals/LoginModal";
import { AppDispatch } from "../../stores/store";
import { getAllProducts } from "@/stores/receptionStore";
import { useRouter } from "@/router/useRouterManger";
import layoutStyles from "../../styles/layout.module.scss";

const ForeStage = () => {
  const router = useRouter();
  const parentRoute = router.getCurrentParentRoute();
  const currentRote = router.getCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth <= 1024
  );

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  useEffect(() => {
    (async () => {
      await dispatch(getAllProducts());
    })();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
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

  const goToGitHub = () => {
    window.open("https://github.com/Andygggg/react_shoppingstore", "_blank");
  };

  const Navbar = () => {
    return (
      <div className={layoutStyles.navbar}>
        <span onClick={() => router.push("/")}>Breeze & Co.</span>
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
        <i className="bx bxs-user bx-sm" onClick={openModal}></i>
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
          <span onClick={() => router.push("/")}>Breeze & Co.</span>
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
        <li>
          <i className="bx bxs-user bx-sm" onClick={openModal}></i>
        </li>
      </ul>
      </div>
    );
  };

  return (
    <>
      <div className={layoutStyles.container}>
        {!isSmallScreen ? <Navbar /> : <MobileNavbar />}
        <div className={layoutStyles.container_body}>
          {currentRote?.meta.isNavbar && (
            <div className={layoutStyles.container_bg}>
              <p>{currentRote?.meta.title}</p>
            </div>
          )}
          <div className={layoutStyles.container_content}>
            <Outlet />
          </div>
          <div className={layoutStyles.container_footer}>
            <i className="bx bxl-instagram bx-lg" onClick={goToGitHub}></i>
            <i className="bx bxl-facebook-circle bx-lg" onClick={goToGitHub}></i>
            <i className="bx bxl-github bx-lg" onClick={goToGitHub}></i>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default ForeStage;
