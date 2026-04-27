import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";
import AdminBreadcrumbs from "./bread-crumbs";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      
      <div className="flex flex-col flex-1 w-full lg:pl-72 transition-all duration-300">
        <AdminHeader setOpen={setOpenSidebar} />
        
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 mt-20 w-full max-w-full">
          <div className="w-full mx-auto">
            <div className="mb-2">
              <AdminBreadcrumbs />
            </div>
            <div className="w-full overflow-x-auto pb-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
