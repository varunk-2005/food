"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Tabs({ userData }) {
    const pathname = usePathname();
    const tabLinks = [
        { href: "/profile", label: "Profile" },
        ...(userData.admin
            ? [
                { href: "/catagories", label: "Categories" },
                { href: "/menuitems", label: "Menu Items" },
                { href: "/users", label: "Users" },
            ]
            : []),
    ];
    return (
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
            {tabLinks.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    className={
                        (pathname === tab.href
                            ? "border-b-2 border-red-500 text-red-600 font-semibold "
                            : "text-gray-700 ") +
                        "hover:underline pb-1 transition-all"
                    }
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
} 