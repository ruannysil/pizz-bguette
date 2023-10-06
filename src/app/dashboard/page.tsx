"use client";

import { FiRefreshCcw } from "react-icons/fi";
import Header from "../components/header";
import { useEffect, useState } from "react";
import ModalOrder from "../components/modalOrder/page";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConnection";
import Modal from "react-modal";

export type ProductProps = {
  id: string;
  categoryId: string;
  nameProduct: string;
  description: string;
  price: string;
  imageAvatar: string;
};

export type CategoryProps = {
  id: string;
  name: string;
};

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: ProductProps;
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  };
};
export default function Dashboard() {
  const [orderList, setOrderList] = useState<
    {
      id: string;
      table: string | number;
      status: boolean;
      draft: boolean;
      name: string;
    }[]
  >([]);
  const [modalItem, setModalItem] = useState<OrderItemProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    async function fetchCategoriesAndProducts() {
      // Busque todas as categorias
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesData:any = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);

      // Busque todos os produtos
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsData:any = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    }

    fetchCategoriesAndProducts();
  }, []);


  Modal.setAppElement("#next");

  function OpenModal(itemData: any) {
    setModalItem(itemData);
  }

  async function handleOpenModalView(id: string) {
    try {
      const orderDocRef: any = doc(db, "order", id);
      const orderDocSnapshot = await getDoc(orderDocRef);

      if (orderDocSnapshot.exists()) {
        const orderData = orderDocSnapshot.data();
        OpenModal(orderData);
        setModalVisible(true);
      } else {
        console.log("pedido nao encontrado");
      }
      setModalVisible(true);
    } catch (error) {
      console.log("erro ao buscar pedido: ", error);
    }
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        const ordersCollection = collection(db, "order");
        const ordersSnapshot = await getDocs(ordersCollection);

        const ordersData: any[] = [];

        ordersSnapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setOrderList(ordersData);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    }

    fetchOrders();
  }, []);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleFinishItem(id: string) {
   try {
    const orderDocRef = doc(db, "order", id);
    const orderDocSnapshot = await getDoc(orderDocRef);

    if(orderDocSnapshot.exists()) {
      await updateDoc(orderDocRef, {
        status: false
      });

      setModalVisible(false);

    } else {
      console.log('Pedido nao encontrado');
    }
   }catch(err) {
    console.log('Erro ao atualizar pedidos: ', err)
   }
  }

  async function handleRefeshOrder() {
    try {
      setLoading(true);
      const ordersCollection = collection(db, "order");
      const queryData = query(
        ordersCollection,
        orderBy("timestamp", "desc"),
        limit(10)
      );

      const ordersSnapshot = await getDocs(queryData);

      const updatedOrdersData = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        table: doc.data().table,
        status: doc.data().status,
        draft: doc.data().draft,
        name: doc.data().name,
      }));

      setOrderList(updatedOrdersData);
    } catch (err) {
      console.log("error ao busaca pedidpos: ", err);
    }
    setLoading(false);
  }

  return (
    <>
      <Header />
      <main className="flex justify-between flex-col md:mx-auto my-16 px-4 md:px-8 max-w-screen-md md:w-full">
        <div className="flex flex-col justify-center md:w-[600px] w-[100%]">
          <div className="flex items-center">
            <h1 className="text-white text-xl items-center justify-center font-bold">
              Últimos pedidos
            </h1>
            <button
              className="text-bggreen font-bold p-3 rounded-lg items-center justify-center"
              disabled={loading}
              onClick={handleRefeshOrder}
            >
              {loading ? (
                <FiRefreshCcw className="text-2xl animate-spin text-bggreen" />
              ) : (
                <FiRefreshCcw className="animate-pulse text-2xl text-bggreen" />
              )}
            </button>
          </div>
        </div>
        <article className="flex flex-col my-3 mx-0">
          {orderList.length === 0 && (
            <span className="text-gray-300 text-base mb-4">
              Nenhum pedido aberto foi encontrado...
            </span>
          )}

          {orderList.map((item) => (
            <section
              key={item.id}
              className="flex flex-col  bg-bgdark mb-4 rounded-md"
            >
              <button
                className="flex bg-transparent text-xl h-[60px] items-center"
                onClick={() => handleOpenModalView(item.id)}
              >
                <div className="bg-bggreen w-[9px] h-[60px] rounded-s-md mr-5"></div>
                <span className="text-white items-center justify-center">
                  Mesa {item.table}
                </span>
              </button>
            </section>
          ))}
        </article>
      </main>

      {modalVisible && (
        <ModalOrder
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          order={modalItem}
          handleFinishOrder={handleFinishItem}
        />
      )}
    </>
  );
}


