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
      const token = await getToken();
      const reports = await getReports(fromDate, tillDate, token.access_token);
      res.send({
        status: success,
        data: reports
      });
      
    } catch (error) {
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