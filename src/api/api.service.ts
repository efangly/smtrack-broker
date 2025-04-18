import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DeviceDto } from '../common/dto/device.dto';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class ApiService {
  constructor () {}
  async getDevice() {
    const response = await axios.get(String(process.env.DEVICE_URL));
    return response.data.data as DeviceDto[];
  }

  // async getBackup() {
  //   const response = await axios.get('http://localhost:3000/backup');
  //   return response.data;
  // }
}
