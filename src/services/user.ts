import request from '@/utils/request';
import {hostName} from '../../config/configenv';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request(hostName()+'/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request(hostName()+'/api/notices');
}

export async function queryUserMenu(params:any):Promise<any>{
  return request(hostName()+'/api/queryUserMenu',{method: 'POST',data:params});
}
