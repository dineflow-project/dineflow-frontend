// pages/canteen/[canteenId]/vendor/[vendorId].tsx
"use client";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Vendor } from "../../../../../Interfaces/VendorInterface";
import { Menu } from "../../../../../Interfaces/MenuInterface";
import VendorService from "@/services/VendorService";
import MenuService from "@/services/MenuService";
import OrderService from "@/services/OrderService";
import Image from "next/image";
import Swal from "sweetalert2";
import { Order, OrderMenu } from "@/Interfaces/OrderInterface";
import { ChangeEvent } from "react";
import { isResponseOk } from "@/utils/AppUtils";

export default function VendorPage({
  params,
}: {
  params: { vendorId: bigint };
}) {
  const [vendor, setVendor] = useState<Vendor>();
  const [menus, setMenus] = useState<Menu[]>([]);
  // const router = useRouter();

  useEffect(() => {
    if (!params.vendorId) {
      return;
    }
    VendorService.getVendorById(params.vendorId)
      .then((vendorRes) => {
        if (!vendorRes.data) return;
        setVendor(vendorRes.data); // Wrap the data in an array if it's not null
        console.log("this vendor", vendorRes.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Cannot get vendor", "error");
      });

    // Fetch and set the list of menus when the component mounts
    MenuService.getAllMenusByVendorId(params.vendorId)
      .then((menuRes) => {
        if (!menuRes.data) return;
        setMenus(menuRes.data); // Wrap the data in an array if it's not null
        console.log("this all menus", menuRes.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Cannot get vendor", "error");
      });
  }, [params.vendorId]);

  // Placeholder for the checkout function
  const handleCheckout = () => {
    // Get the selected menus and their quantities
    const selectedMenus: OrderMenu[] = menus
      .filter((menu) => menu.is_available)
      .map((menu) => {
        const quantity = parseInt(
          (document.getElementById(`quantity-${menu.id}`) as HTMLInputElement)
            .value
        );
        return {
          menu_id: menu.id.toString(),
          price: menu.price,
          amount: quantity,
        };
      })
      .filter((menu) => menu.amount > 0); // Exclude menus with quantity 0

    // Check if there are any selected menus
    if (selectedMenus.length === 0) {
      // Display a message indicating that no items were selected
      Swal.fire(
        "Warning",
        "Please select at least one item to order",
        "warning"
      );
      return; // Exit the function without placing the order
    }

    // Prepare the data to be sent to the backend
    const orderData: Order = {
      order_menus: selectedMenus,
      user_id: vendor?.owner_id, // You might need to get this from your authentication system
      vendor_id: params.vendorId.toString(),
    };

    OrderService.createOrder(orderData)
      .then((response) => {
        if (!isResponseOk(response)) {
          throw new Error("Failed to place order");
        }
        return response.data;
      })
      .then((data) => {
        console.log("Order placed successfully", data);
        // Show success message using SweetAlert
        Swal.fire("Success!", "Order placed successfully!", "success");
        // window.location.reload();
        // Reset the quantity inputs to zero
        menus
          .filter((menu) => menu.is_available)
          .forEach((menu) => {
            const quantityInput = document.getElementById(
              `quantity-${menu.id}`
            ) as HTMLInputElement;
            if (quantityInput) {
              quantityInput.value = "0";
            }
          });
      })
      .catch((error) => {
        console.error("Error placing order", error);
        // Handle error, e.g., show an error message to the user
        Swal.fire("Error", "Failed to place order", "error");
      });
  };
  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 space-y-4 ">
      <h1 className="text-3xl font-bold">{vendor.name}</h1>
      <h3 className="text-xl font-regular">
        (Time: {vendor.opening_timestamp} - {vendor.closing_timestamp})
      </h3>
      <h2 className="text-2xl font-bold">Menu List</h2>
      <div className="bg-slate-50 p-5 rounded-lg">
        {menus.filter((menu) => menu.is_available).length === 0 ? (
          <p className="text-red-500 font-semibold p-10 m-10">
            Sorry, we're running out of food.
          </p>
        ) : (
          <div className="p-2 flex-wrap">
            {menus
              .filter((menu) => menu.is_available)
              .map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white p-4 rounded-lg shadow flex m-4"
                >
                  <div className="w-1/3">
                    <Image
                      src={menu.image_path}
                      alt="Menu Picture"
                      width={200}
                      height={150}
                      objectFit="fill"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="w-2/3 pl-4">
                    <p className="text-2xl font-semibold text-indigo-700">
                      {menu.name} - ${menu.price}
                    </p>
                    <p className="text-gray-600">{menu.description}</p>
                    <div className="mt-4">
                      <label
                        htmlFor={`quantity-${menu.id}`}
                        className="text-gray-700 font-semibold"
                      >
                        Quantity:
                      </label>
                      <input
                        type="number"
                        id={`quantity-${menu.id}`}
                        min="0"
                        defaultValue={0}
                        className="w-16 h-10 border border-gray-300 rounded-md px-2 ml-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        <button
          type="submit"
          onClick={handleCheckout}
          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Order
        </button>
      </div>
    </div>
  );
}
