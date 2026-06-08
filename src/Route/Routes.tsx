import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardHome from "../components/DashboardHome";
import ProtectedRoute from "./ProtectedRoute";
import UsersPage from "../Pages/users/UsersPage";
import ProposalPage from "../Pages/proposal/ProposalPage";
import PayrollPage from "../Pages/payroll/PayrollPage";
import Training from "../Pages/training/Training";
import Organization from "../Pages/organization/Organization";
import TeamPage from "../Pages/team/TeamPage";



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

         },
         {
          path:"proposals",
          element:<ProtectedRoute><ProposalPage></ProposalPage></ProtectedRoute>
         },
         {
          path:"payroll",
          element:<ProtectedRoute><PayrollPage></PayrollPage></ProtectedRoute>
         },
         {
          path:"training",
          element:<ProtectedRoute allowedRoles={["ADMIN"]}><Training></Training></ProtectedRoute>
         },
         {
          path:"organization",
          element:<ProtectedRoute allowedRoles={["ADMIN"]}><Organization></Organization></ProtectedRoute>
         },
         {
          path:"teams",
          element:<ProtectedRoute allowedRoles={["ADMIN","LEADER"]}><TeamPage></TeamPage></ProtectedRoute>
         }
    ]
  },
]);