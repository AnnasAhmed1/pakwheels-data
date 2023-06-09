import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function Main() {
  const cheerio = require("cheerio");
  const [carName, setCarName] = useState<any>([]);
  const [carPrice, setCarPrice] = useState<any>([]);
  const [finalObj, setFinalObj] = useState<any>([]);

  async function getData() {
    const url = "https://www.pakwheels.com/new-cars";
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    $("h3.truncate").each((i?: any, el?: any) => {
      carName.push($(el).text());
      setCarName([...carName]);
    });
    // setCarName((prev:any)=>{prev.splice(0,5)})
    $("div.truncate").each((i?: any, el?: any) => {
      let data = $(el).text().replace(/\s/g, "");
      carPrice.push(data);
      setCarPrice([...carPrice]);
    });
    carPrice?.map((v?: any, i?: any) => {
      finalObj.push({
        carName: carName[i],
        carPrice: v,
      });
      setFinalObj([...finalObj]);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  const downloadExcelFile = (data?: any) => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = "data.xlsx";

    const url = window.URL.createObjectURL(excelBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <>
      <br />
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>
        PakWheels New Cars
      </h1>
      <p
        style={{
          margin: "10px 0",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        Download excel file from here
        <button onClick={() => downloadExcelFile(finalObj)}>
          Download Excel file
        </button>
      </p>

      <table
        style={{
          width: "70%",
          margin: "0 auto",
        }}
      >
        <tr>
          <th>S.No</th>
          <th>Car Name</th>
          <th>Price</th>
        </tr>
        {finalObj?.map((v: any, i: any) => (
          <tr key={i}>
            <td
              style={{
                textAlign: "center",
              }}
            >
              {i + 1}
            </td>
            <td>{v.carName}</td>
            <td>{v.carPrice}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
