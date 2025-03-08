import { JSX } from 'react'; 
import { useNavigate, useLocation, useParams, Route, Navigate } from 'react-router-dom';  

import ForeStage from '@/views/ForeStage/ForeStage'; 
import HomePage from '@/views/ForeStage/HomePage';  
import ProductView from '@/views/ForeStage/ProductView';
import ProductDetail from '@/views/ForeStage/ProductDetail';
import ShoppingCart from '@/views/ForeStage/ShoppingCart';

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
  {     
    path: "/",     
    name: "foreStage",     
    component: <ForeStage />,     
    meta: {       
      title: "前台",     
    },     
    children: [       
      {         
        path: "homePage",         
        name: "homePage",         
        component: <HomePage />,         
        meta: {           
          title: "首頁",           
          isNavbar: false,         
        },       
      },
      {         
        path: "productView",         
        name: "productView",         
        component: <ProductView />,         
        meta: {           
          title: "產品目錄",           
          isNavbar: true,         
        },       
      },
      {         
        path: "shoppingCart",         
        name: "shoppingCart",         
        component: <ShoppingCart />,         
        meta: {           
          title: "購物車",           
          isNavbar: true,         
        },       
      },
      {         
        path: "productDetail",         
        name: "productDetail",         
        component: <ProductDetail />,         
        meta: {           
          title: "購物車",           
          isNavbar: false,         
        },       
      },           
    ]   
  }, 
];  

export const useRouter = () => {   
  const navigate = useNavigate();   
  const location = useLocation();   
  const params = useParams();    
  
  const push = (pathOrName: string, params?: Record<string, any>) => {
    // 檢查是否為有效的路徑（以 '/' 開頭）
    if (pathOrName.startsWith('/')) {
      // 如果有參數，添加到 state 中
      if (params) {
        navigate(pathOrName, { state: params });
      } else {
        navigate(pathOrName);
      }
      return;
    }
    
    // 當輸入的不是路徑而是名稱時，執行查找
    const findRouteByName = (routes: RouteMenu[], targetName: string): {route: RouteMenu, fullPath: string} | undefined => {
      for (const route of routes) {
        if (route.name === targetName) {
          return {
            route,
            fullPath: route.path
          };
        }
        
        if (route.children) {
          const childResult = route.children.find(child => child.name === targetName);
          if (childResult) {
            const fullPath = `${route.path}/${childResult.path}`.replace('//', '/');
            return {
              route: childResult,
              fullPath
            };
          }
          
          // 深度搜索其他子路由
          for (const child of route.children) {
            if (child.children) {
              const deepResult = findRouteByName([child], targetName);
              if (deepResult) return deepResult;
            }
          }
        }
      }
      return undefined;
    };
    
    const routeInfo = findRouteByName(routes, pathOrName);
    
    if (routeInfo) {
      // 如果有參數，添加到 state 中
      if (params) {
        navigate(routeInfo.fullPath, { state: params });
      } else {
        navigate(routeInfo.fullPath);
      }
    } else {
      // 如果找不到路由，導向到起始路徑
      navigate('/');
    }
  };  
  
  // 獲取當前完整路徑的路由資訊   
  const getCurrentRoute = () => {     
    const currentPath = location.pathname.replace('/', '');   
      
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
    queryParams: params,
    routerParams: location.state,     
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
              <Navigate to={`${defaultChild.path}`} replace />             
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