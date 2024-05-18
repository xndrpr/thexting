import ReactDOM from "react-dom/client";
import "./index.sass";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./pages/Main/Main";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import App from "./pages/App/App";
import Error404 from "./pages/Errors/Error404";
import Store from "./utils/store";
import { createContext } from "react";
import { $socket, SocketContext } from "./utils/$socket";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/app/:chatId",
    element: <App />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

interface State {
  store: Store;
}
const store = new Store();
export const Context = createContext<State>({ store });
root.render(
  <Context.Provider value={{store}}>
    <SocketContext.Provider value={$socket}>
      <RouterProvider router={router} />
    </SocketContext.Provider>
  </Context.Provider>
);
