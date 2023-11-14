// pages/orders/index.tsx
"use client";
import { useEffect, useState } from "react";
import OrderService from "@/services/OrderService";
import MenuService from "@/services/MenuService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Order } from "../../Interfaces/OrderInterface";
import VendorService from "@/services/VendorService";

const Orders = () => {
  const orderStatuses = ["waiting", "cooking", "finish"];
  const [activeTab, setActiveTab] = useState(orderStatuses[0]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-200 text-yellow-800";
      case "cooking":
        return "bg-cyan-200 text-cyan-800";
      case "finish":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          Swal.fire("Login first", "Please login to see order history", "info");
          setError("Please login to see order history");
          router.push("/signin");
          return;
        }

        const orderRes = await OrderService.getOrdersByUserId(userId);
        if (orderRes.data) {
          const ordersWithMenus = await Promise.all(
            orderRes.data.map(async (order) => {
              let vendorData = null;

              if (order.vendor_id) {
                const vendorIdBigInt = BigInt(order.vendor_id);
                vendorData = await VendorService.getVendorById(vendorIdBigInt);
              }

              let menusWithDetails = null;

              if (order.order_menus) {
                menusWithDetails = await Promise.all(
                  order.order_menus.map(async (menu) => {
                    const menuIdBigInt = BigInt(menu.menu_id);
                    const menuData = await MenuService.getMenuById(
                      menuIdBigInt
                    );

                    return {
                      ...menu,
                      menu_details: menuData.data,
                    };
                  })
                );
              }

              return {
                ...order,
                order_menus: menusWithDetails || [], // Ensure order_menus is not null
                vendor_name: vendorData?.data?.name,
              };
            })
          );
          console.log("Order with menus", ordersWithMenus);
          setOrders(ordersWithMenus);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Cannot get orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const renderOrdersByStatus = (status: string) => {
    const filteredOrders = orders.filter((order) => order.status === status);
    return (
      <div
        key={status}
        className={`mt-8 ${activeTab === status ? "block" : "hidden"}`}
      >
        <h2 className="text-2xl font-bold mb-4">
          {status.charAt(0).toUpperCase() + status.slice(1)} Orders
        </h2>
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow mb-4">
            <div className="flex flex-row justify-between">
            {order.vendor_name && (
              <p className="text-lg font-bold">{order.vendor_name}</p>
            )}
            <p className="pr-4">${order.price}</p>
            </div>
            <p className="text-sm text-gray-700">(Order ID: {order.id})</p>
            {/* <p className="text-gray-700">User ID: {order.user_id}</p> */}
            <div className="mt-2">
              <span
                className={`px-2 py-1 rounded ${
                  order.status ? getStatusColor(order.status) : ""
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4">
              {order.order_menus?.map((menu) => (
                <div key={menu.menu_id} className="mt-4 flex items-center">
                  {menu.menu_details && (
                    <>
                      <img
                        src={menu.menu_details.image_path}
                        alt={menu.menu_details.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <p className="text-lg font-semibold">
                          {menu.menu_details.name}
                        </p>
                        <p className="text-gray-500">
                          Quantity: {menu.amount}
                          {/* Quantity: {menu.amount} | Price: ${menu.price} */}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Order Page</h1>

      <div className="flex mb-8">
        {orderStatuses.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 mr-4 ${
              activeTab === status ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {renderOrdersByStatus(activeTab)}
    </div>
  );
};

export default Orders;
