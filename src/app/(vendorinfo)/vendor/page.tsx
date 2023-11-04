"use client";
import ShoppingCart from "@/components/ShoppingCart";
import { useState } from "react";

export default function Vendor() {
  return (
    <main className="">
      <div>
        <h1>All Vendors in ICanteen</h1>
        <ShoppingCart />
      </div>
    </main>
  );
}
