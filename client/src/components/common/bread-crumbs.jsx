import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

export default function Breadcrumbs() {
  const { user } = useSelector((state) => state.auth);
  const Admin = user?.role === "admin";

  const location = useLocation();

  // Generate breadcrumb data based on the current path
  const pathnames = location.pathname.split("/").filter((x) => x );

  return (
    <div className="border-b bg-gray-100 py-3 lg:py-6 lg:px-7 px-2">
      <div className="container mx-auto p-4 !max-w-[1400px]">
        <nav className="flex justify-between" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {/* Root breadcrumb */}
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>

            {/* Dynamic breadcrumbs */}
            {pathnames.map((name, index) => {
              const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;

              return (
                <React.Fragment key={pathTo}>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <li>
                    {isLast ? (
                      <span className="text-gray-900 font-medium">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </span>
                    ) : (
                      <Link
                        to={pathTo}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
          {Admin && (
            <Button variant="outline" className="outline outline-1 ">
            <Link to="/admin" className="ml-auto">
              Go to Admin
            </Link>
          </Button>
          )}
        </nav>
      </div>
    </div>
  );
}
