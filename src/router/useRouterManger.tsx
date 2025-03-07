import { JSX } from 'react';
import { useNavigate, useLocation, useParams, Route, Navigate } from 'react-router-dom';

interface RouteMeta {
  title: string;
  isNavbar?: boolean;
}

export interface RouteMenu {
  path: string;
  name: string;
  component: JSX.Element;
  children?: RouteMenu[];
  meta: RouteMeta;
}

export const routes: RouteMenu[] = [
  // {
  //   path: "/",
  //   name: "userLogin",
  //   component: <Login />,
  //   meta: {
  //     title: "登入頁面",
  //   },
  // },
];

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const push = (path: string) => {
    navigate(path);
  };

  // 獲取當前完整路徑的路由資訊
  const getCurrentRoute = () => {
    const currentPath = location.pathname;
    const findRoute = (routes: RouteMenu[], path: string): RouteMenu | undefined => {
      for (const route of routes) {
        if (route.path === path) return route;
        if (route.children) {
          const childPath = path.replace(`${route.path}/`, '');
          const childRoute = findRoute(route.children, childPath);
          if (childRoute) return childRoute;
        }
      }
      return undefined;
    };

    return findRoute(routes, currentPath);
  };

  // 獲取當前路由的父層路由
  const getCurrentParentRoute = () => {
    const currentPath = location.pathname;
    const findParentRoute = (routes: RouteMenu[]): RouteMenu | undefined => {
      for (const route of routes) {
        if (route.children) {
          // 檢查當前路徑是否以父路由路徑開頭
          if (currentPath.startsWith(route.path)) {
            return route;
          }
        }
      }
      return undefined;
    };

    return findParentRoute(routes);
  };

  return {
    push,
    getCurrentRoute,
    getCurrentParentRoute,
    getRouteParams: () => params,
    routeData: routes,
    currentPath: location.pathname,
  };
};

export const renderRoutes = () => {
  return routes.map((route) => {
    if (route.children && route.children.length > 0) {
      const defaultChild = route.children[0];
      return (
        <Route key={route.name} path={route.path} element={route.component}>
          <Route
            index
            element={
              <Navigate to={`${route.path}/${defaultChild.path}`} replace />
            }
          />
          {route.children.map((child) => (
            <Route
              key={child.name}
              path={child.path}
              element={child.component}
            />
          ))}
        </Route>
      );
    }
    return (
      <Route key={route.name} path={route.path} element={route.component} />
    );
  });
};