const mysql = require("mysql2/promise");

// CREATE TABLE payments_amazon (
//     settlement_id VARCHAR(50),
//     settlement_start_date DATETIME,
//     settlement_end_date DATETIME,
//     deposit_date DATETIME,
//     total_amount DECIMAL(10, 2),
//     currency VARCHAR(10),
//     transaction_type VARCHAR(50),
//     order_id VARCHAR(50),
//     merchant_order_id VARCHAR(50),
//     adjustment_id VARCHAR(50),
//     shipment_id VARCHAR(50),
//     marketplace_name VARCHAR(100),
//     amount_type VARCHAR(50),
//     amount_description VARCHAR(100),
//     amount DECIMAL(10, 2),
//     fulfillment_id VARCHAR(50),
//     posted_date DATE,
//     posted_date_time DATETIME,
//     order_item_code VARCHAR(50),
//     merchant_order_item_id VARCHAR(50),
//     merchant_adjustment_item_id VARCHAR(50),
//     sku VARCHAR(100),
//     quantity_purchased INT,
//     promotion_id VARCHAR(50)
// );
//   CREATE TABLE processed_reports_amazon (
//     reportType VARCHAR(100) NOT NULL,
//     isPopulated BOOLEAN NOT NULL,
//     reportDocumentId VARCHAR(100) NOT NULL,
//     reportId VARCHAR(50) NOT NULL,
//     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
//   );


const mysql = require("mysql2/promise");
const fs = require("fs");
const csv = require("csv-parser");
const { updateFileStatus } = require("./file-logs");

// TODO: Add your database credentials here
const connectionConfig = {
  host: "",
  user: "",
  password: "",
  database: "",
};


// Function to insert payment record into the database
async function insertReports(rows) {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    await connection.beginTransaction();

    for (const [index, data] of rows.entries()) {
      const query = `
        INSERT INTO processed_reports_amazon (
          reportType, reportDocumentId, reportId,
        ) VALUES (?, ?, ?)
      `;
      const values = [
        String(data.reportType),
        String(data.reportDocumentId),
        String(data.reportId),
      ];

      await connection.execute(query, values);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

async function insertPayments(rows) {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    await connection.beginTransaction();

    for (const [index, data] of rows.entries()) {
      const query = `
        INSERT INTO payments_amazon (
          settlement_id, settlement_start_date, settlement_end_date, deposit_date,
          total_amount, currency, transaction_type, order_id, merchant_order_id,
          adjustment_id, shipment_id, marketplace_name, amount_type, amount_description,
          amount, fulfillment_id, posted_date, posted_date_time, order_item_code,
          merchant_order_item_id, merchant_adjustment_item_id, sku, quantity_purchased,
          promotion_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        String(data.settlement_id),
        data.settlement_start_date,
        data.settlement_end_date,
        data.deposit_date,
        data.total_amount,
        String(data.currency),
        String(data.transaction_type),
        String(data.order_id),
        String(data.merchant_order_id),
        String(data.adjustment_id),
        String(data.shipment_id),
        String(data.marketplace_name),
        String(data.amount_type),
        String(data.amount_description),
        data.amount,
        String(data.fulfillment_id),
        data.posted_date,
        data.posted_date_time,
        String(data.order_item_code),
        String(data.merchant_order_item_id),
        String(data.merchant_adjustment_item_id),
        String(data.sku),
        data.quantity_purchased,
        String(data.promotion_id)
      ];

      await connection.execute(query, values);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}


module.exports = { insertReports, insertPayments };

