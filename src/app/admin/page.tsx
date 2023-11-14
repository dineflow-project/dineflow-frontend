"use client";
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Vendor } from '@/Interfaces/VendorInterface';
import VendorService from '@/services/VendorService';
import { Canteen } from '@/Interfaces/CanteenInterface';
import { getAllCanteens, getCanteenByID } from '@/services/CanteenService';
import ReviewService from '@/services/ReviewService';

export default function Vendor() {
  const [vendor, setVendor] = useState<Vendor>();
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [canteen, setCanteen] = useState<Canteen>();
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingVendor, setEditingVendor] = useState<Vendor>();

  useEffect(() => {
    VendorService.getMyVendor()
        .then((res) => {
            setVendor(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    getAllCanteens()
        .then((res) => {
            setCanteens(res.data ? res.data : []);
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

  const handleSaveVendor = (vendor: Vendor) => {
    VendorService.updateVendorById(vendor.id, vendor)
      .then((res) => {
        console.log(res);
        setVendor(editingVendor!);
        setCanteen(selectedCanteen!);
        setShowModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="p-4 space-y-4 block max-w-5xl m-auto">
        <div className="flex flex-row px-10 py-2">
          {vendor.image_path.startsWith('http') ? (
              <Image
                  src={vendor.image_path}
                  alt="Vendor Picture"
                  width={300}
                  height={300}
                  style={{ maxHeight: '300px', maxWidth: '300px' }}
                  className="rounded-lg"
              />
            ) : <div className='flex w-72 h-72 rounded-lg border-2 border-gray-300'><p className='m-auto'>No Image</p></div>}
          <div className="flex flex-col justify-center ml-16">
            <h1 className="text-3xl font-bold pb-8">{vendor.name}</h1> 
            <p>Canteen: {canteen?.name}</p>
            <p>Open Time: {vendor.opening_timestamp}</p>
            <p>Close Time: {vendor.closing_timestamp}</p>
          </div>
          <div className='ml-auto'>
            <button 
              className="text-gray-800 hover:text-gray-200  bg-gray-200 hover:bg-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => {
                setEditingVendor(vendor);
                setSelectedCanteen(canteen? canteen : null);
                setShowModal(true);
              }}
            >
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
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="m-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <div className="flex flex-row justify-between">
                                <h3 className="text-lg leading-6 font-medium text-xl font-bold text-gray-900">
                                  Edit Vendor
                                </h3>
                            </div>
                            <hr className="my-2 border-gray-400" />
                            <div className="mt-2">
                                <form className="space-y-6" onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!editingVendor?.name) {
                                        alert('Please enter a name');
                                        return;
                                    }
                                    editingVendor.canteen_id = selectedCanteen?.id || vendor.canteen_id;
                                    handleSaveVendor(editingVendor!);
                                }}>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={editingVendor?.name}
                                                onChange={(e) => setEditingVendor((prevVendor) => ({
                                                    ...prevVendor!,
                                                    name: e.target.value,
                                                }))}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Canteen
                                        </label>
                                        <div className="mt-1">
                                          <select
                                            id="canteen"
                                            value={Number(selectedCanteen?.id)}
                                            onChange={(e) => {
                                              const canteenId = Number(e.target.value);
                                              console.log(canteenId);
                                              console.log(canteens)
                                              const canteen = canteens.find((c) => Number(c.id) == canteenId);
                                              console.log(canteen);
                                              setSelectedCanteen(canteen || null);
                                            }}
                                          >
                                            {canteens.map((canteen) => (
                                              <option key={canteen.id} value={Number(canteen.id)}>
                                                {canteen.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="image_path" className="block text-sm font-medium text-gray-700">
                                            Image Url
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="image_path"
                                                id="image_path"
                                                value={editingVendor?.image_path}
                                                onChange={(e) => setEditingVendor((prevVendor) => ({
                                                    ...prevVendor!,
                                                    image_path: e.target.value,
                                                }))}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                            Opening Time
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="opening_timestamp"
                                                id="opening_timestamp"
                                                value={editingVendor?.opening_timestamp}
                                                onChange={(e) => setEditingVendor((prevVendor) => ({
                                                    ...prevVendor!,
                                                    opening_timestamp: e.target.value,
                                                }))}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="image_path" className="block text-sm font-medium text-gray-700">
                                            Closing Time
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="closing_timestamp"
                                                id="closing_timestamp"
                                                value={editingVendor?.closing_timestamp}
                                                onChange={(e) => setEditingVendor((prevVendor) => ({
                                                    ...prevVendor!,
                                                    closing_timestamp: e.target.value,
                                                }))}
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                                            onClick={() => {
                                                setShowModal(false)
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-transparent rounded-md hover:bg-gray-700"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </>
  );
}
