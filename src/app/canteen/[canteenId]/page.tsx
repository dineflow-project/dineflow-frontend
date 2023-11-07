"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import VendorService from "../../../services/VendorService";
import { Vendor } from "@/app/Interfaces/VendorInterface";
import Link from "next/link";

export default function CanteenDetailPage({
  params,
}: {
  params: { canteenId: bigint };
}) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  useEffect(() => {
    // Fetch and set the list of vendors when the component mounts
    VendorService.getAllVendorsByCanteenId(params.canteenId)
      .then((data) => {
        setVendors(data);
        console.log("vendor in canteen data", data);
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error);
      });
  }, [params.canteenId]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Vendors in Canteen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {vendors.map((vendor) => (
          <Link href={`/canteen/${vendor.canteen_id}/vendor/${vendor.id}`}>
            <div key={vendor.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{vendor.name}</h2>
              <p>Status: {vendor.status}</p>
              <p>Opening Time: {vendor.opening_timestamp}</p>
              <p>Closing Time: {vendor.closing_timestamp}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
