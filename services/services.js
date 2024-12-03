import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import axios from 'axios';
import qs from 'qs';
const __dirname = path.resolve();

export const getToken = async () => {
    try {
      const token = await axios.post('https://api.amazon.com/auth/o2/token',
        qs.stringify({
          'client_id': process.env.CLIENT_ID,
          'client_secret': process.env.CLIENT_SECRET,
          'grant_type': 'refresh_token',
          'refresh_token': process.env.REFRESH_TOKEN
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
    );
    return token.data;
      
    } catch (error) {
      throw error;
    }
  }

export const getOrders = async (fromDate, tillDate, accessToken) => {
    try {
      const orders = await axios.get('https://sellingpartnerapi-eu.amazon.com/orders/v0/orders',
        {
          params: {
            'MarketplaceIds': process.env.MARKET_PLACE_ID,
            'CreatedAfter': fromDate,
            'CreatedBefore': tillDate
  
          },
          headers: {
            'x-amz-access-token': accessToken
          }
        }
    );

    return orders.data;
      
    } catch (error) {
      throw error;
    }
    
  };

  export const getReports = async (fromDate, tillDate, accessToken) => {
    try {
      const reports = await axios.get('https://sellingpartnerapi-eu.amazon.com/reports/2021-06-30/reports',
        {
          params: {
            'reportTypes': 'GET_V2_SETTLEMENT_REPORT_DATA_FLAT_FILE_V2',
            'MarketplaceIds': process.env.MARKET_PLACE_ID,
            'createdSince': fromDate,
            'createdUntil': tillDate
  
          },
          headers: {
            'x-amz-access-token': accessToken
          }
        }
    );
    return reports.data.reports;
      
    } catch (error) {
      throw error;
    }
  };

  export const getReportUrl = async (documentId, accessToken) => {
    try {
      const reports = await axios.get(`https://sellingpartnerapi-eu.amazon.com/reports/2021-06-30/documents/${documentId}`,
        {
          headers: {
            'x-amz-access-token': accessToken
          }
        }
    );
    return reports.data;
      
    } catch (error) {
      throw error;
    }
   
  };

  export const downloadReport = async (url) => {
  try {
    const savePath = path.join(__dirname, 'report.csv');
    const reportStream = await axios.get(`${url}`,
      {
        responseType: 'stream'
      }
    );
    const writer = fs.createWriteStream(savePath);
    reportStream.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`File successfully downloaded to ${savePath}`);
        resolve();
      });

      writer.on('error', (error) => {
        console.error('Error writing the file:', error);
        reject(error);
      });
    });

  } catch (error) {
    throw error;
  }
};