import React from "react";


const MenuHeader = () => {

  const menuConfig = [
    {
      category: "Burgers",
      img: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      names: [
        "Cheese Burger",
        "Paneer Burger",
        "Double Patty Burger",
        "Crispy Veg Burger",
        "Mexican Burger",
      ],
    },
    {
  category: "Pizza",
  img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
,
  names: [
    "Margherita Pizza",
    "Farmhouse Pizza",
    "Cheese Burst Pizza",
    "Veg Supreme Pizza",
    "Italian Pizza",
  ],
},

    {
      category: "Snacks",
      img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
      names: [
        "French Fries",
        "Peri Peri Fries",
        "Cheese Fries",
        "Masala Fries",
        "Crispy Fries",
      ],
    },
    {
      category: "Drinks",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      names: [
        "Cold Coffee",
        "Hot Coffee",
        "Chocolate Shake",
        "Vanilla Shake",
        "Mocha Coffee",
      ],
    },
  ];

  // ✅ ONLY DATA GENERATION
  const menuItems = Array.from({ length: 600 }, (_, i) => {
    const group = menuConfig[i % menuConfig.length];
    const name = group.names[i % group.names.length];

    return {
      id: i + 1,
      name: `${name} ${i + 1}`,
      category: group.category,
      img: group.img,
      price: `₹${99 + (i % 10) * 20}`,
    };
  });

  // ✅ JSX RETURN (ONLY ONCE)
  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 md:px-14 py-14">

      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold text-[#161E54]">
          Cravings Food Zone
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          Explore 600+ delicious items 🍔🍕☕
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl
            hover:-translate-y-1 transition overflow-hidden"
          >
            <img
              src={item.img}
              alt={item.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-lg font-semibold text-[#161E54] truncate">
                {item.name}
              </h3>

              <p className="text-sm text-gray-400">{item.category}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-[#F16D34] font-bold text-lg">
                  {item.price}
                </span>

                <button className="bg-[#161E54] text-white px-4 py-2 rounded-xl hover:bg-[#0F163F]">
                  Add +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MenuHeader;
