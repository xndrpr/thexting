import ReactDOM from "react-dom/client";
import "./index.sass";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import Chat from "./pages/chat";
import Error404 from "./pages/errors";
import Store from "./utils/store";
import { createContext } from "react";
import { $socket, SocketContext } from "./utils/$socket";
import Main from "./pages/main";

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
    element: <Chat />,
  },
  {
    path: "/app/:chatId",
    element: <Chat />,
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
  <Context.Provider value={{ store }}>
    <SocketContext.Provider value={$socket}>
      <RouterProvider router={router} />
    </SocketContext.Provider>
  </Context.Provider>
);
