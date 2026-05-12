import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function AdminBreadcrumbs() {
  const location = useLocation();

  // Split the path into segments and filter out dynamic IDs
  const pathnames = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => !/^[0-9a-fA-F]{24}$/.test(segment)); // Adjust regex for your dynamic segments

  const isAdmin = pathnames[0] === "admin";

  return (
    <div className="pt-4 px-4">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {/* Admin root breadcrumb */}
            {isAdmin && (
              <li>
                <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                  Admin
                </Link>
              </li>
            )}

            {pathnames.slice(isAdmin ? 1 : 0).map((name, index, array) => {
              const path = `/${pathnames.slice(0, index + (isAdmin ? 2 : 1)).join("/")}`;

              // Determine if the current item is the last in the filtered array
              const isLast = index === array.length - 1;

              return (
                <React.Fragment key={path}>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <li>
                    {isLast ? (
                      <span className="text-gray-900 font-medium">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </span>
                    ) : (
                      <Link to={path} className="text-gray-500 hover:text-gray-700">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
