import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 flex items-center justify-between px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40">
      <Button onClick={() => setOpen(true)} className="lg:hidden" variant="ghost" size="icon">
        <AlignJustify className="h-6 w-6 text-slate-700" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="inline-flex gap-2 items-center rounded-lg px-4 py-2 text-sm font-medium border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
