import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";


export default function DashboardLayout() {
  return (
        <div className='flex h-screen overflow-hidden bg-gray-50 gap-5'>
        <div className='hidden md:flex flex-col w-64 bg-white border-r'>
         <Sidebar></Sidebar>
        </div>
        {/* main content */}
      <main className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className='max-w-7xl w-full mx-auto my-5'>
           <Outlet></Outlet>
       </div>
        </div>
       </main>
           
     
  
    </div>
  )
}
