import dotenv from 'dotenv';
dotenv.config();
import express, { json } from "express";
const app = express();
app.use(json());

const port = process.env.PORT || 3000;

import { getToken, getOrders, getReports, getReportUrl, downloadReport } from './services/services.js';

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
  });


app.post('/api/v1/token', async (req, res)=> {
  try {
    const token = await getToken();
    res.send(token);
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.post('/api/v1/orders', async (req,res)=> {
  try {
    const {fromDate, tillDate} = req.body;
    const token = await getToken();
    const orders = await getOrders(fromDate, tillDate, token.access_token);
    res.send(orders);
    
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.post('/api/v1/reports', async (req,res)=> {
  try {
    const {fromDate, tillDate} = req.body;
    const token = await getToken();
    const reports = await getReports(fromDate, tillDate, token.access_token);
    res.send(reports);
    
  } catch (error) {
    return res.status(500).send(error);
  }
})

app.post('/api/v1/reports/download', async (req,res)=> {
  try {
    const {documentId} = req.body;
  const token = await getToken();
  const report = await getReportUrl(documentId, token.access_token);
  await downloadReport(report.url);
  return res.send("Report Downloaded Successfully");
    
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
})