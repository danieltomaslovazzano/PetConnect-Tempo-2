import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  PawPrint,
  BarChart3,
  Settings,
  Bell,
  Shield,
  Flag,
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/admin",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
    },
    {
      title: "Pets",
      icon: <PawPrint className="h-5 w-5" />,
      path: "/admin/pets",
    },
    {
      title: "Reports",
      icon: <Flag className="h-5 w-5" />,
      path: "/admin/reports",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      path: "/admin/notifications",
    },
    {
      title: "Permissions",
      icon: <Shield className="h-5 w-5" />,
      path: "/admin/permissions",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <PawPrint className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">PetConnect</span>
        </div>
        <div className="text-sm text-gray-400 mt-1">Admin Portal</div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm ${isActive ? "bg-gray-700 border-l-4 border-blue-500" : "hover:bg-gray-700"}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} PetConnect
          <br />
          Admin v1.0.0
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
