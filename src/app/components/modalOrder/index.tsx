import { OrderItemProps } from "@/app/dashboard/page";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebaseConnection";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemProps;
}

export default function ModalOrder({
  isOpen,
  onRequestClose,
  order,
}: ModalOrderProps) {
  const [sendOrderData, setSendOrderData] = useState([]);
  const customStyles = {
    overlay: {
      left: "5px",
      right: "5px",
      bottom: 0,
      backgroundColor: "rgb(29, 29, 46, 0.5)",
      zIndex: 9000,
    },
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1d1d2e",
      maxWidth: "620px",
      width: "100%",
      maxHeight: "620px",
      height: "100%",
      padding: "30px",
      // padding: `${windowWidth < 450 ? "12px" : "30px"}`,
      border: "1px solid #ff3f4b ",
    },
  };

  useEffect(() => {
    async function fetchSendOrder(id: string) {
      try {
        const sendOrderCollection = collection(db, "send-order");
        const q = query(sendOrderCollection, where("order_id", "==", id));
        const sendOrderSnapshot = await getDocs(q);
        if (!sendOrderSnapshot.empty) {
          const sendOrders = [];
          sendOrderSnapshot.forEach((doc) => {
            sendOrders.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setSendOrderData(sendOrders); // Armazena os dados no estado
        } else {
          console.log(
            'Nenhum documento encontrado na coleção "send-order" com order_id',
            id
          );
        }
      } catch (error) {
        console.error(
          'Erro ao buscar documentos na coleção "send-order":',
          error
        );
      }
    }
    fetchSendOrder(order.order_id);
  }, [order]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <button
        onClick={onRequestClose}
        className="react-modal-close bg-transparent border-0 react-modal-close"
      >
        <FiX className="text-bgred text-5xl" />
      </button>

      <div className="flex flex-col md:w-full">
        <h2 className="text-white text-lg">Detalhes do pedido</h2>
        <span className="text-white my-3">
          {" "}
          Mesa:{" "}
          <span className="font-bold text-bgred text-lg">{order.number}</span>
        </span>
        {sendOrderData.map((sendOrder) => (
          <section key={sendOrder.id} className="flex-col flex gap-4">
            <div className="flex mm:flex-row flex-col justify-between w-full">
              <span className="text-white flex-row ">
                {sendOrder.amount} - {sendOrder.product[0].name}
              </span>
              <Image
                src={sendOrder.product[0].imageAvatar}
                alt="image"
                className="w-[100px] mr-3 rounded-l-md bg-cover"
                width={800}
                height={800}
              />
            </div>
            <span className="text-white my-3">
              Total:{" "}
              <span className="font-bold text-bgred text-lg">
                R$ {sendOrder.product[0].price},00
              </span>
            </span>
            {/* {console.log("Detalhes do sendOrder:", sendOrder)} */}
          </section>
        ))}
      </div>
    </Modal>
  );
}
