"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CanteenService, Canteen } from "../services/CanteenService";

// const canteens = [
//   {
//     id: "01",
//     name: "iCanteen",
//     price: "$35",
//     href: "#",
//     image_path: "/img/cat_meme.jpg",
//     description: "Honey",
//     is_available: true,
//   },
//   {
//     id: "02",
//     name: "Aksorn",
//     price: "$5",
//     href: "#",
//     image_path: "/img/cat_peek.jpg",
//     description: "Chocolate from Belgium",
//     is_available: true,
//   },
// ];

export default function Home() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);

  useEffect(() => {
    // Fetch canteens when the component mounts
    const fetchCanteens = async () => {
      try {
        const canteens = await CanteenService.getAllCanteens();
        setCanteens(canteens);
        console.log("canteen data", canteens);
      } catch (error) {
        console.error("Error fetching canteens:", error);
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
