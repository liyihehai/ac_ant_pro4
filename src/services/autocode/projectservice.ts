import request from '@/utils/request';
import {TableListParams} from './projectdata'
import {hostName} from '../../../config/configenv';

/** 查询项目分页显示列表 */
export async function queryProjectList(params?: TableListParams) {
  return request(hostName()+'/api/autocode/project/queryProjectList', {
    method: 'POST',
    data: params,
  });
}
/** 保存项目设置 */
export async function saveAutoCodeProject(params?:any){
  return request(hostName()+'/api/autocode/project/saveAutoCodeProject', {
    method: 'POST',
    data: params,
  });
}
/** 查询连接的表的列表 */
export async function queryConnTableList(params?: any) {
  return request(hostName()+'/api/autocode/project/queryConnTableList', {
    method: 'POST',
    data: params,
  });
}
/** 执行依据表名称创建代码文件 */
export async function execGenFile(params?:any){
  return request(hostName()+'/api/autocode/project/execGenFile', {
    method: 'POST',
    data: params,
  });
}
