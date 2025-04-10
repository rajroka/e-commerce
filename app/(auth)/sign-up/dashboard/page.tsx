"use client";
import React, { useState, useEffect } from "react";
import { FaHome, FaUser, FaCog, FaChartLine } from "react-icons/fa"; // You can use icons
import axios from "axios"; // To fetch data from API

// Sidebar component
const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed top-0 left-0 p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <ul className="space-y-4">
        <li className="hover:bg-gray-700 p-2 rounded">
          <FaHome className="inline mr-2" /> Home
        </li>
        <li className="hover:bg-gray-700 p-2 rounded">
          <FaUser className="inline mr-2" /> Profile
        </li>
        <li className="hover:bg-gray-700 p-2 rounded">
          <FaChartLine className="inline mr-2" /> Analytics
        </li>
        <li className="hover:bg-gray-700 p-2 rounded">
          <FaCog className="inline mr-2" /> Settings
        </li>
      </ul>
    </div>
  );
};

// Bento grid component
const BentoGrid = ({ data }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-auto">
      {data.map((item: any, index: number) => (
        <div key={index} className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold">{item.title}</h3>
          <p className="mt-4 text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts"); // Example API
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen overflow-hidden">
        <div className="overflow-y-auto h-full">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-2xl text-gray-600">Loading...</span>
            </div>
          ) : (
            <BentoGrid data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
