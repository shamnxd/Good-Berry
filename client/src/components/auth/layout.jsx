import { Outlet } from "react-router-dom";
import { Footer } from "../shop/footer";
import ShopHeader from "../shop/header-shop";
import Breadcrumbs from "../common/bread-crumbs";

function AuthLayout() {
  return (
    <>
    <ShopHeader/>
    <div className="min-h-screen w-full shop-header">
    <Breadcrumbs/>
      <div className="flex flex-1 items-center justify-center bg-background px-0 lg:px-8 py-12">
        <Outlet />
      </div>
      <Footer/> 
    </div>
    </>
  );
}

export default AuthLayout;
