"use client";
import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "./auth/AuthProvider";
import { useRouter } from "next/navigation";
// import { useUser } from "@/hooks/useUser";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const navigation = [
  { name: "All Canteens", href: "/" },
  {
    name: "Order History",
    href: "/orders",
  },
  {
    name: "Notification",
    href: "/noti",
  },
];
const TopMenu = () => {
  const router = useRouter();

  // const { isLoggedIn } = useAuth();
  const { isAuthenticated, user, loading } = useAuth();
  // You can use isAuthenticated, user, and loading in your component logic
  // console.log(
  //   "TopMenu component rendering with authentication state:",
  //   isAuthenticated,
  //   user,
  //   loading
  // );
  // Declare userId and role as state variables
  // console.log("log user of authen", user);
  // console.log("isAuthen", isAuthenticated);
  // const [userId, setUserId] = useState<string | null>(null);
  // const [role, setRole] = useState<string | null>(null);

  // useEffect(() => {
  //   // Check if window is defined to ensure we are on the client side
  //   if (typeof window !== "undefined") {
  //     const storedUserId = sessionStorage.getItem("userId");
  //     const storedRole = sessionStorage.getItem("role");

  //     // Update state variables with sessionStorage values
  //     setUserId(storedUserId);
  //     setRole(storedRole);
  //   }
  // }, [sessionStorage]);
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  // console.log("userId from sessionStorage ", user?.id, " role ", user?.role);
  // console.log("top menuu sessionStorage", sessionStorage);

  const logout = () => {
    sessionStorage.clear();
    // console.log("userId", userId);
    // setUserId(null);
    // setRole(null);
    console.log("logout", sessionStorage);
    Swal.fire({
      icon: "success",
      title: "Logout Success",
      text: "You have successfully logged out",
    }).then(() => {
      router.refresh();
      router.push("/");
    });
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }: { open: boolean }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* </button> */}
                {/* <button
                  type="button"
                  className="relative rounded-full ml-3 bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                {userId ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <Link
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <Link
                              href="#"
                              onClick={logout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </Link>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    href="/signin"
                    className="text-gray-300 hover:text-white"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default TopMenu;
