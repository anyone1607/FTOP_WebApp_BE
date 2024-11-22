import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import * as qs from 'qs';

@Injectable()
export class ZalopayService {
    private readonly config = {
        app_id: '2553',
        key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
        key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
        endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
      };
    
      async createOrder() {
        const embed_data = { redirecturl: 'https://phongthuytaman.com' };
        const items = [];
        const transID = Math.floor(Math.random() * 1000000);
    
        const order = {
          app_id: this.config.app_id,
          app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
          app_user: 'user123',
          app_time: Date.now(),
          item: JSON.stringify(items),
          embed_data: JSON.stringify(embed_data),
          amount: 50000,
          callback_url: 'https://b074-1-53-37-194.ngrok-free.app/callback',
          description: `Lazada - Payment for the order #${transID}`,
          bank_code: '',
        };
    
        const data =
          `${this.config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|` +
          `${order.app_time}|${order.embed_data}|${order.item}`;
        order['mac'] = CryptoJS.HmacSHA256(data, this.config.key1).toString();
    
        try {
          const response = await axios.post(this.config.endpoint, null, {
            params: order,
          });
          return response.data;
        } catch (error) {
          console.error(error);
          throw new Error('Error creating order');
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
              "update order's status = success where app_trans_id =",
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
          throw new Error('Error checking order status');
        }
      }
}
