// pages/canteen/[canteenId]/vendor/[vendorId].tsx
"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VendorPage = () => {
  // const router = useRouter();
  // const { canteenId, vendorId } = router.query;

  const [vendor, setVendor] = useState({
    canteen_id: 1,
    name: "Vendor 3",
    owner_id: {
      Bool: false,
      Valid: false,
    },
    opening_timestamp: "2023-09-16 08:00:00",
    closing_timestamp: "2023-09-16 18:00:00",
    status: "Open",
  });
  const [menus, setMenus] = useState([
    {
      _id: 1,
      vendor_id: 3,
      name: "noodles",
      price: 15,
      image_path: "-",
      description: "Slurpy",
      is_available: true,
    },
    {
      // check id again when know backend
      _id: 2,
      vendor_id: 3,
      name: "padthai",
      price: 15,
      image_path: "-",
      description: "Slurpy",
      is_available: true,
    },
  ]);

  // useEffect(() => {
  //   // Fetch vendor details
  //   fetch(`http://localhost:8090/vendors/${vendorId}`)
  //     .then((response) => response.json())
  //     .then((data) => setVendor(data));

  //   // Fetch list of menus
  //   fetch(`http://localhost:8090/menus/vendors/${vendorId}`)
  //     .then((response) => response.json())
  //     .then((data) => setMenus(data));
  // }, [vendorId]);

  // Placeholder for the checkout function
  const handleCheckout = () => {
    // Implement the checkout logic here
    console.log("Checkout function not implemented");
  };

  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{vendor.name}</h1>
      <p>Open Time: {vendor.opening_timestamp}</p>
      <p>Close Time: {vendor.closing_timestamp}</p>

      <h2>Menu</h2>
      <div>
        {menus.map((menu) => (
          <div key={menu._id}>
            {menu.name} - {menu.price}
            <p>{menu.description}</p>
            <div>
              <label htmlFor={`quantity-${menu._id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${menu._id}`}
                min="0"
                defaultValue={0} // Set the default quantity to 0
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default VendorPage;
