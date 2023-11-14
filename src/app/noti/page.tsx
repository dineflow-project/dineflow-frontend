"use client";
import { useEffect, useState } from "react";
import { Notification } from "../../Interfaces/NotiInterface";
import { GetAllNotifiactions } from "@/services/NotificationService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import {
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import VendorService from "@/services/VendorService";

const getNotificationTypeStyle = (type: string) => {
  switch (type) {
    case "new order":
      return "text-blue-500 font-semibold text-base"; // Green text for new order
    case "cooking order":
      return "text-blue-500 font-semibold text-base"; // Yellow text for cooking order
    case "finish order":
      return "text-green-500 font-semibold text-base"; // Blue text for finish order
    default:
      return "text-gray-700 font-semibold text-base"; // Default text color
  }
};

const getNotificationMessage = (type: string) => {
  switch (type) {
    case "new order":
      return "You've received a new order. Please confirm it for preparation.";
    case "cooking order":
      return "Your delicious meal is currently being prepared. Thank you for your patience.";
    case "finish order":
      return "Ready for pickup. Don't forget to share your feedback!";
    default:
      return "Unknown Notification";
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "new order":
      return <ExclamationCircleIcon className="h-6 w-6 text-blue-500" />;
    case "cooking order":
      return <ClockIcon className="h-6 w-6 text-blue-500" />;
    case "finish order":
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    default:
      return <ExclamationCircleIcon className="h-6 w-6 text-gray-700" />;
  }
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const router = useRouter();
  const accessToken = sessionStorage.getItem("accessToken");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");

  // if (!userId) {
  //   Swal.fire("Login first", "Please login to see order history", "info");
  //   console.log("Please login to see noti");
  //   router.push("/signin");
  //   return;
  // }
  if (accessToken == null) {
    console.log("please login before");
    Swal.fire("Login first", "Please login to see notification", "info");
    router.push("/signin");
    // clearInterval(interval);
    return;
  }

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      if (!userId) return null;
      if (role == "vendor") {
        const res = await VendorService.getMyVendor();
        const response = await GetAllNotifiactions(res.data!.id.toString());
        if (response.data) {
          console.log(response.data);
          setNotifications(response.data);
        }
      } else {
        const response = await GetAllNotifiactions(userId); // Implement your service method
        if (response.data) {
          console.log(response.data);
          setNotifications(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  //   return (
  //     <div className="container mx-auto p-8">
  //       <h1 className="text-3xl font-bold mb-8">Notification Page</h1>
  //       <div>
  //         {notifications.map((notification) => (
  //           <div
  //             key={notification.id}
  //             className={
  //               notification.is_read
  //                 ? "bg-white p-4 rounded-lg shadow flex mb-4"
  //                 : "bg-cyan-50 p-4 rounded-lg shadow flex mb-4"
  //             }
  //           >
  //             <p className="mr-4">{notification.type}</p>
  //             <p className="text-gray-500">{notification.timestamp}</p>
  //           </div>
  //         ))}
  //         {notifications.length === 0 && <p>No notifications available.</p>}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Notification</h1>
      <div>
        {notifications.reverse().map((notification) => (
          <div
            key={notification.id}
            className={`${
              notification.is_read ? "bg-white" : "bg-slate-100"
            } p-4 rounded-lg shadow flex mb-4`}
          >
            <div className="mr-4">{getNotificationIcon(notification.type)}</div>
            <div>
              <p className={`${getNotificationTypeStyle(notification.type)}`}>
                {getNotificationMessage(notification.type)}
              </p>
              <p className="text-gray-800">
                (Order ID: {notification.order_id})
              </p>
              <p className="text-gray-500">
                {new Date(notification.timestamp).toLocaleString("en-US", {
                  timeZone: "Asia/Bangkok",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: false,
                })}
              </p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p>No notifications available.</p>}
      </div>
    </div>
  );
};

export default NotificationPage;
