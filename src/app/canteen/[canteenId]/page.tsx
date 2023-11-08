"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import VendorService from "../../../services/VendorService";
import { Vendor } from "@/app/Interfaces/VendorInterface";
import Link from "next/link";
import Swal from "sweetalert2";
import { getCanteenByID } from "@/services/CanteenService";

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
    <div className="m-10">
      <h1 className="text-2xl font-semibold mb-4">Vendors in Canteen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {vendors
          .filter((vendor) => vendor.status === "Open")
          .map((vendor) => (
            <Link
              key={vendor.id}
              href={`/canteen/${vendor.canteen_id}/vendor/${vendor.id}`}
            >
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{vendor.name}</h2>
                {/* <p>Status: {vendor.status}</p> */}
                <p>
                  Time: {vendor.opening_timestamp} - {vendor.closing_timestamp}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
