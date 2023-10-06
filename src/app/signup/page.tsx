"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FormEvent, useState, useEffect } from "react";
import {
  UserCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/firebaseConnection";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/logo.png";
import Link from "next/link";
import { toast } from "react-toastify";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const router = useRouter();

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "") {
      return;
    }

    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    try {
      if (user) {
        console.log("Sucesso ao cadastra usuario!", user);
        toast.success("Sucesso ao cadastra usuario!");
        setEmail("");
        setPassword("");
        router.push("/");
      } else {
        console.log("Erro ao criar uma conta!");
        toast.error("Erro ao criar uma conta!");
      }
    } catch (err) {
      console.log("Erro ao criar uma conta ", err);

      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <div className="mb-9">
        <Image src={logo} alt="logo" className="md:w-[300px] w-[200px]" />
      </div>
      <form
        onSubmit={handleRegister}
        className="flex flex-col md:w-[600px] w-[85%] gap-2 items-center justify-center"
      >
        <input
          placeholder="Digite seu email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-white bg-bgdark border px-auto flex container p-[0.9rem] rounded pl-4 w-[100%]"
        />
        <div className="relative flex items-center w-full">
          <input
            placeholder="Digite sua senha"
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="text-white bg-bgdark border px-auto flex container p-[0.9rem] rounded pl-4 w-[100%]"
          />
          <div
            className="absolute flex right-4 text-xl"
            style={{
              maxWidth: "25px",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <div onClick={handleClick} className="text-white flex ">
              {show ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-bgred font-bold rounded-md px-auto p-[0.9rem] hover:bg-bggreen  pointer flex container items-center justify-center"
        >
          {loading ? (
            <LiaSpinnerSolid className="text-2xl animate-spin" />
          ) : (
            "Acessar"
          )}
        </button>
        <Link href="/signup" className="text-white hover:text-red-500">
          Não possui conta? Cadastre-se
        </Link>
      </form>
    </div>
  );
}
