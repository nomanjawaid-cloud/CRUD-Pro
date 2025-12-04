"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTachometerAlt, FaUsers, FaFileAlt } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: FaTachometerAlt },
    {
      name: "Users",
      children: [
        { label: "Users List", href: "/users/list" },
        { label: "Create User", href: "/users/create" },
      ],
      icon: FaUsers,
    },
    {
      name: "Posts",
      children: [
        { label: "Posts List", href: "/posts/list" },
        { label: "Create Post", href: "/posts/create" },
      ],
      icon: FaFileAlt,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 z-30 h-full w-64 border-r border-gray-200 bg-white p-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav className="space-y-2">
        {links.map((item) => (
          <div key={item.name} className="mb-4">
            <div className="flex items-center gap-3 px-3 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <item.icon size={16} />
              <span className="text-sm">{item.name}</span>
            </div>

            {item.children && (
              <div className="ml-8 space-y-1 mt-2">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === child.href
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-gray-400 text-center">CRUDPro v1.0</div>
      </div>
    </aside>
  );
}
