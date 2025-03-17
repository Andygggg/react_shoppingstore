import { JSX } from 'react'; 
import { useNavigate, useLocation, useParams, Route, Navigate } from 'react-router-dom';  

import ForeStage from '@/views/ForeStage/ForeStage'; 
import HomePage from '@/views/ForeStage/HomePage';  
import ProductView from '@/views/ForeStage/ProductView';
import ProductDetail from '@/views/ForeStage/ProductDetail';
import ShoppingCart from '@/views/ForeStage/ShoppingCart';
import About from '@/views/ForeStage/About';

import BackStage from '@/views/BackStage/BackStage';
import ProductList from '@/views/BackStage/ProductList';
import ProductForm from '@/views/BackStage/ProductForm';
import CouponList from '@/views/BackStage/CouponList';
import OrderList from '@/views/BackStage/orderList';

import NotFound from '@/views/NotFound';

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
      {         
        path: "about",         
        name: "about",         
        component: <About />,         
        meta: {           
          title: "關於我們",           
          isNavbar: true,         
        },       
      },       
    ]   
  },
  {     
    path: "admin",     
    name: "admin",     
    component: <BackStage />,     
    meta: {       
      title: "後台",     
    }, 
    children: [       
      {         
        path: "productList",         
        name: "productList",         
        component: <ProductList />,         
        meta: {           
          title: "產品清單",           
          isNavbar: true,         
        },       
      },
      {         
        path: "productForm",         
        name: "productForm",         
        component: <ProductForm />,         
        meta: {           
          title: "產品表單",           
          isNavbar: false,         
        },       
      },
      {         
        path: "couponList",         
        name: "couponList",         
        component: <CouponList />,         
        meta: {           
          title: "優惠卷清單",           
          isNavbar: true,         
        },       
      },
      {         
        path: "orderList",         
        name: "orderList",         
        component: <OrderList />,         
        meta: {           
          title: "訂單清單",           
          isNavbar: true,         
        },       
      },
    ]
  },
  {     
    path: "notFound",     
    name: "notFound",     
    component: <NotFound />,     
    meta: {       
      title: "404",     
    }, 
  } 
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
            fullPath: route.path.startsWith('/') ? route.path : `/${route.path}`
          };
        }
        
        if (route.children) {
          const childResult = route.children.find(child => child.name === targetName);
          if (childResult) {
            // 確保父路徑和子路徑正確組合
            const parentPath = route.path === '/' ? '' : route.path;
            const fullPath = `${parentPath}/${childResult.path}`.replace('//', '/');
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
      // 關鍵修改：確保路徑始終是絕對路徑
      const absolutePath = routeInfo.fullPath.startsWith('/') 
        ? routeInfo.fullPath 
        : `/${routeInfo.fullPath}`;
      
      // 如果有參數，添加到 state 中
      if (params) {
        navigate(absolutePath, { state: params });
      } else {
        navigate(absolutePath);
      }
    } else {
      // 如果找不到路由，導向到起始路徑
      navigate('/');
    }
  };
  
  // 獲取當前完整路徑的路由資訊
const getCurrentRoute = () => {
  // 處理 hash 路由格式 (/#/)
  let currentPath = location.hash ? location.hash.substring(1) : location.pathname;
  
  // 確保路徑以 / 開頭
  if (!currentPath.startsWith('/')) {
    currentPath = `/${currentPath}`;
  }
  
  // 移除結尾的斜線（除了根路徑）
  if (currentPath.length > 1 && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }
  
  // 如果是根路徑
  if (currentPath === '/') {
    const rootRoute = routes.find(route => route.path === '/');
    if (rootRoute) {
      // 檢查是否有預設子路由
      if (rootRoute.children && rootRoute.children.length > 0) {
        const defaultChild = rootRoute.children[0];
        const defaultPath = `/${defaultChild.path}`;
        // 如果當前正好是預設路徑，返回該子路由
        if (location.hash === `#${defaultPath}` || location.hash === `#/${defaultChild.path}`) {
          return defaultChild;
        }
      }
      return rootRoute;
    }
  }
  
  // 查找匹配的路由
  for (const route of routes) {
    const routePath = route.path.startsWith('/') ? route.path : `/${route.path}`;
    
    // 直接匹配路由
    if (currentPath === routePath) {
      return route;
    }
    
    // 檢查子路由
    if (route.children && route.children.length > 0) {
      // 檢查路徑是否在此父路由下
      const pathWithoutParent = routePath === '/' 
        ? currentPath 
        : currentPath.startsWith(`${routePath}/`) 
          ? currentPath.substring(routePath.length + 1) 
          : '';
      
      if (pathWithoutParent !== '' || routePath === '/') {
        // 查找匹配的子路由
        for (const child of route.children) {
          if (routePath === '/' && currentPath === `/${child.path}`) {
            return child;
          } else if (pathWithoutParent === child.path) {
            return child;
          }
        }
      }
    }
  }
  
  return undefined;
};

// 獲取當前路由的父層路由
const getCurrentParentRoute = () => {
  // 處理 hash 路由格式 (/#/)
  let currentPath = location.hash ? location.hash.substring(1) : location.pathname;
  
  // 確保路徑以 / 開頭
  if (!currentPath.startsWith('/')) {
    currentPath = `/${currentPath}`;
  }
  
  // 移除結尾的斜線（除了根路徑）
  if (currentPath.length > 1 && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }
  
  // 根路徑下的頁面
  if (currentPath === '/') {
    return undefined; // 根路徑沒有父路由
  }
  
  // 針對根路徑下的子路由，如 /homePage
  const rootPath = routes.find(route => route.path === '/');
  if (rootPath && rootPath.children) {
    for (const child of rootPath.children) {
      if (currentPath === `/${child.path}`) {
        return rootPath;
      }
    }
  }
  
  // 查找其他父層路由
  for (const route of routes) {
    const routePath = route.path.startsWith('/') ? route.path : `/${route.path}`;
    
    // 跳過沒有子路由的路由
    if (!route.children || route.children.length === 0) {
      continue;
    }
    
    // 不是根路由
    if (routePath !== '/') {
      // 檢查當前路徑是否以此路由開頭
      if (currentPath === routePath || currentPath.startsWith(`${routePath}/`)) {
        return route;
      }
    }
  }
  
  return undefined;
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