import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import * as qs from 'qs';

@Injectable()
export class ZalopayService {
  private config = {
    app_id: '2554',
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  };

  async createPayment() {
    const embed_data = {
      redirecturl: '',
    };

    // const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const deposit = {
      app_id: this.config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify([]),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      callback_url: 'https://66ea-14-177-6-6.ngrok-free.app/callback',
      description: `Top-up - Deposit for user #${transID}`,
      bank_code: '',
      mac: '',
    };
    
    const data =
      this.config.app_id +
      '|' +
      deposit.app_trans_id +
      '|' +
      deposit.app_user +
      '|' +
      deposit.amount +
      '|' +
      deposit.app_time +
      '|' +
      deposit.embed_data +
      '|' +
      deposit.item;
    
    deposit.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

    try {
      const result = await axios.post(this.config.endpoint, null, { params: deposit });
      return result.data;
    } catch (error) {
      console.error(error);
      throw new Error('Payment creation failed');
    }
  }

  async handleCallback(body: any) {
    const result = { return_code: 0, return_message: '' };

    try {
      const { data: dataStr, mac: reqMac } = body;
      const mac = CryptoJS.HmacSHA256(dataStr, this.config.key2).toString();

      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        const dataJson = JSON.parse(dataStr);
        console.log(
          "update payment status = success where app_trans_id =",
          dataJson['app_trans_id'],
        );

        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      console.error('Error:', ex.message);
      result.return_code = 0;
      result.return_message = ex.message;
    }

    return result;
  }

  async checkStatus(app_trans_id: string) {
    const postData = {
      app_id: this.config.app_id,
      app_trans_id,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${this.config.key1}`;
    postData['mac'] = CryptoJS.HmacSHA256(data, this.config.key1).toString();

    try {
      const response = await axios.post(
        'https://sb-openapi.zalopay.vn/v2/query',
        qs.stringify(postData),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      return response.data;
    } catch (error) {
      console.error('Error checking status:', error);
      throw new Error('Error checking payment status');
    }
  }

}