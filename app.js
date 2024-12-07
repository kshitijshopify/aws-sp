import dotenv from 'dotenv';
dotenv.config();
import express, { json } from "express";
const app = express();
app.use(json());

const port = process.env.PORT || 3000;

import { downloadReports, generateToken, listOrderReports, listOrders, listReports } from './controller/appController.js';

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});


app.post('/api/v1/token', generateToken);

app.post('/api/v1/orders', listOrders)

app.post('/api/v1/reports', listReports)

app.post('/api/v1/reports/download', downloadReports)

app.post('/api/v1/reports/order', listOrderReports)