import { Outlet } from "react-router-dom";

import { useRouter } from "@/router/useRouterManger";
import layoutStyles from "../../styles/layout.module.scss";

const BackStage = () => {
  const router = useRouter();
  const parentRoute = router.getCurrentParentRoute();

  const Navbar = () => {
    return (
      <div className={layoutStyles.navbar}>
        <span onClick={() => router.push("/")}>Breeze & Co.後台</span>
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
    <>
      <div className={layoutStyles.container}>
        <Navbar />
        <div className={layoutStyles.container_body}>
          <div className={layoutStyles.container_content}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default BackStage