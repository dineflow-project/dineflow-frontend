"use client";
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Vendor } from '@/Interfaces/VendorInterface';
import VendorService from '@/services/VendorService';
import { Canteen } from '@/Interfaces/CanteenInterface';
import { getCanteenByID } from '@/services/CanteenService';
import ReviewService from '@/services/ReviewService';

export default function Vendor() {
  const [vendor, setVendor] = useState<Vendor>();
  const [canteen, setCanteen] = useState<Canteen>();
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    VendorService.getMyVendor()
        .then((res) => {
            setVendor(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
  }, []);

  useEffect(() => {
    if (!vendor) {
      return;
    }
    getCanteenByID(vendor.canteen_id)
      .then((res) => {
        setCanteen(res.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    ReviewService.getReviewByVendorId(vendor.id.toString())
      .then((res) => {
        setReviews(res.data ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
      });
    ReviewService.getAvgReviewScoreByVendorId(vendor.id.toString())
      .then((res) => {
        setAvgRating(res.data ? res.data : 0);
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
      <div className="p-4 space-y-4 block max-w-5xl m-auto">
        <div className="flex flex-row px-10 py-2">
          <Image
              src="https://media.discordapp.net/attachments/1171496314807267378/1171496484542361640/photo-1565299624946-b28f40a0ae38.png?ex=655ce41f&is=654a6f1f&hm=e7f4a7caf3ca680889ad63611fdc49e2ab35aba3724218f94619f1d4eb913a19&=&width=458&height=553"
              alt="Menu Picture"
              width={300}
              height={300}
              style={{ maxHeight: '300px', maxWidth: '300px' }}
              className="rounded-lg"
          />
          <div className="flex flex-col justify-center ml-16">
            <h1 className="text-3xl font-bold pb-8">{vendor.name}</h1> 
            <p>Canteen: {canteen?.name}</p>
            <p>Open Time: {vendor.opening_timestamp}</p>
            <p>Close Time: {vendor.closing_timestamp}</p>
          </div>
          <div className='ml-auto'>
            <button className="text-gray-800 hover:text-gray-200  bg-gray-200 hover:bg-gray-800 font-bold py-2 px-4 rounded">
              Edit
            </button>
          </div>
        </div>
        <hr className='border-gray-300' />
        <div className="flex flex-row px-10 py-2">
          <h1 className="text-2xl font-bold px-6">Reviews</h1>
          <p className='text-base pt-1 pl-2'>Average Rating: {avgRating.toFixed(1)}/5.0</p>
        </div>
        <hr className='border-gray-300' />
        <div className="space-y-2 px-16">
          {!reviews || reviews.length === 0 ? 
          (<p className='pl-12'>No reviews yet</p>) : (
          reviews.map((review) => (
            <div className="border p-4 space-y-1">
              <p>{review.score}/5</p>
              <p>{review.description}</p>
            </div>
          )))}
        </div>
      </div>
    </>
  );
}
