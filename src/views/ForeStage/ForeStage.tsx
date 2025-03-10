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

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  useEffect(() => {
    (async () => {
      await dispatch(getAllProducts());
    })();
  }, [dispatch]);

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

  return (
    <>
      <div className={layoutStyles.container}>
        <Navbar />
        <div className={layoutStyles.container_body}>
          {currentRote?.meta.isNavbar && (
            <div className={layoutStyles.container_bg}>
              <p>{currentRote?.meta.title}</p>
            </div>
          )}
          <div className={layoutStyles.container_content}>
            <Outlet />
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

export default ForeStage;
