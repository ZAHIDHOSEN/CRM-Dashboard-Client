import { createBrowserRouter } from "react-router";
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
import AuditLogPage from "../Pages/auditLog/AuditLogPage";
import LeadsPage from "../Pages/leads/LeadsPage";
import MyProposalsPage from "../Pages/proposal/MyProposalsPage";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login></Login>

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
         },
         {
          path:"audit-log",
          element:<ProtectedRoute allowedRoles={["ADMIN"]}><AuditLogPage></AuditLogPage></ProtectedRoute>
         },
         {
          path:"leads",
          element:<ProtectedRoute allowedRoles={["ADMIN","LEADER"]}><LeadsPage></LeadsPage></ProtectedRoute>
         },
         {
          path:"myProposals",
          element:<ProtectedRoute allowedRoles={["CLIENT"]}><MyProposalsPage></MyProposalsPage></ProtectedRoute>
         }
    ]
  },
]);