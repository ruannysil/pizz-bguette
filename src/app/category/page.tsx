"use client";

import Image from "next/image";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConnection";
import Header from "../components/header";
import { LiaSpinnerSolid } from "react-icons/lia";
import { toast } from "react-toastify";

export default function Category() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);

    try {
      if (category === "") {
        toast.error("Preencha os Campos");
        return;
      }

      await addDoc(collection(db, "category"), {
        name: category,
      });

      toast.success("registrado com sucesso!");
    } catch (err) {
      console.log("Erro ao registrar ", err);
    } finally {
      setLoading(false);
    }

    setCategory("");
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center mt-16">
        <div className="flex flex-col items-center md:w-[600px] w-[100%] px-3">
          <h1 className="font-bold text-white sm:text-2xl text-xl mb-2">
            Cadastra uma nova Categoria
          </h1>
          <input
            type="text"
            placeholder="Digite seu titulo"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-white bg-bgdark border px-auto flex container p-[0.9rem] rounded pl-4"
          />
          <button
            className="bg-bgred px-auto p-[0.9rem] rounded hover:bg-bggreen text-white font-bold hover:text-black pointer flex container items-center justify-center mt-5"
            onClick={handleAdd}
          >
            {loading ? (
              <LiaSpinnerSolid className="text-2xl animate-spin" />
            ) : (
              "Cadastrar"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
