import React, { useState } from "react";

export default function MenuItemSize({ name = "Sizes", addLabel = "Add Size", props }) {
    const [items, setItems] = props; // Only use props, no local useState
    const [isExpanded, setIsExpanded] = useState(false);

    function addItem() {
        setItems(old => [...old, { name: '', price: '' }]);
    }
    function editItem(ev, index, field) {
        const value = field === 'price' ? Number(ev.target.value) : ev.target.value;
        setItems(old => {
            const newItems = [...old];
            newItems[index][field] = value;
            return newItems;
        });
    }
    function removeItem(index) {
        setItems(old => old.filter((_, i) => i !== index));
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full font-semibold text-left mb-2"
            >
                <span>{name}</span>
                <span className="text-gray-500">
                    {isExpanded ? '▼' : '▶'}
                </span>
            </button>

            {isExpanded && (
                <div className="flex flex-col gap-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={item.name}
                                onChange={ev => editItem(ev, index, 'name')}
                                placeholder={`${name} name`}
                                className="border rounded px-2 py-1 w-32"
                                required
                            />
                            <input
                                type="number"
                                value={item.price}
                                onChange={ev => editItem(ev, index, 'price')}
                                placeholder="Price"
                                className="border rounded px-2 py-1 w-24"
                                min="0"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="bg-red-400 hover:bg-red-600 text-white rounded px-2 py-1 text-xs"
                                title={`Remove ${name.toLowerCase()}`}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 bg-white border border-gray-300 rounded px-4 py-1 text-sm hover:bg-gray-200"
                    >
                        + {addLabel}
                    </button>
                </div>
            )}
        </div>
    );
}