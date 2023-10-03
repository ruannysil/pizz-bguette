"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Header from "../components/header";
import Image from "next/image";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebaseConnection";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function Product() {
  const [nameProduct, setNameProduct] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [categorySelectedPortion, setCategorieSelectedPortion] = useState(-1);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [categorySelected, setCategorySelected] = useState(-1);
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const sizeProducts = [
    { id: 1, name: "Pequena" },
    { id: 2, name: "Média" },
    { id: 3, name: "Grande" },
  ];

  async function handleRegister() {
    if (!nameProduct || !price || !description) {
      toast.error("Porfavor preencha todos os campos");
      return;
    }

    const productData: any = {
      imageAvatar: imageAvatar,
      categoryId: categories[categorySelected].id,
      nameProduct: sizeProducts[categorySelectedPortion].name,
      price: price,
      description: description,
    };

    if (imageAvatar !== null) {
      productData.imageAvatar = avatarUrl;
    }

    try {
      await addDoc(collection(db, "product"), productData)
        .then(() => {
          toast.success("Registrado com sucesso!");
        })
        .catch((error) => {
          toast.error("Error ao registra", error);
        });

      toast.success("Product added successfully!");
      setAvatarUrl("");
      setImageAvatar(null);
      setNameProduct("");
      setPrice("");
      setDescription("");
      setCategorieSelectedPortion(-1);
      setCategorySelected(-1);
    } catch (error) {
      toast.error("errror adding product: ");
    }
  }

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
  });

  function handleSizeProduct(e: ChangeEvent<any>) {
    setCategorieSelectedPortion(e.target.value);
  }

  function handleCategory(e: ChangeEvent<any>) {
    setCategorySelected(e.target.value);
  }

  function handleFile(e: ChangeEvent<any>) {
    if (!e.target.files) {
      return;
    }
    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(image));
    }

    try {
      const storageRef = ref(storage, `productImage/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        () => {
          toast.error("Erro ao fazer upload da imagem: ");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((dowloadUrl) => {
            setAvatarUrl(dowloadUrl);
          });
        }
      );
    } catch (err) {
      toast.error("Error ao fazer upload da image: ");
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center md:mt-8 mt-9">
        <div className="flex flex-col justify-center md:w-[600px] w-[100%]">
          <form onSubmit={handleRegister} className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white">
              Cadastrar novo Produto
            </h1>
            <label className="flex w-full h-[280px] bg-bgdark rounded-md items-center justify-center cursor-pointer border border-white">
              <span className="z-[9] absolute opacity-[0.7] text-white transform scale-150 hover:scale-[1.9] hover:opacity-[1.8]">
                <FiUpload />
              </span>
              <input
                type="file"
                accept="image/png image/jpeg"
                onChange={handleFile}
                className="hidden"
              />
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  width={250}
                  height={250}
                  alt="Image do produto"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </label>

            <select
              value={categorySelected}
              onChange={handleCategory}
              className="text-white bg-bgdark border px-auto p-[0.9rem] rounded-md pl-4 "
            >
              <option value={-1}>Selecione uma categoria</option>
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>

            <select
              value={categorySelectedPortion}
              onChange={handleSizeProduct}
              className="text-white bg-bgdark border px-auto p-[0.9rem] rounded-md pl-4"
            >
              <option value={-1}>Tamanho da porção</option>
              {sizeProducts.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>

            <input
              type="text"
              value={nameProduct}
              onChange={(e) => setNameProduct(e.target.value)}
              placeholder="Digite o nome do produto"
              className="text-white bg-bgdark border px-auto p-[0.9rem] rounded-md pl-4"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Preço do produto"
              className="text-white bg-bgdark border px-auto p-[0.9rem] rounded-md pl-4"
            />
            <textarea
              placeholder="Descreva seu produto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-white bg-bgdark border px-auto flex p-[0.9rem] rounded-md pl-4 min-h-[120px] resize-none w-full"
            />
            <button
              type="submit"
              className="bg-bgred text-white rounded-md p-3 mt-3 hover:bg-bggreen font-bold hover:text-colordark"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
      {/* <Image src={logo} alt="logo" /> */}
    </>
  );
}
