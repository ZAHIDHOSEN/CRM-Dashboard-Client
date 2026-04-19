import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,

  },
  {
    path:"/login",
    element:<Login></Login>
  },
  {
    path:"/register",
    element:<Register></Register>
  }
]);