'use client'

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LiaSpinnerSolid } from "react-icons/lia";
import { FormEvent, useState, useEffect } from "react";
import {
  UserCredential,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/app/firebaseConnection";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
        setUser(false);
      }
    });
  }, []);

  async function handlesignIn(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "") {
      return;
    }

    try {
      setLoading(true);

      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        console.log("Sucesso ao fazer login!", user);
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      } else {
        console.log("Error ao criar usuario!");
      }
    } catch (err) {
      console.log("Erro ao criar uma conta ", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <div className="mb-9">
        <Image src={logo} alt="logo" className="md:w-[300px] w-[200px]" />
      </div>
      <form
        onSubmit={handlesignIn}
        className="flex flex-col md:w-[600px] w-[85%] gap-2 items-center justify-center"
      >
        <input
          placeholder="Digite seu email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-white px-auto flex container p-[0.9rem] rounded pl-4 w-[100%]"
        />
        <div className="relative flex items-center w-full">
          <input
            placeholder="Digite sua senha"
            type={show ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="text-white px-auto flex container p-[0.9rem] rounded pl-4 w-[100%]"
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
          className="bg-red-500 px-auto p-[0.9rem] rounded hover:bg-red-300 hover:text-white pointer flex container items-center justify-center"
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
