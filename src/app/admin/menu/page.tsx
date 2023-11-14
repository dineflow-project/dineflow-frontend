"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';
import Image from 'next/image';
import { Menu } from '@/Interfaces/MenuInterface';
import VendorService from '@/services/VendorService';
import MenuService from '@/services/MenuService';
import { Vendor } from '@/Interfaces/VendorInterface';

export default function Menu() {
    const [vendor, setVendor] = useState<Vendor>();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [isNewMenu, setIsNewMenu] = useState<boolean>(true);
    const [showModal, setShowModal] = useState(false);

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
        MenuService.getAllMenusByVendorId(vendor?.id)
            .then((res) => {
                setMenus(res.data ? res.data : []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [vendor]);

    const handleSetAvailable = (menu: Menu) => {
        console.log(menu.id);
        menu.is_available = menu.is_available == "yes" ? "no" : "yes";
        MenuService.updateMenuById(menu.id, menu)
            .then((res) => {
                console.log(res);
                setMenus((prevMenus) => {
                    const index = prevMenus.findIndex((m) => m.id === menu.id);
                    const newMenus = [...prevMenus];
                    newMenus[index] = {
                        ...newMenus[index],
                        is_available: menu.is_available,
                    };
                    return newMenus;
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleEditMenu = (menu: Menu) => {
        setEditingMenu(menu);
        setIsNewMenu(false);
        setShowModal(true);
    }

    const handleSaveMenu = (menu: Menu) => {
        if(!isNewMenu) {
            MenuService.updateMenuById(menu.id, menu)
            .then((res) => {
                console.log(res.data);
                setMenus((prevMenus) => {
                    const index = prevMenus.findIndex((m) => m.id === menu.id);
                    const newMenus = [...prevMenus];
                    newMenus[index] = menu;
                    return newMenus;
                });
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            menu.vendor_id = vendor!.id;
            MenuService.createMenu(menu)
            .then((res) => {
                console.log(res.data);
                setMenus((prevMenus) => [...prevMenus, res.data!]);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        setEditingMenu(null);
        setIsNewMenu(true);
        setShowModal(false);
    }

    const handleDeleteMenu = (menu: Menu) => {
        MenuService.deleteMenuById(menu.id)
        .then((res) => {
            setMenus((prevMenus) => {
                const index = prevMenus.findIndex((m) => m.id === menu.id);
                const newMenus = [...prevMenus];
                newMenus.splice(index, 1);
                return newMenus;
            });
        })
        .catch((err) => {
            console.log(err);
        });
        setEditingMenu(null);
        setIsNewMenu(true);
        setShowModal(false);
    }

    return (
        <>
                <div className="p-4 space-y-4 block max-w-5xl m-auto">
                        <div className="px-5 flex flex-row justify-between max-w-5xl">
                                <h1 className="text-3xl font-bold w-44">Menu</h1>
                                <button 
                                    className="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-gray-300 font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        setShowModal(true)
                                        setIsNewMenu(true)
                                    }}
                                >
                                    Add Menu
                                </button>
                        </div>
                        {!menus || menus.length === 0 ? <p>Loading menu...</p> :
                        <table className="min-w-min max-w-5xl w-full border-collapse">
                                <thead>
                                        <tr>
                                                <th className="border border-gray-400 px-4 py-2 w-40">Image</th>
                                                <th className="border border-gray-400 px-4 py-2">Name</th>
                                                <th className="border border-gray-400 px-4 py-2">Price</th>
                                                <th className="border border-gray-400 px-4 py-2 w-20">Available</th>
                                                <th className="border border-gray-400 px-4 py-2 w-20">Edit</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        {menus.map((menu) => (
                                                <tr key={menu.id}>
                                                        <td className="border border-gray-400 px-4 py-4">
                                                            {menu.image_path.startsWith('http') ? (
                                                                <Image
                                                                    src={menu.image_path}
                                                                    alt="Menu Picture"
                                                                    width={120}
                                                                    height={120}
                                                                    className="rounded-lg m-auto"
                                                                />
                                                            ) : "No Image"}
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2">{menu.name}</td>
                                                        <td className="border border-gray-400 px-4 py-2">${menu.price.toFixed(2)}</td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                                <Switch
                                                                        checked={menu.is_available == "yes"}
                                                                        onChange={() => handleSetAvailable(menu)}
                                                                        className={`${menu.is_available == "yes" ? 'bg-gray-800' : 'bg-gray-300'}
                                                                                relative inline-flex items-center h-6 rounded-full w-11`}
                                                                >
                                                                        <span className="sr-only">Toggle</span>
                                                                        <span
                                                                                className={`${menu.is_available == "yes" ? 'translate-x-6' : 'translate-x-1'}
                                                                                        inline-block w-4 h-4 transform bg-white rounded-full`}
                                                                        />
                                                                </Switch>
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                                <button className="bg-gray-200 hover:bg-gray-800 text-gray-800 hover:text-gray-300 font-bold py-2 px-4 rounded mx-auto" onClick={() => handleEditMenu(menu)}>
                                                                        Edit
                                                                </button>
                                                        </td>
                                                </tr>
                                        ))}
                                </tbody>
                        </table>}
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
                                                {isNewMenu ? 'Add Menu' : 'Edit Menu'}
                                            </h3>
                                            {isNewMenu ? <></>:
                                                <button
                                                    className="bg-white hover:bg-red-500 text-red-500 hover:text-white text-sm font-bold py-1 px-2 rounded"
                                                    onClick={() => {
                                                        handleDeleteMenu(editingMenu!);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            }
                                        </div>
                                        <hr className="my-2 border-gray-400" />
                                        <div className="mt-2">
                                            <form className="space-y-6" onSubmit={(e) => {
                                                e.preventDefault();
                                                if (!editingMenu?.name) {
                                                    alert('Please enter a name');
                                                    return;
                                                }
                                                if (!editingMenu?.price || editingMenu?.price === undefined || editingMenu?.price === null || isNaN(editingMenu?.price) || editingMenu?.price <= 0) {
                                                    alert('Please enter a valid price');
                                                    return;
                                                }
                                                handleSaveMenu(editingMenu!);
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
                                                            value={editingMenu?.name}
                                                            onChange={(e) => setEditingMenu((prevMenu) => ({
                                                                ...prevMenu!,
                                                                name: e.target.value,
                                                            }))}
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-2 py-1"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                                        Description
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="text"
                                                            name="description"
                                                            id="description"
                                                            value={editingMenu?.description? editingMenu?.description : ''}
                                                            onChange={(e) => setEditingMenu((prevMenu) => ({
                                                                ...prevMenu!,
                                                                description: e.target.value,
                                                            }))}
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-2 py-1"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                                        Price
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            id="price"
                                                            value={editingMenu?.price}
                                                            onChange={(e) => setEditingMenu((prevMenu) => ({
                                                                ...prevMenu!,
                                                                price: parseFloat(e.target.value),
                                                            }))}
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-2 py-1"
                                                        />
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
                                                            value={editingMenu?.image_path}
                                                            onChange={(e) => setEditingMenu((prevMenu) => ({
                                                                ...prevMenu!,
                                                                image_path: e.target.value,
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
                                                            setIsNewMenu(true)
                                                            setEditingMenu(null)
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
