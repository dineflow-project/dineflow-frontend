// pages/canteen/[canteenId]/vendor/[vendorId].tsx
"use client";
import { useRouter } from "next/navigation";
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
import PriceFilter from "@/components/PriceFilter";
import ReviewService from "@/services/ReviewService";
import {
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function VendorPage({
  params,
}: {
  params: { vendorId: bigint };
}) {
  const [vendor, setVendor] = useState<Vendor>();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [score, setScore] = useState<number | undefined>(undefined); // Changed to allow for null
  const [quantityErrors, setQuantityErrors] = useState<
    Record<number, string | null>
  >({});
  const [minFilterPrice, setMinFilterPrice] = useState<number | null>(null);
  const [maxFilterPrice, setMaxFilterPrice] = useState<number | null>(null);
  console.log("in the page order", sessionStorage);
  const router = useRouter();
  const accessToken = sessionStorage.getItem("accessToken");
  // console.log("order session storage", sessionStorage);
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  // console.log("roleeeeee", role);

  const handleQuantityInput = (
    menuId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;

    // Check if the input is a valid positive integer
    if (
      !/^\d+$/.test(inputValue) ||
      inputValue.includes(".") ||
      parseInt(inputValue) < 0
    ) {
      // Set the error message for the specific menu
      setQuantityErrors((prevErrors) => ({
        ...prevErrors,
        [menuId]: "Please enter a valid positive integer.",
      }));
    } else {
      // Clear the error message if the input is valid
      setQuantityErrors((prevErrors) => ({
        ...prevErrors,
        [menuId]: null,
      }));
    }
  };

  const handlePriceFilter = (min: number | null, max: number | null) => {
    console.log("filter", min, max);
    setMinFilterPrice(min);
    setMaxFilterPrice(max);
  };

  // vendor data
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
    ReviewService.getAvgReviewScoreByVendorId(params.vendorId.toString()).then(
      (reviewRes) => {
        setScore(reviewRes.data);
      }
    );
  }, [params.vendorId]);

  //avg acore

  // filter menu
  useEffect(() => {
    if (vendor) {
      MenuService.getAllMenus(
        vendor.canteen_id,
        params.vendorId,
        minFilterPrice || 0,
        maxFilterPrice || 9999999
      )
        .then((menuRes) => {
          if (!menuRes.data) return;
          setMenus(menuRes.data); // Wrap the data in an array if it's not null
          console.log("this all menus", menuRes.data);
        })
        .catch((err) => {
          console.log(err);
          Swal.fire("Error", "Cannot get vendor", "error");
        });
    }
  }, [vendor, params.vendorId, minFilterPrice, maxFilterPrice]);

  const handleCheckout = () => {
    if (accessToken == null) {
      Swal.fire("Error", "Please sign in before order", "error");
      router.push("/signin");
      // clearInterval(interval);
      return;
    }
    // Check if there's an error before proceeding with checkout
    const hasErrors = Object.values(quantityErrors).some(
      (error) => error !== null
    );
    if (hasErrors) {
      // Display a message indicating the error
      Swal.fire("Warning", "Please enter a valid positive integer.", "warning");
      return;
    }

    // Get the selected menus and their quantities
    const selectedMenus: OrderMenu[] = menus
      .filter((menu) => menu.is_available == "yes")
      .map((menu) => {
        // console.log(`Element with id 'quantity-${menu.id}'`);

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

    // Calculate the total amount
    const totalAmount = selectedMenus.reduce(
      (total, menu) => total + menu.price * menu.amount,
      0
    );

    // Show a confirmation message with the total amount
    Swal.fire({
      title: "Confirm Order",
      html: `Total Amount: $${totalAmount.toFixed(2)}`,
      showCancelButton: true,
      confirmButtonText: "Place Order",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        if (userId) {
          // Prepare the data to be sent to the backend
          const orderData: Order = {
            order_menus: selectedMenus,
            user_id: userId,
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
              Swal.fire({
                icon: "success",
                title: "Success!",
                html: "Order placed successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              // Clear all quantity inputs
              menus
                .filter((menu) => menu.is_available === "yes")
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
        }
      }
    });
  };

  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 space-y-4 ">
      <div className="flex items-center space-x-4 mb-4">
        <Image
          src={vendor.image_path}
          alt={`Image for ${vendor.name}`}
          className="rounded-lg"
          width={100}
          height={100}
        />
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <div className="flex items-center mb-2">
            <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
            <p className="text-gray-600">
              {vendor.opening_timestamp} - {vendor.closing_timestamp}
            </p>
          </div>
          {score !== null && (
            <div className="flex items-center mb-2">
              <StarIcon className="h-4 w-4 mr-2 text-gray-500" />
              <p className="text-gray-600">{score}</p>
            </div>
          )}

          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => router.push(`/reviews/${params.vendorId}`)}
          >
            <span className="text-indigo-700">All Reviews</span>
            <ArrowRightIcon className="h-5 w-5 text-indigo-700" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold">Menu List</h2>

      {/* filter */}
      <PriceFilter onFilter={handlePriceFilter} />
      <div className="bg-slate-50 p-5 rounded-lg">
        {menus.filter((menu) => menu.is_available === "yes").length === 0 ? (
          <p className="text-red-500 font-semibold p-10 m-10">
            Sorry, no menu available.
          </p>
        ) : (
          <div className="p-2 flex-wrap">
            {menus
              .filter((menu) => menu.is_available === "yes")
              .map((menu) => (
                <div
                  key={menu.id}
                  className="bg-white p-4 rounded-lg shadow flex m-4"
                >
                  <div className="w-1/3">
                    <Image
                      src={menu.image_path}
                      alt="Menu Picture"
                      className="rounded-lg"
                      width={200}
                      height={200}
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
                        onChange={(e) => handleQuantityInput(menu.id, e)}
                        className="w-16 h-10 border border-gray-300 rounded-md px-2 ml-2"
                      />
                      {quantityErrors[menu.id] && (
                        <p className="text-red-500 text-sm mt-2">
                          {quantityErrors[menu.id]}
                        </p>
                      )}
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
