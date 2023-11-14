"use client";
import { useEffect, useState } from "react";
import { Notification } from "../../Interfaces/NotiInterface";
import { GetAllNotifiactions } from "@/services/NotificationService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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
      const response = await GetAllNotifiactions(userId); // Implement your service method
      if (response.data) {
        console.log(response.data);
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Notification Page</h1>
      <div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={
              notification.is_read
                ? "bg-white p-4 rounded-lg shadow flex mb-4"
                : "bg-cyan-50 p-4 rounded-lg shadow flex mb-4"
            }
          >
            <p className="mr-4">{notification.type}</p>
            <p className="text-gray-500">{notification.timestamp}</p>
          </div>
        ))}
        {notifications.length === 0 && <p>No notifications available.</p>}
      </div>
    </div>
  );
};

export default NotificationPage;
