import Link from "next/link";

export default function Tabs({ userData }) {
    return (
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <Link href="/profile" className="text-red-600 font-semibold hover:underline">Profile</Link>
            {userData.admin && (
                <>
                    <Link href="/admin" className="text-gray-700 hover:underline">Admin</Link>
                    <Link href="/catagories" className="text-gray-700 hover:underline">Categories</Link>
                    <Link href="/menuitems" className="text-gray-700 hover:underline">Menu Items</Link>
                    <Link href="/users" className="text-gray-700 hover:underline">Users</Link>
                </>
            )}
        </div>
    )
}