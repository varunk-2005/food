'use client';

import SectionHeaders from "@/component/layout/SectionHeaders";
import { useEffect, useState } from "react";
import MenuItem from "@/component/Menu/MenuItem";

export default function MenuPage() {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch('/api/catagories')
            .then(res => res.json())
            .then(data => setCategories(data));

        fetch('/api/menuitems')
            .then(res => res.json())
            .then(data => setMenuItems(data.menuItems || []));
    }, []);

    return (
        <section className="mt-8">
            {categories?.length > 0 &&
                categories.map((c, idx) => {
                    const items = menuItems.filter(m => m.category === c._id);
                    return (
                        <div key={c._id} className={"mb-10" + (idx === 0 ? " mt-16" : "")}>
                            <SectionHeaders MainHeader={c.name} />
                            <div className={items.length === 1 ? "grid grid-cols-1 gap-6 justify-items-center" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"}>
                                {items.map(item => (
                                    <MenuItem key={item._id} item={item} />
                                ))}
                            </div>
                        </div>
                    );
                })}
        </section>
    );
}
