"use client";

import Header from "../components/header";
import Image from "next/image";

import { db } from "@/app/firebaseConnection";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { BsSearch } from "react-icons/bs";
import { ProductProps } from "../dashboard/page";
import React from "react";

export default function Menu() {
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [categorySelected, setCategorySelected] = useState("");

  async function handleSearchProduct() {
    setLoading(true);
    setProducts([]);
    setCategorySelected("");

    if (categorySelected !== "") {
      const productsCollection = collection(db, "product");
      const q = query(
        productsCollection,
        where("categoryId", "==", categories[categorySelected].id)
      );
      const productsSnapshot = await getDocs(q);

      const data: any = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    } else {
      toast.error("Selecione uma categoria antes de pesquisar");
    }

    setLoading(false);
  }

  const productData: any = {
    categoryId: categories[categorySelected],
  };

  async function fetchCategories() {
    const categoriesCollection = collection(db, "category");
    const categoriesSnapshot = await getDocs(categoriesCollection);

    const data = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCategories(data as any);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleCategory(e: ChangeEvent<any>) {
    setCategorySelected(e.target.value);
  }

  return (
    <>
      <Header />

      <main className="m-[4 auto] flex flex-col justify-between mx-auto my-16 px-4 md:px-8 max-w-screen-md md:w-full">
        <h1 className="text-white font-bold d:text-3xl flex items-start mb-4">
          Ver produto por categoria
        </h1>

        <div className="flex justify-between">
          <select
            className="w-[80%] sm:w-[90%] h-[40px] rounded-md mb-5 p-1 bg-colordark text-white border"
            onChange={handleCategory}
            value={categorySelected}
          >
            <option value={""}>Selecione uma categoria</option>
            {categories.map((item, index) => (
              <option key={item.id} value={index}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            className="w-[40px] bg-bggreen items-center justify-center flex h-[40px] rounded-full"
            onClick={handleSearchProduct}
          >
            <BsSearch />
          </button>
        </div>

        <div className="flex justify-between flex-col items-center w-full">
          {products.map((item) => (
            
            <div key={item.id} className="flex w-full">
              <button
                className="bg-colordark border border-bgred mb-2 flex w-full sm:mr-4 mr-0 rounded-md "
                onClick={() => handleSearchProduct()}
              >
                <img
                  src={item.imageAvatar}
                  alt="image"
                  className="w-[100px] mr-3 rounded-l-md bg-cover"
                />
                <div className="flex flex-col items-start justify-start w-full">
                  <p className="text-white">Nome do Produto: {item.name}</p>
                  <h2 className="text-white">
                    Tamanho da porção: {item.nameProduct}
                  </h2>
                  <p className="text-white">R$ {item.price},00</p>
                </div>
              </button>
            </div>
          ))}
          {/* {products.map((item) => {console.log(item)})} */}
        </div>
      </main>
    </>
  );
}
