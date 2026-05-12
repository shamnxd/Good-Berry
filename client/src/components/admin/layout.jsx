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
      
      <div className="flex flex-col flex-1 w-full lg:pl-[250px] transition-all duration-300">
        <AdminHeader setOpen={setOpenSidebar} />
        
        <main className="mt-[70px] flex w-full flex-1 flex-col p-2 md:p-3 lg:p-4">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="mb-3">
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
