'use client'

import Link from "next/link";
import Image from "next/image";
import logo from '@/../../public/logo.png'
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebaseConnection";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "../sidebar";

export default function Header() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        // console.log("Usuario desconectado");
      })
      .catch((error) => {
        console.log("Error ao desconnectar o usuario:", error);
      });
  }
  return (
    <header className="h-[5rem]">
      <div className="h-full mx-auto px-4 md:px-8 flex justify-between items-center max-w-screen-xl md:w-full">
        <Link href={"/dashboard"} className="cursor-pointer">
          <Image src={logo} alt="logo image" className="w-[100px]" />
        </Link>

        <nav className="md:flex items-center md:space-x-8 space-x-2 hidden">
          <Link
            href={"/category"}
            className="hover:text-bgred text-white transition-colors duration-500"
          >
            Categorias
          </Link>
          <Link
            href={"/product"}
            className="hover:text-bgred text-white transition-colors duration-500"
          >
            Produtos
          </Link>
          <Link
            href={"/"}
            className="hover:text-bgred text-white transition-colors duration-500"
          >
            Cardápio
          </Link>
          <Link
            href={"/dashboard"}
            className="hover:text-bgred text-white transition-colors duration-500"
          >
            Últimos Pedidos
          </Link>
          <button
            onClick={handleSignOut}
            className="hover:text-bgred text-white transition-colors duration-500"
          >
            Sair
          </button>
        </nav>

        <div className="md:hidden fixed top-0 left-0 h-screen z-50">
          <Sidebar />
        </div>
      </div>
    </header>
  );
}
