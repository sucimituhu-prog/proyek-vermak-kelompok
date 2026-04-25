import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fungsi untuk ambil data dari MySQL lewat Backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal ambil data pesanan:", error);
    }
  };

  // Fungsi untuk tambah pesanan ke MySQL
  const addOrder = async (newOrder) => {
    try {
      await axios.post('http://localhost:5000/api/orders', newOrder);
      fetchOrders(); // Refresh data setelah nambah
    } catch (error) {
      console.error("Gagal tambah pesanan:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, addOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);