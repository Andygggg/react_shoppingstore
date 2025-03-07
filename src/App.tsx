import "./App.css";
import { HashRouter, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import { renderRoutes } from '@/router/useRouterManger';
import MessageToast from "./components/Tools/MessageToast";
import { store } from "./stores/store";

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <div className="outer_box">
          <Routes>
            {renderRoutes()}
          </Routes>
        </div>
      </HashRouter>
      <MessageToast />
    </Provider>
  );
};

export default App;