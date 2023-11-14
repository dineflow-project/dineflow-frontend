"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import VendorService from "../../../services/VendorService";
import { Vendor } from "../../../Interfaces/VendorInterface";
import Link from "next/link";
import Swal from "sweetalert2";
import { getCanteenByID } from "@/services/CanteenService";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline";
import ReviewService from "@/services/ReviewService";

export default function CanteenDetailPage({
  params,
}: {
  params: { canteenId: bigint };
}) {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const fetchAllVendors = useCallback(() => {
    VendorService.getAllVendorsByCanteenId(params.canteenId)
      .then((vendorRes) => {
        if (!vendorRes.data) return;
        // Fetch average scores for each vendor
        setVendors(vendorRes.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Cannot get vendors", "error");
      });
  }, [params.canteenId]);

  useEffect(() => {
    fetchAllVendors();
  }, [fetchAllVendors]);

  return (
    <div className="container mx-auto  p-20">
      <h1 className="text-3xl font-bold mb-8">Vendors in Canteen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {vendors
          .filter((vendor) => vendor.status === "Open")
          .map((vendor) => (
            <Link
              key={vendor.id}
              href={`/canteen/${vendor.canteen_id}/vendor/${vendor.id}`}
            >
              <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <img
                  src={vendor.image_path}
                  alt={`Image for ${vendor.name}`}
                  className="mb-4 rounded-md w-full h-32 object-cover"
                />
                <h2 className="text-xl font-semibold mb-2">{vendor.name}</h2>
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="text-gray-600">
                    {vendor.opening_timestamp} - {vendor.closing_timestamp}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-blue-500">View Details</span>
                  <ArrowRightIcon className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
