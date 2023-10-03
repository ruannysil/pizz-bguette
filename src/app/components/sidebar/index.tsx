"use client";

import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState, useEffect } from "react";
import { IconType } from "react-icons";
import { FiClipboard } from "react-icons/fi";
import { GiCardExchange, GiHamburgerMenu } from "react-icons/gi";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdOutlineClose } from "react-icons/md";
import { PiSignOut } from "react-icons/pi";
import { getAuth, signOut } from "firebase/auth";
import logo from "@/../../public/logo.png";

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
  onClick?: () => void;
}

const LinkItem: Array<LinkItemProps> = [
  {
    name: "Categoria",
    icon: BiSolidFoodMenu,
    route: "/category",
  },
  {
    name: "Produtos",
    icon: GiCardExchange,
    route: "/product",
  },
  {
    name: "Cardápio",
    icon: FiClipboard,
    route: "/menu",
  },
  {
    name: "Últimos pedidos",
    icon: FiClipboard,
    route: "/dashboard",
  },
];
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = getAuth();


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Usuario desconectado");
      })
      .catch((error) => {
        console.log("Error ao desconnectar o usuario:", error);
      });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-[100vh] md:w-full md:flex ">
      <SideBarContent
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        singOut={handleSignOut}
      />

      <div
        className={`${
          isOpen ? "md:w-64" : "md:w-16"
        } flex md:hidden bg-black h-20 w-[100%] md:w-100% max-w-[100%] flex-col items-center justify-center fixed`}
      >
        <MobileNav isOpen={isOpen} onToggleSidebar={toggleSidebar} />
      </div>

      <div className="ml-2 md:ml-2 p-4 md:pt-10 pt-[6rem]"></div>
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  singOut: () => void;
}

const SideBarContent = ({
  onClose,
  isOpen,
  singOut,
  ...rest
}: SidebarProps) => {
  const sidebarClasses = isOpen
    ? "bg-bgdark md:flex w-[100%] z-[999] md:transform md:translate-x-0 md:transition-slide-in fixed h-full"
    : "bg-bgdark md:flex hidden";

  return (
    <div className={sidebarClasses}>
      <div className="flex-col md:w-[20rem] transform translate-x-0 transition-slide-in">
        <div className="h-[20] justify-between md:justify-center  items-center mx-8 flex">
          <Link href="/dashboard">
            <div className="cursor-pointer flex items-center justify-center my-4 mb-8">
              <Image
                src={logo}
                width={120}
                height={120}
                alt="logo ab gym"
                className="flex items-center justify-center"
              />
            </div>
          </Link>
          <button className="block md:block" onClick={onClose}>
            <MdOutlineClose className="text-4xl block text-white  md:hidden" />
          </button>
        </div>

        {LinkItem.map((link) => (
          <NavItem
            icon={link.icon}
            route={link.route}
            key={link.name}
            onClick={link.onClick ? link.onClick : singOut}
          >
            {link.name}
          </NavItem>
        ))}
        <Button icon={PiSignOut} onClick={singOut}>
          Sair
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: IconType;
  children: ReactNode;
  route: string;
  onClick: () => void;
}

const NavItem = ({
  icon: Icon,
  children,
  route,
  onClick,
  ...rest
}: NavItemProps) => {
  return (
    <>
      <Link
        href={route}
        style={{ textDecoration: "none", flexDirection: "row" }}
      >
        <h2
          className="cursor-pointer p-4 mx-4 text-white rounded hover:text-red-500 hover:bg-white items-center flex"
          {...rest}
        >
          {Icon && <Icon className="mr-4 text-base group-hover:text-bgred" />}
          {children}
        </h2>
      </Link>
    </>
  );
};

interface ButtonProps {
  icon: IconType;
  children: ReactNode;
  onClick: () => void;
}

const Button = ({ icon: Icon, children, onClick, ...rest }: ButtonProps) => {
  return (
    <>
      <button
        className="cursor-pointer p-4 mx-4 text-white rounded hover:text-red-500 hover:bg-white items-center flex w-[93%]"
        {...rest}
        onClick={onClick}
      >
        {Icon && <Icon className="mr-4 text-base group-hover:text-white" />}
        {children}
      </button>
    </>
  );
};

interface MobileProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
}

const MobileNav = ({ isOpen, onToggleSidebar, ...rest }: MobileProps) => {
  const handleToogleSidebar = () => {
    onToggleSidebar();
  };
  return (
    <div
      className="ml-0 md:ml-20 p-4 md:p-20 h-20 items-center justify-between flex w-full bg-bgdark"
      {...rest}
    >
      <button
        onClick={handleToogleSidebar}
        className={`text-white text-4xl flex transition-transform duration-slow ease-in-out ${
          isOpen
            ? "md:transform md:translate-x-0 md:transition-slide-in "
            : "transform translate-x-0 transition-slide-in "
        }`}
      >
        <GiHamburgerMenu />
      </button>
      <div className="cursor-pointer flex items-center justify-center">
        <Image
          src={logo}
          width={100}
          height={100}
          alt="logo ab gym"
          className="items-center"
        />
      </div>
    </div>
  );
};
