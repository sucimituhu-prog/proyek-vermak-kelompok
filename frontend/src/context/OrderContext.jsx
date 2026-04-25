import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Pastikan ini ada!

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fungsi ambil data (Refresh data dari MySQL via Express)
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  // Fungsi tambah pesanan (Digunakan di AddOrder)
  const addOrder = async (newOrder) => {
    try {
      await axios.post('http://localhost:5000/api/orders', newOrder);
      await fetchOrders(); // Auto-refresh list
    } catch (error) {
      console.error("Gagal tambah:", error);
      throw error;
    }
  };

  // Fungsi update status (Digunakan di Dashboard untuk toggle status)
  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus });
      await fetchOrders(); 
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  // Fungsi hapus (Digunakan di Customer List)
  const deleteOrder = async (id) => {
    try {
      if (window.confirm("Yakin ingin menghapus pesanan ini?")) {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        await fetchOrders();
      }
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  // Fungsi update data profil/detail (Digunakan di Customer List)
  const updateOrder = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, updatedData);
      await fetchOrders();
    } catch (error) {
      console.error("Gagal update profil:", error);
    }
  };

  // Helper untuk laporan keuangan Elsa
  const getTotalIncome = () => {
    return orders.reduce((sum, o) => {
      // Menangani dua versi nama field (total_harga atau totalHarga)
      const harga = Number(o.total_harga || o.totalHarga || 0);
      return sum + harga;
    }, 0);
  };

  const getOrderCount = () => orders.length;

  // Jalankan fetch pertama kali saat aplikasi dibuka
  useEffect(() => { 
    fetchOrders(); 
  }, []);

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus, 
      deleteOrder, 
      updateOrder, 
      fetchOrders, 
      getTotalIncome, 
      getOrderCount 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);