import React, { forwardRef, useEffect, useState } from "react";

const ReceiptTemplate = forwardRef(({ profileData, invoiceData, onPrintComplete }, ref) => {
  const [printed, setPrinted] = useState(false); // Flag to prevent double printing
  const getCurrentDateTime = () => {
    return new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const printReceipt = () => {
    if (!ref.current || printed) return; // Avoid duplicate printing
    setPrinted(true);



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
              height: 115mm;
            }
            .container {
              margin: auto;
              padding: 16px;
              font-size: 12px;
              color: #000;
              background-color: #fff;
              page-break-after: always;
            }
            .header {
              text-align: center;
              margin-bottom: 16px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
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

    iframe.onload = () => {
      document.body.removeChild(iframe);
      if (onPrintComplete) {
        onPrintComplete(); // Notify the parent component when printing is complete
      }
    };
  };

  useEffect(() => {
    printReceipt();
  }, []); // This ensures the printReceipt function runs when the component mounts

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      width: "72mm",
      margin: "auto",
      padding: "16px",
      fontSize: "12px",
      color: "#000",
      backgroundColor: "#fff",
      height: "115mm"
      
    },
    header: {
      textAlign: "center",
      marginBottom: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "14px",
    },
    dashedLine: {
      margin: "5px 0",
      borderTop: "1px dashed #000",
    },
    footer: {
      textAlign: "center",
      marginTop: "10px",
    },
  };

  if (!profileData || !invoiceData) {
    return <p>Loading invoice...</p>;
  }

  return (
    <div ref={ref} style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "2px",
          }}
        >
          {profileData?.name || "Restaurant Name"}
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
        <p style={{ fontSize: "14px", textAlign: "center", margin: 0 }}>
          Invoice No: {invoiceData?.invoiceSerial || "Unknown"}
        </p>
        <p style={{ fontSize: "14px", textAlign: "center", margin: 0 }}>
          Date:{" "}
          {new Date(invoiceData?.dateTime).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p style={{ fontSize: "14px", textAlign: "center", margin: 0 }}>
          Served By: {invoiceData?.loginUserName || "Staff"}
        </p>
        <hr style={styles.dashedLine} />
      </div>

      {/* Items Table */}
      {Array.isArray(invoiceData?.products) && invoiceData.products.length > 0 ? (
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
            {invoiceData.products.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.productName || "Unknown Item"}</td>
                <td>{item.qty || 0}</td>
                <td>৳ {item.rate || 0}</td>
                <td style={{ textAlign: "right" }}>৳ {item.subtotal || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center" }}>No items to display.</p>
      )}
      <hr style={styles.dashedLine} />

      {/* Total Section */}
      <div style={{ textAlign: "right" }}>
    
      {(invoiceData?.totalAmount-invoiceData?.vat) !== (invoiceData?.totalAmount) && ( // Conditional rendering for Discount
    <p>Subtotal: ৳ {(invoiceData?.totalAmount-invoiceData?.vat) || 0}</p>
  )}
          {invoiceData?.vat > 0 && <p>Vat: ৳ {invoiceData.vat}</p>}
       
        {invoiceData?.discount > 0 && ( // Conditional rendering for Discount
    <p>Discount: ৳ {invoiceData?.discount}</p>
  )}
        <p style={{ fontWeight: "bold" }}>
          Total: ৳ {(invoiceData?.totalAmount || 0) - (invoiceData?.discount || 0)}
        </p>
        <hr style={styles.dashedLine} />
        <p style={{ fontStyle: "italic" }}>
          Order Method: {invoiceData?.orderType || "Unknown"}
        </p>
      </div>

      {/* Footer Section */}
      <div style={styles.footer}>
      {invoiceData?.vat === 0 && ( // Conditional rendering for Discount
     <p>*VAT not collected on certain items*</p>
  )}
       
        <p>Thank you for dining with us!</p>
        <p>{profileData?.website || "www.sadatkhan.com"}</p>
        <p style={{ fontSize: "10px", marginTop: "5px" }}>
          Printed On: {getCurrentDateTime()}
        </p>
      </div>
      <div style={{ pageBreakAfter: "always" }}></div>
    </div>
  );
});

export default ReceiptTemplate;
