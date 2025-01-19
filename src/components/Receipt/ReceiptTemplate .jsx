import React, { forwardRef } from "react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";

const ReceiptTemplate = forwardRef(({ profileData, invoiceData }, ref) => {
  const generatePDF = async () => {
    const element = ref.current;
    if (!element) return;

    try {
      const dataUrl = await domtoimage.toPng(element, {
        style: {
          backgroundColor: "#ffffff", // Ensures a white background
        },
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (element.offsetHeight / element.offsetWidth) * imgWidth;

      pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${invoiceData?.invoiceSerial || "Unknown"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const printReceipt = () => {
    if (!ref.current) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-10000px";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: auto;
              padding: 0;
              width: 75mm;
              height: fit-content;
            }
            .container {
              margin: auto;
              padding: 16px;
              font-size: 12px;
              color: #000;
              background-color: #fff;
            }
            .header {
              text-align: center;
              margin-bottom: 16px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            .dashed-line {
              margin: 5px 0;
              border-top: 1px dashed #000;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          ${ref.current.outerHTML}
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    iframe.onload = () => document.body.removeChild(iframe);
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      width: "72mm",
      margin: "auto",
      padding: "16px",
      fontSize: "12px",
      color: "#000",
      backgroundColor: "#fff",
      height: "fit-content",
    },
    header: {
      textAlign: "center",
      marginBottom: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
    },
    dashedLine: {
      margin: "5px 0",
      borderTop: "1px dashed #000",
    },
    footer: {
      textAlign: "center",
      marginTop: "10px",
    },
    button: {
      marginTop: "16px",
      padding: "8px 12px",
      backgroundColor: "#007BFF",
      color: "#FFF",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "8px",
    },
  };

  return (
    <>
      <div ref={ref} style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "2px",
            }}
          >
            {profileData?.restaurantName || "Restaurant Name"}
          </h2>
          <p style={{ fontSize: "12px", margin: 0 }}>
            {profileData?.address || "Restaurant Address"}
          </p>
          <p style={{ fontSize: "12px", margin: 0 }}>
            Contact: {profileData?.phone || "No Contact Info"}
          </p>
          <hr style={styles.dashedLine} />
        </div>

        {/* Invoice Info Section */}
        <div>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            Invoice No: {invoiceData?.invoiceSerial || "Unknown"}
          </p>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            Date:{" "}
            {new Date(invoiceData?.dateTime).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
            Served By: {invoiceData?.loginUserName || "Staff"}
          </p>
          <hr style={styles.dashedLine} />
        </div>

        {/* Items Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th style={{ textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.products.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.qty}</td>
                <td>৳ {item.rate}</td>
                <td style={{ textAlign: "right" }}>৳ {item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr style={styles.dashedLine} />

        {/* Total Section */}
        <div style={{ textAlign: "right" }}>
          <p>Subtotal: ৳ {invoiceData?.totalAmount || 0}</p>
          <p>Discount: ৳ {invoiceData?.discount || 0}</p>
          <p style={{ fontWeight: "bold" }}>
            Total: ৳ {invoiceData?.totalAmount - invoiceData?.discount || 0}
          </p>
          <hr style={styles.dashedLine} />
          <p style={{ fontStyle: "italic" }}>
            Payment Method: {invoiceData?.orderType || "Unknown"}
          </p>
        </div>

        {/* Footer Section */}
        <div style={styles.footer}>
          <p>Thank you for dining with us!</p>
          <p>{profileData?.website || "www.restaurant.com"}</p>
        </div>
      </div>

      {/* Buttons */}
      <div>
        <button onClick={generatePDF} style={styles.button}>
          Download PDF
        </button>
        <button onClick={printReceipt} style={styles.button}>
          Print Invoice
        </button>
      </div>
    </>
  );
});

export default ReceiptTemplate;
