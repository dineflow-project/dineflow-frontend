"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAllCanteens } from "../services/CanteenService";
import { Canteen } from "@/Interfaces/CanteenInterface";
import Swal from "sweetalert2";

export default function Home() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);

  useEffect(() => {
    // Fetch canteens when the component mounts
    const fetchCanteens = async () => {
      try {
        const canteensRes = await getAllCanteens();
        if (!canteensRes.data) return;
        setCanteens(canteensRes.data);
        console.log("canteen data", canteensRes.data);
      } catch (error) {
        // console.error("Error fetching canteens:", error);
        // Swal.fire("Error", "Cannot get canteens", "error");
      }
    };

    fetchCanteens();
  }, []);

  return (
    <main className="container mx-auto p-16">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">Canteen List</h1>
      </div>

      <div className="flex flex-wrap m-4 ">
        {canteens.map((canteen) => (
          <div
            key={canteen.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4 lg:p-8"
          >
            <Link href={`/canteen/${canteen.id}`}>
              <div className="border border-gray-200 hover:border-cyan-200  rounded-md hover:bg-cyan-50 transition duration-300 ease-in-out">
                <p className="text-lg font-semibold text-center mt-2">
                  {canteen.name}
                </p>
                <img
                  src={canteen.image_path} // Assuming there's an image_url property in your canteen object
                  alt={`Image for ${canteen.name}`}
                  className="mt-4 rounded-md w-full h-60 object-cover"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
