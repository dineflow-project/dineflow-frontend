"use client";
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { Vendor } from '../Interfaces/VendorInterface';

interface Canteen {
  id: bigint;
  name: string;
}

export default function Vendor() {
  const [user, setUser] = useState<any>();
  const [vendor, setVendor] = useState<Vendor>();
  const [canteen, setCanteen] = useState<Canteen>();

  useEffect(() => {
    axios.post('http://localhost:8000/api/auth/login', {
      email: 'vendor1@gmail.com',
      password: 'password123',
    })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem('token', res.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users/me', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        setUser(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/vendor/1')
      .then((res) => {
        setVendor(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!vendor) {
      return;
    }
    axios.get('http://localhost:8000/canteen/' + vendor.canteen_id)
      .then((res) => {
        setCanteen(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vendor]);

  if (!vendor) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="p-4 space-y-4">
        <h1 className="text-3xl font-bold">{vendor.name}</h1>
        <p>Canteen: {canteen?.name}</p>
        <p>Open Time: {vendor.opening_timestamp}</p>
        <p>Close Time: {vendor.closing_timestamp}</p>
      </div>
    </>
  );
}
