import { useState } from "react";
import * as XLSX from "xlsx";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import globe from "./assets/glove.png";
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";


// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);




const Sidebar = () => {
  const [file, setFile] = useState(null);
  const [chartData, setChartData] = useState({ male: 0, female: 0, provinces: {} });

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("Uploaded file:", uploadedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const maleCount = jsonData.filter(row => row.Sex === "Male").length;
        const femaleCount = jsonData.filter(row => row.Sex === "Female").length;

        // Count provinces
        const provinceCounts = {};
        jsonData.forEach(row => {
          const province = row.Province; // Assuming column name is "Province"
          if (province) {
            provinceCounts[province] = (provinceCounts[province] || 0) + 1;
          }
        });

        setChartData({ male: maleCount, female: femaleCount, provinces: provinceCounts });
        console.log("Chart Data:", { male: maleCount, female: femaleCount, provinces: provinceCounts });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please select a file first.");
    }
  };

  const genderData = [
    { name: "Male", value: chartData.male },
    { name: "Female", value: chartData.female },
  ];

  const provinceData = Object.entries(chartData.provinces).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gradient-to-b from-white to-[#63a8e9] flex flex-col">
        <div className="flex items-center justify-center h-32 p-6">
          <img src={globe} alt="Logo" className="size-auto" />
        </div>

        <div className="flex flex-col items-center mb-4">
          <UserOutlined className="text-3xl text-gray-800 mb-2" />
          <p className="text-gray-800 font-semibold">Juriz Galleto</p>
          <p className="text-gray-600 text-xs">jgalleto@globe.com.ph</p>
        </div>

        <nav className="flex flex-col mt-10 space-y-4">
          <a
            href="#dashboard"
            className="flex items-center px-6 py-3 text-gray-800 hover:bg-[#5595d1]"
          >
            <DashboardOutlined className="mr-4" />
            <span>Dashboard</span>
          </a>
          <a
            href="#records"
            className="flex items-center px-6 py-3 text-gray-800 hover:bg-[#5595d1]"
          >
            <FileTextOutlined className="mr-4" />
            <span>Records</span>
          </a>
          <a
            href="#settings"
            className="flex items-center px-6 py-3 text-gray-800 hover:bg-[#5595d1]"
          >
            <SettingOutlined className="mr-4" />
            <span>Account Settings</span>
          </a>
          
        </nav>
      </div>

      <div className="flex-1 p-20 bg-gray-100">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">Welcome Back, Juriz!</h1>
          <div className="flex">
            <input
              type="file"
              accept=".xls, .xlsx"
              onChange={handleFileChange}
              className="border p-2 rounded"
            />
            <button
              onClick={handleUpload}
              className="ml-3 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        </div>

        <div className="my-4">
          {genderData.some(d => d.value) ? (
            <div className="flex justify-around">
              <PieChart width={400} height={400}>
                <Pie data={genderData} cx={200} cy={200} labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#0088FE" : "#FF8042"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>

              <BarChart width={400} height={400} data={genderData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>
          ) : (
            <p className="text-gray-600">Upload an Excel file to see the gender charts.</p>
          )}

          {provinceData.length > 0 ? (
            <div className="my-8">
              <BarChart width={400} height={300} data={provinceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </div>
          ) : (
            <p className="text-gray-600">No input data available.</p>
          )}
        </div>
      </div>
    </div>
  );};

export default Sidebar;
