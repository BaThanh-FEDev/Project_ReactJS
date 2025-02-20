import "./assets/css/bootstrap-tcl.css";
import "./assets/css/main.css";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import store from "./store/index.js";
import './translation/i18n';


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter future={{v7_startTransition: true,}}>
      <App />
    </BrowserRouter>
  </Provider>
);
