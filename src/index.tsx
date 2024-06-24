import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./component/Home";
import Error from "./component/Error";
import MenuList from "./component/Menu/MenuList";
import "./index.scss";
import Menu from "./component/Menu";
import { Provider } from "react-redux";
import store from "./store";
import Checkout from "./component/Checkout";
import OrderStatus from "./component/OrderStatus";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/menu/:vendorId",
        element: <MenuList />,
      },
      {
        path: "/menu/:vendorId/checkout",
        element: <Checkout />,
      },
      {
        path: "/order-status/:orderId",
        element: <OrderStatus />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
