import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { AppDispatch } from "../../stores/store";
import { getAllProducts } from "@/stores/receptionStore";
import { useRouter } from "@/router/useRouterManger";
import layoutStyles from "../../styles/layout.module.scss";

const ForeStage = () => {
  const router = useRouter();
  const parentRoute = router.getCurrentParentRoute();
  const currentRote = router.getCurrentRoute();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      await dispatch(getAllProducts());
    })();
  }, [dispatch]);

  const HomeWorkNavbar = () => {
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
        <i className="bx bxs-user bx-sm"></i>
      </div>
    );
  };

  return (
    <div className={layoutStyles.container}>
      <HomeWorkNavbar />
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
  );
};

export default ForeStage;
