"use client";
import { Menu } from "@/Interfaces/MenuInterface";
import { Order } from "@/Interfaces/OrderInterface";
import MenuService from "@/services/MenuService";
import OrderService from "@/services/OrderService";
import VendorService from "@/services/VendorService";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Order() {
    const [activeTab, setActiveTab] = useState("waiting");
    const [vendor, setVendor] = useState<any>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [showOrder, setShowOrder] = useState<Map<string, boolean>>(new Map());

    useEffect(() => {
        VendorService.getMyVendor()
            .then((res) => {
                setVendor(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }, []);
        
    useEffect(() => {
        if (!vendor) {
            return;
        }
        MenuService.getAllMenusByVendorId(vendor.id)
            .then((res) => {
                setMenus(res.data ? res.data : []);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        OrderService.getOrdersByVendorId(vendor.id)
            .then((res) => {
                setOrders(res.data ? res.data : []);
                // setOrders([
                //     {
                //         id: 'aaaaaa',
                //         status: "waiting",
                //         order_menus: [
                //             {
                //                 menu_id: menus[0].id,
                //                 amount: 1,
                //                 price: 1,
                //             },
                //             {
                //                 menu_id: menus[1].id,
                //                 amount: 2,
                //                 price: 1,
                //             },
                //         ],
                //     },
                //     {
                //         id: 'abababa',
                //         status: "waiting",
                //         order_menus: [
                //             {
                //                 menu_id: menus[0].id,
                //                 amount: 1,
                //                 price: 1,
                //             },
                //             {
                //                 menu_id: menus[1].id,
                //                 amount: 2,
                //                 price: 1,
                //             },
                //         ],
                //     },
                //     {
                //         id: 'bbbbbb',
                //         status: "cooking",
                //         order_menus: [
                //             {
                //                 menu_id: menus[0].id,
                //                 amount: 1,
                //                 price: 1,
                //             },
                //             {
                //                 menu_id: menus[1].id,
                //                 amount: 3,
                //                 price: 1,
                //             },
                //         ],
                //     },
                //     {
                //         id: 'cccccc',
                //         status: "finished",
                //         order_menus: [
                //             {
                //                 menu_id: menus[0].id,
                //                 amount: 1,
                //                 price: 1,
                //             },
                //             {
                //                 menu_id: menus[1].id,
                //                 amount: 4,
                //                 price: 1,
                //             },
                //         ],
                //     },
                // ])
                // console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [vendor]);

    return (
        <div className="p-4 space-y-4 block max-w-5xl m-auto">
            <div className="btn-group" role="group">
                <button
                    type="button"
                    className={`btn ${
                        activeTab === "waiting"
                            ? "btn-primary font-bold underline"
                            : "btn-secondary"
                    } p-2 w-1/3 text-xl`}
                    onClick={() => setActiveTab("waiting")}
                >
                    Incoming
                </button>
                <button
                    type="button"
                    className={`btn ${
                        activeTab === "cooking"
                            ? "btn-primary font-bold underline"
                            : "btn-secondary"
                    } p-2 w-1/3 text-xl`}
                    onClick={() => setActiveTab("cooking")}
                >
                    In Progress
                </button>
                <button
                    type="button"
                    className={`btn ${
                        activeTab === "finished"
                            ? "btn-primary font-bold underline"
                            : "btn-secondary"
                    } p-2 w-1/3 text-xl`}
                    onClick={() => setActiveTab("finished")}
                >
                    Completed
                </button>
            </div>
            <div>
                <hr className="border-gray-400"/>
                {orders == null || orders.length === 0 ? <p className="px-8 py-4">No orders</p>:
                orders.length !== 0 && orders
                    .filter((order) => order.status === activeTab)
                    .map((order) => (
                        <div key={order.id}>
                            <div className="flex flex-row justify-between p-2">
                                <p>Order ID: {order.id}</p>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const newShowOrder = new Map(showOrder);
                                        newShowOrder.set(order.id!, !showOrder.get(order.id!));
                                        setShowOrder(newShowOrder);
                                    }}
                                >
                                    {showOrder.get(order.id!) ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showOrder.get(order.id!) && <hr className="border-gray-400 pb-2"/>}
                            {showOrder.get(order.id!) && 
                                order.order_menus?.map((orderMenu) => (
                                    <p className="px-8" key={orderMenu.menu_id}>
                                        x{orderMenu.amount}
                                        {"\t"}
                                        {menus.find(
                                            (menu) => menu.id === orderMenu.menu_id
                                        )?.name}
                                    </p>))
                            }
                            {showOrder.get(order.id!) && 
                                (order.status !== "finished" ? <>
                                    <div className="flex flex-row px-8">
                                    <button
                                        type="button"
                                        className={`btn btn-primary ml-auto px-4 py-2 mb-2 w-32 rounded ${order.status === "waiting" ? "bg-green-200 hover:bg-green-300" : "bg-blue-200 hover:bg-blue-300"}`}
                                        onClick={() => {
                                            axios.put(`http://localhost:8000/order/${order.id}`, {
                                                status: order.status === "waiting" ? "cooking" : "finished",
                                            })
                                                .then((res) => {
                                                    const newOrders = [...orders];
                                                    const index = newOrders.findIndex((o) => o.id === order.id);
                                                    newOrders[index] = res.data.data;
                                                    setOrders(newOrders);
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        }}
                                    >
                                        {order.status === "waiting" ? "Start" : "Finish"}
                                    </button>
                                    </div>
                                </> : <div className="p-1"></div>)
                            }
                            <hr className="border-gray-400"/>
                        </div>
                ))}
            </div>
        </div>
    );
}
