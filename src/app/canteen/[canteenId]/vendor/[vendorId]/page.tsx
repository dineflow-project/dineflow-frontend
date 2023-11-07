// pages/canteen/[canteenId]/vendor/[vendorId].tsx
"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Vendor } from "@/app/Interfaces/VendorInterface";
import { Menu } from "@/app/Interfaces/MenuInterface";
import VendorService from "@/services/VendorService";
import MenuService from "@/services/MenuService";
import Image from "next/image";

export default function VendorPage({
  params,
}: {
  params: { vendorId: bigint };
}) {
  const [vendor, setVendor] = useState<Vendor>();
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    if (!params.vendorId) {
      return;
    }

    // Fetch and set the vendor data when the component mounts
    VendorService.getVendorById(params.vendorId)
      .then((data) => {
        if (data !== null) {
          setVendor(data); // Wrap the data in an array if it's not null
          console.log("this vendor", data);
        } else {
          // Handle the case when data is null
          // You can display a message or take other actions here
          console.log("Vendor not found");
        }
      })
      .catch((error) => {
        // Handle errors more gracefully here
        console.error("Error fetching vendor:", error);
      });

    // Fetch and set the list of menus when the component mounts
    MenuService.getAllMenusByVendorId(params.vendorId)
      .then((data) => {
        setMenus(data);
        console.log("all menus in this vendor", data);
      })
      .catch((error) => {
        // Handle errors more gracefully here
        console.error("Error fetching menus:", error);
      });
  }, [params.vendorId]);

  // Placeholder for the checkout function
  const handleCheckout = () => {
    // Implement the checkout logic here
    console.log("Checkout function not implemented");
  };

  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">{vendor.name}</h1>
      <p>Open Time: {vendor.opening_timestamp}</p>
      <p>Close Time: {vendor.closing_timestamp}</p>

      <h2 className="text-2xl font-bold">Menu</h2>
      <div>
        {menus
          .filter((menu) => menu.is_available)
          .map((menu) => (
            <div key={menu.id} className="bg-white rounded-lg p-4 shadow">
              <p className="text-xl font-semibold">
                {menu.name} - ${menu.price}
              </p>
              <p>{menu.description}</p>
              <Image
                src={menu.image_path}
                alt="Menu Picture"
                width={300}
                height={200}
                className="rounded-lg mt-4"
              />
              <div className="mt-2">
                <label htmlFor={`quantity-${menu.id}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${menu.id}`}
                  min="0"
                  defaultValue={0}
                  className="w-16 h-10 border border-gray-300 rounded-md px-2"
                />
              </div>
            </div>
          ))}
      </div>
      <button
        type="submit"
        onClick={handleCheckout}
        className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Order
      </button>
    </div>
  );
}
