import { Button, Input, Form,Modal,Select,Tabs,List } from 'antd';
import { connect, Dispatch } from 'umi';
import React, { FC } from 'react';
import { AutoCodeProject } from '@/models/autocode/project';
import ProjectSubClassItemModify from './ProjectSubClassItemModify';
import {ProjectSubClassItemModifyProps} from './ProjectSubClassItemModify';
import formItemLayout from '../ProjectLib';

import ProjectStyle from '../ProjectStyle.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

export interface ProjectModifyProps {
  onCancel: () => void;
  onSubmit: (values: AutoCodeProject) => void;
  modifyModalVisible: boolean;
  values: AutoCodeProject;
  dispatch: Dispatch;
}

const ProjectModify: FC<ProjectModifyProps> = (props) => {
  const { onCancel,onSubmit } = props;
  const [form] = Form.useForm();
  const [modifyProjectItem,setModifyProjectItem] = React.useState(props.values);
  const [tabSelNo,setTabSelNo] = React.useState(1);

  let scitems = (modifyProjectItem.subClass && modifyProjectItem.subClass!='')?modifyProjectItem.subClass?.split(','):[];
  const [classItems,setClassItems] = React.useState(scitems);
  const [ProjectSubClassItemModifyParam,setProjectSubClassItemModifyParam] = React.useState({
    onSubmit:(updateItem:string,srcItemIndex?:number)=>{onProjectSubClassItemChanged(updateItem,srcItemIndex);},
    onCancel: ()=>{closeProjectSubClassItemModify();},
    modifyModalVisible:false,
    srcItemTxt:'',
    srcItemIndex:-1,
    dispatch:props.dispatch
  });

  const onProjectSubClassItemChanged=(updateItem:string,srcItemIndex?:number)=>{
    if (!updateItem || updateItem=='')
      return;
    let items = classItems||[];
    if (srcItemIndex && srcItemIndex>=0)
      items[srcItemIndex]=updateItem;
    else
      items.push(updateItem);
    let newModifyProjectItem =  items.join(',');

    closeProjectSubClassItemModify();
    setModifyProjectItem({...modifyProjectItem,subClass:newModifyProjectItem});
    setClassItems(items);
  }

  const onFinish = () => {
    const { dispatch } = props;
    form.validateFields().then((values)=>{
      dispatch({
        type: 'project/saveAutoCodeProject',
        payload: {...values,subClass:modifyProjectItem.subClass},
        callback:()=>{
          onSubmit(modifyProjectItem);
        }
      });
    });
  };

  const getProjectSubClassItemModifyParam = ():ProjectSubClassItemModifyProps=>{
      return {...ProjectSubClassItemModifyParam};
  }

  const closeProjectSubClassItemModify = ()=>{
    setProjectSubClassItemModifyParam({...ProjectSubClassItemModifyParam,modifyModalVisible:false});
  }
  
  const showProjectSubClassItemModify = (item:string,index:number)=>{
    setProjectSubClassItemModifyParam({...ProjectSubClassItemModifyParam,
      srcItemTxt:item,
      srcItemIndex:index,
      modifyModalVisible:true});
  }

  const onNewClassItem = ()=>{
    showProjectSubClassItemModify('',-1);
  }

  const renderFooter = () => {
    let addClass =  <Button type="primary" onClick={() => onNewClassItem()}>新增</Button>;
    if (tabSelNo==1)
      addClass = <></>;
    return (
       <>
         <Button onClick={() => onCancel()}>取消</Button>
         {addClass}
         <Button type="primary" onClick={() => onFinish()}>
           保存
         </Button>
       </>
    );
  }

  /** Tabs切换刷新 **/
  const callback=(key:any)=> {
    setTabSelNo(key);
  }

  const deleteClassItem=(index:number|string)=>{
    let ind:number = Number(index);
    let items = classItems||[];
    if (index!=undefined && index>=0){
      items.splice(ind,1);
      let newModifyProjectItem =  items.join(',');
      setModifyProjectItem({...modifyProjectItem,subClass:newModifyProjectItem});
      setClassItems(items);
    }
  }

  const modifyClassItem=(item:string,index:number)=>{
    showProjectSubClassItemModify(item,index);
  }

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '10px 40px 5px' }}
      destroyOnClose
      title="项目配置"
      visible={props.modifyModalVisible}
      footer={renderFooter()}
      onCancel={() => onCancel()}
    >
        <Form
          form={form}
          initialValues = {{
            projectCode:modifyProjectItem.projectCode,
            projectName:modifyProjectItem.projectName,
            rootPackage:modifyProjectItem.rootPackage,
            rootDir:modifyProjectItem.rootDir,
            subClass:modifyProjectItem.subClass,
            subClassItems:classItems,
            connDriverName:modifyProjectItem.connDriverName,
            connUrl:modifyProjectItem.connUrl,
            connUsername:modifyProjectItem.connUsername,
            connPassword:modifyProjectItem.connPassword
          }}
        >
        <Tabs onChange={callback} type="card">
        <TabPane tab="项目信息" key="1">
        <FormItem {...formItemLayout} label={'项目代码'} name="projectCode"
            rules={[
              {
                required: true,
                message: '输入项目代码',
              },
            ]}
          >
            <Input placeholder={'输入数据'}/>
          </FormItem>
          <FormItem {...formItemLayout} label={'项目名称'} name="projectName"
            rules={[
              {
                required: true,
                message: '输入项目名称',
              },
            ]}
          >
            <Input placeholder={'项目名称'}/>
          </FormItem>
          <FormItem {...formItemLayout} label={'包根名称'} name="rootPackage"
            rules={[
              {
                required: true,
                message: '输入包根名称',
              },
            ]}
          >
            <Input placeholder={'包根名称'}/>
          </FormItem>
          <FormItem {...formItemLayout} label={'输出路径'} name="rootDir"
            rules={[
              {
                required: true,
                message: '输入输出路径',
              },
            ]}
          >
            <Input placeholder={'输出路径'}/>
          </FormItem>
          <FormItem {...formItemLayout} label={'数据驱动'} name="connDriverName"
            rules={[
              {
                required: true,
                message: '输入数据驱动',
              },
            ]}
          >
            <Select onSelect={()=>{}}>
                  <Option key={1} value={'com.mysql.cj.jdbc.Driver'}>mysql数据库</Option>
                  <Option key={2} value={'org.sqlite.JDBC'}>sqlite3数据库</Option>
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label={'连接URL'} name="connUrl"
            rules={[
              {
                required: true,
                message: '输入连接URL',
              },
            ]}
          >
            <Input placeholder={'连接URL'}/>
          </FormItem>
          <FormItem {...formItemLayout} label={'用户账号'} name="connUsername"
            rules={[
              {
                required: false,
                message: '输入用户账号',
              },
            ]}
          >
            <Input placeholder={'用户账号'}/>
          </FormItem>
          <FormItem {...formItemLayout} label={'用户口令'} name="connPassword"
            rules={[
              {
                required: false,
                message: '输入用户口令',
              },
            ]}
          >
            <Input placeholder={'用户口令'}/>
          </FormItem>
        </TabPane>
        <TabPane tab="分类文本" key="2">
          <FormItem {...formItemLayout} name="subClassList">
              <List dataSource={classItems}
                    className={ProjectStyle.lisr_with_scroll}
                    renderItem={(item,index) => (
                  <List.Item key={item} 
                             actions={[ <a onClick={e => {  
                                                          e.preventDefault();
                                                          modifyClassItem(item,index);}}>编辑</a>,
                                        <a onClick={e => {  
                                                          e.preventDefault();
                                                          deleteClassItem(index);}}>删除</a>]}
                  >
                    <div>{item}</div>
                  </List.Item>
                )}
              >
              </List>
          </FormItem>
        </TabPane>
        </Tabs>
        </Form>
        {ProjectSubClassItemModifyParam.modifyModalVisible && <ProjectSubClassItemModify {...getProjectSubClassItemModifyParam()}/>}
    </Modal>
  );
};

export default connect(() => ({}))(ProjectModify);
