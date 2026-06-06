import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardHome from "../components/DashboardHome";
import ProtectedRoute from "./ProtectedRoute";
import UsersPage from "../Pages/users/UsersPage";



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
  },
  // dashboard route
    {
    path: "/dashboard",
    element: <ProtectedRoute> 
      <DashboardLayout></DashboardLayout>
      </ProtectedRoute>,
    children:[
         {
            path:"",
            element:<DashboardHome></DashboardHome>
         },
         { path:"users",
          element:<ProtectedRoute allowedRoles={["ADMIN"]}><UsersPage></UsersPage></ProtectedRoute>

         }
    ]
  },
]);