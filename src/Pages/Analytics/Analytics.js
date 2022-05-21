import React, { useEffect } from "react";
import smallGraph1 from "../../Images/smallGraph1.PNG";
import smallGraph2 from "../../Images/smallGraph2.PNG";
import smallGraph3 from "../../Images/smallGraph3.PNG";
import LineGraph from "../../Components/Graphs/LineGraph"
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import "./Analytics.css";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Line } from "recharts";
import SmallLineGraph from "../../Components/Graphs/SmallLineGraph";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import BarGraph from "../../Components/Graphs/BarGraph";
import Notification from "../../Utils/Notification";
import Loader from "../../Utils/Loader";
import { getOverallAverage, getOverallProductAnalytics, getOverallProductGrowth } from "../../Api-Interaction/api-Interaction";
const Analytics = () => {

  const [selectedOrder, setSelectedOrder] = useState(2022);
  const [selectedProduct, setSelectedProduct] = useState(5);

  const [alert, setAlert] = useState({ flag: false, status: 1, message: "" });
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [barGraph, setBarGraph] = useState();
  const [smallGraph2, setSmallGraph2] = useState();
  const [smallGraphData, setSmallGraph] = useState();
  const types = ['Average Transactions', "Average Buy Rate", "Total Orders"]




  const handleChange = (event) => {
    setSelectedOrder(event.target.value);
  }

  const getSmallGraph = async (year) => {
    try {
      setOpen2(true)
      let resultHandle = await getOverallAverage(year);

      if (resultHandle?.success === true) {
        setSmallGraph(resultHandle?.message)
        setOpen2(false);
      }
      else {
        setAlert({ flag: true, 'status': 2, message: resultHandle?.data.Error });
        setOpen2(false)
      }

    }
    catch (err) {
      setOpen2(false)
      console.log("Error! ", err)
    }
  }

  const getBarGraph = async (product) => {

    try {
      setOpen(true)
      let resultHandle = await getOverallProductAnalytics(product);

      if (resultHandle?.success === true) {
        // console.log(resultHandle?.message)
        setBarGraph(resultHandle?.message)
        setOpen(false);
      }
      else {
        setAlert({ flag: true, 'status': 2, message: resultHandle?.data.Error });
        setOpen(false)
      }

    }
    catch (err) {
      setOpen(false)
      console.log("Error! ", err)
    }

  }

  const getSmallGraph2 = async (product) => {
    try {
      setOpen(true)
      let resultHandle = await getOverallProductGrowth(product);

      if (resultHandle?.success === true) {
        // console.log(resultHandle?.message)
        setSmallGraph2(resultHandle?.message)
        setOpen(false);
      }
      else {
        setAlert({ flag: true, 'status': 2, message: resultHandle?.data.Error });
        setOpen(false)
      }

    }
    catch (err) {
      setOpen(false)
      console.log("Error! ", err)
    }
  }

  useEffect(async () => {

    getBarGraph(selectedProduct)

    getSmallGraph2(selectedProduct)


  }, [selectedProduct]);

  useEffect(async () => {

    getSmallGraph(selectedOrder)

  }, [selectedOrder]);

  return (
    <div className="analyticsMain fadeUp pt-4">
      <Notification alert={alert} setAlert={setAlert} />
      <Loader open={open2} />
      <Loader open={open} />
      <div className="analytics-heading"><h1 className="text-center p-3">Overall Analytics</h1></div>
      {/* Overall 1 */}
      <div className="analytics">

        <div className="analytics-graph1 d-flex flex-column justify-content-space px-2 pt-4">
          <div className="d-flex justify-content-between w-100">
            <h3 className="ms-3">Expanded View - Overall Growth</h3>
            <p className="icon-div" style={{ backgroundColor: "#F4752C" }}>
              <AutoGraphIcon style={{ fontSize: "30px", color: "white" }} />
            </p>
          </div>
          <Select
            style={{ maxWidth: "200px" }}
            className="mb-3 ms-3"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOrder}
            label="Timeline"
            onChange={handleChange}
          >
            <MenuItem value='2022'>This Year</MenuItem>
            <MenuItem value='2021'>Last Year</MenuItem>
            <MenuItem value="2020">Year 2020</MenuItem>
            <MenuItem value="2019">Year 2019</MenuItem>
          </Select>
          <LineGraph />
        </div>
        <div className="analytics-items-container container-fluid">
          <div style={{ borderRadius: "20px" }} className="row pt-3 row-cols-1 row-cols-md-2 row-cols-lg-3">
            {smallGraphData?.map((data, index) => (
              <div key={index} className="analytics-small-items  col px-3 py-4">
                <SmallLineGraph graph={index + 1} graphData={data} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall 2 */}
      <div className="analytics">

        <div className="analytics-graph1 d-flex flex-column justify-content-space px-2 pt-4">
          <div className="d-flex justify-content-between w-100">
            <h3 className="ms-3">Expanded View - Product Analysis</h3>
            <p className="icon-div" style={{ backgroundColor: "#F4752C" }}>
              <EqualizerIcon style={{ fontSize: "30px", color: "white" }} />
            </p>
          </div>
          <Select
            style={{ maxWidth: "200px" }}
            className="mb-3 ms-3"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedProduct}
            label="Timeline"
            onChange={(event) => setSelectedProduct(event.target.value)}
          >
            <MenuItem value='5'>Rating ( 5 )</MenuItem>
            <MenuItem value='4'>Rating ( 4 )</MenuItem>
            <MenuItem value="3">Rating ( 3 )</MenuItem>
            <MenuItem value="2">Rating ( 2 )</MenuItem>
            <MenuItem value="1">Rating ( 1 )</MenuItem>
          </Select>
          <BarGraph graphData={barGraph} />
        </div>
        <div className="analytics-items-container container-fluid">
          <div style={{ borderRadius: "20px" }} className="row pt-3 row-cols-1 row-cols-md-2 row-cols-lg-3">
            {smallGraph2?.map((data, index) => (
              <div key={index} className="analytics-small-items px-3 py-4">
                <SmallLineGraph type={data[data.length - 1].type} graphData={data} src={data.src} />
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Analytics;
