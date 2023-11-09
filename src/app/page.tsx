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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Canteen List</h1>
        <ul className="space-y-4">
          {canteens.map((canteen) => (
            <li
              key={canteen.id}
              className="border p-4 border-gray-200 rounded-md hover:bg-cyan-50"
            >
              <Link href={`/canteen/${canteen.id}`}>{canteen.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
