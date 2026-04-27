import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./footer";
import ShopHeader from "./header-shop";
import HomeHeader from "./header";
import Breadcrumbs from "../common/bread-crumbs";
import MobileBottomNav from "./mobile-bottom-nav";

function ShopLayout() {
    const location = useLocation();
    return (
        <div className="flex flex-col min-h-screen">
            {location.pathname === "/" ? <HomeHeader/> : <ShopHeader/>}
            <main className={`flex-1 flex flex-col w-full pb-10 lg:pb-20 md:pb-0 ${location.pathname === "/" ? "" : "shop-header"}`}>
                {(location.pathname.includes("shop") || location.pathname.includes("account")) && !location.pathname.includes("product") && <Breadcrumbs />}
                <Outlet />
            </main>
            {!location.pathname.includes("/account") && <Footer/>}
            <MobileBottomNav />
        </div>
    );
}

export default ShopLayout;