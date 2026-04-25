import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fungsi ambil data
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  // Fungsi tambah pesanan
  const addOrder = async (newOrder) => {
    try {
      await axios.post('http://localhost:5000/api/orders', newOrder);
      await fetchOrders(); 
    } catch (error) {
      console.error("Gagal tambah:", error);
      throw error;
    }
  };

  // Fungsi update status (Untuk Dashboard)
  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus });
      await fetchOrders(); 
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  // Fungsi hapus (Untuk Customer List)
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      await fetchOrders(); // REFRESH DATA OTOMATIS
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  // Fungsi update data profil (Untuk Customer List)
  const updateOrder = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, updatedData);
      await fetchOrders(); // REFRESH DATA OTOMATIS
    } catch (error) {
      console.error("Gagal update profil:", error);
    }
  };

  const getTotalIncome = () => orders.reduce((sum, o) => sum + (Number(o.total_harga || 0)), 0);
  const getOrderCount = () => orders.length;

  useEffect(() => { fetchOrders(); }, []);

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus, 
      deleteOrder, // WAJIB ADA DI SINI
      updateOrder, // WAJIB ADA DI SINI
      fetchOrders, 
      getTotalIncome, 
      getOrderCount 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);