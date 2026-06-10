import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = 'https://proyek-vermak-kelompok-production.up.railway.app';
const POLL_INTERVAL = 10000; // polling tiap 10 detik

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const intervalRef = useRef(null);

  const getToken = () => localStorage.getItem('token');

  const fetchOrders = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const response = await axios.get(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  const startPolling = () => {
    if (intervalRef.current) return;
    fetchOrders();
    intervalRef.current = setInterval(fetchOrders, POLL_INTERVAL);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const addOrder = async (newOrder) => {
    try {
      await axios.post(`${API}/api/orders`, newOrder, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchOrders();
    } catch (error) {
      console.error("Gagal tambah:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API}/api/orders/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchOrders();
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      if (window.confirm("Yakin ingin menghapus pesanan ini?")) {
        await axios.delete(`${API}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        await fetchOrders();
      }
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  const updateOrder = async (id, updatedData) => {
    try {
      await axios.put(`${API}/api/orders/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchOrders();
    } catch (error) {
      console.error("Gagal update profil:", error);
    }
  };

  const getTotalIncome = () => {
    return orders.reduce((sum, o) => {
      const harga = Number(o.total_harga || o.totalHarga || 0);
      return sum + harga;
    }, 0);
  };

  const getOrderCount = () => orders.length;

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      updateOrder,
      fetchOrders,
      startPolling,
      stopPolling,
      getTotalIncome,
      getOrderCount,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);