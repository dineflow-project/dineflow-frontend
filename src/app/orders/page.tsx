// pages/orders/index.tsx
"use client";
import { useEffect, useState } from "react";
import OrderService from "@/services/OrderService";
import MenuService from "@/services/MenuService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Order } from "../../Interfaces/OrderInterface";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
              if (order.order_menus) {
                const menusWithDetails = await Promise.all(
                  order.order_menus.map(async (menu) => {
                    const menuIdBigInt = BigInt(menu.menu_id);
                    const menuData = await MenuService.getMenuById(
                      menuIdBigInt
                    );
                    return { ...menu, menu_details: menuData.data };
                  })
                );
                return { ...order, order_menus: menusWithDetails };
              }
              return order;
            })
          );

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
      <div key={status} className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{status} Orders</h2>
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="text-lg font-bold">Order ID: {order.id}</p>
            <p>User ID: {order.user_id}</p>
            <p>Status: {order.status}</p>
            <ul className="list-disc pl-8">
              {order.order_menus?.map((menu) => (
                <li key={menu.menu_id} className="mt-2">
                  Menu ID: {menu.menu_id}, Amount: {menu.amount}, Price:{" "}
                  {menu.price}
                  {menu.menu_details && (
                    <div className="mt-2">
                      Menu Details: {menu.menu_details.name} -{" "}
                      {menu.menu_details.description}
                      <img
                        src={menu.menu_details.image_path}
                        alt={menu.menu_details.name}
                        className="w-32 h-32 object-cover mt-2"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Order Page</h1>
      {renderOrdersByStatus("waiting")}
      {renderOrdersByStatus("cooking")}
      {renderOrdersByStatus("complete")}
    </div>
  );
};

export default Orders;
