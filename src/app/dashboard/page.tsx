"use client";

import { FiRefreshCcw } from "react-icons/fi";
import Header from "../components/header";
import { useEffect, useState } from "react";
import ModalOrder from "../components/modalOrder";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConnection";
import Modal from "react-modal";
import React from "react";

type OrderProps = {
  draft: boolean;
  number: string;
  status: boolean;
  order_id: string;
};

export interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    nameProduct: string;
    price: string;
    categoryId: string;
    ImageAvatar: string;
    description: string;
  };
   order: {
    id: string;
    number: string;
    status: boolean;
  };
};

export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);
  const [modalItem, setModalItem] = useState<OrderItemProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function fetchOrders() {
    setLoading(true);
    try {
      const ordersCollection = collection(db, "order");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData: OrderProps[] = [];
      ordersSnapshot.forEach((doc) => {
        return ordersData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setOrderList(ordersData);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function fetchSendOrder(orderId) {
    try {
      const sendOrderCollection = collection(db, 'send-order');
      const q = query(sendOrderCollection, where('order_id', '==', orderId));
      const sendOrderSnapshot = await getDocs(q);

      if (!sendOrderSnapshot.empty) {
        const sendOrders = [];
        sendOrderSnapshot.forEach((doc) => {
          sendOrders.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        return sendOrders;
      } else {
        console.log('Nenhum documento encontrado na coleção "send-order" com order_id', orderId);
      return [];
      }
    } catch(error) {
      console.error('Erro ao buscar documentos na coleção "send-order":', error);
    return [];
    }
  }
 
  async function handleOpenModal(id: string) {
    // alert('ID ' + id)
    try {
      const ordersCollection = collection(db, "order");
      const q = query(ordersCollection, where("order_id", "==", id));
      const ordersSnapshot = await getDocs(q);

      if (!ordersSnapshot.empty) {
        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Order data: ", data);
          setModalItem(data);
          setModalVisible(true);
        });
      } else {
        console.log("Nenhum documento encontrado com o order_id ", id);
      }
    } catch (error) {
      console.log("Erro ao buscar documento: ", error);
    }
  }

  Modal.setAppElement("#next");
  return (
    <>
      <Header />
      <main className="flex justify-between flex-col md:mx-auto my-16 px-4 md:px-8 max-w-screen-md md:w-full">
        <div className="flex flex-col justify-center md:w-[600px] w-[100%]">
          <div className="flex items-center">
            <h1 className="text-white text-xl items-center justify-center font-bold">
              Últimos pedidos
            </h1>
            <button className="text-bggreen font-bold p-3 rounded-lg items-center justify-center" onClick={fetchOrders}>
              {loading ? (<FiRefreshCcw className="text-2xl animate-spin text-bggreen" />): (<FiRefreshCcw className="text-2xl text-bggreen" />)}
            </button>
          </div>
        </div>
        <article className="flex flex-col my-3 mx-0">
          {orderList
          .filter((item) => !item.draft)
          .map((item) => (
            <section
              key={item.id}
              className="flex flex-col  bg-bgdark mb-4 rounded-md"
            >
              <button
                className="flex bg-transparent text-xl h-[60px] items-center"
                onClick={() => handleOpenModal(item.id)}
              >
                <div className="bg-bggreen w-[9px] h-[60px] rounded-s-md mr-5"></div>
                <span className="text-white items-center justify-center">
                  Mesa {item.number}
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
        />
      )}
    </>
  );
}