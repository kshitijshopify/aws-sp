import { getToken, getOrders, getReports, getReportUrl, downloadReport } from '../services/services.js';

export const generateToken = async (req, res)=> {
    try {
      const token = await getToken();
      res.send({
        status: 'success',
        data: token
      });
      
    } catch (error) {
      return res.status(500).send(error);
    }
}
  
export const listOrders =  async (req,res)=> {
    try {
      const {fromDate, tillDate} = req.body;
      const token = await getToken();
      const orders = await getOrders(fromDate, tillDate, token.access_token);
      res.send({
        status: 'success',
        data: orders
      });
      
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  
export const listReports = async (req,res)=> {
    try {
        
      const {fromDate, tillDate} = req.body;
      const reportType = 'GET_V2_SETTLEMENT_REPORT_DATA_FLAT_FILE_V2';
      const token = await getToken();
      const reports = await getReports(fromDate, tillDate, token.access_token, reportType);
      res.send({
        status: 'success',
        data: reports
      });
      
    } catch (error) {
        console.log(error)
      return res.status(500).send(error);
    }
  };
  
export const downloadReports = async (req,res)=> {
    try {
      const {documentId} = req.body;
    const token = await getToken();
    const report = await getReportUrl(documentId, token.access_token);
    await downloadReport(report.url);
    return res.send({
      status: 'success',
      message: "Report Downloaded Successfully"
    });
      
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  }

  export const listOrderReports = async (req,res)=> {
    try {
      const {fromDate, tillDate} = req.body;
      const token = await getToken();
      const reportType = 'GET_FLAT_FILE_ALL_ORDERS_DATA_BY_LAST_UPDATE_GENERAL';
      const reports = await getReports(fromDate, tillDate, token.access_token, reportType);
      res.send({
        status: 'success',
        data: reports
      });
      
    } catch (error) {
      return res.status(500).send(error);
    }
  };