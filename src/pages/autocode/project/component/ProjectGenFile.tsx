import { Button, message, Form,Modal,Select,Table} from 'antd';
import { connect, Dispatch } from 'umi';
import { AutoCodeProject } from '@/models/autocode/project';
import formItemLayout from '../ProjectLib';
import { queryConnTableList,execGenFile } from '@/services/autocode/projectservice';

import React, { FC, useEffect } from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

export interface ProjectGenFileProps {
    onCancel?: () => void;
    onSubmit?: () => void;
    ModalVisible: boolean;
    curProject: AutoCodeProject;
    dispatch?: Dispatch;
}

export interface selSubClassItem {
  key:string|number;
  text:string;
}

export interface ResultBase {
  suc?: boolean;
  msg?: string;
  code: number;
}

export interface ConnTableListItem extends ResultBase {
  projectMain?: AutoCodeProject;
  tableList?: string[];
}

export interface GenResult extends ResultBase {
}

const ProjectGenFile: FC<ProjectGenFileProps> = (props) => {
    const { onCancel,onSubmit,curProject } = props;
    const [form] = Form.useForm();
  
    let subClassItems:string[]=[];
    if (curProject && curProject.subClass)
      subClassItems=curProject.subClass?.split(',');

    let blankSels:(string|number)[] = [];
    const [selectedRowKeys,setSelectedRowKeys] = React.useState(blankSels);
    const [selTables,setSelTables] = React.useState('');

    const onSelectChange = (selectedRowKeys:(string|number)[],selectedRows:selSubClassItem[]) => {
      setSelectedRowKeys(selectedRowKeys);
      let tables='';
      if (selectedRows && selectedRows.length>0)
        tables=selectedRows.map(row=>row.text).join();
      setSelTables(tables);
    };

    const blankData:selSubClassItem[] = [];
    const [tableNamesData,setTableNamesData] = React.useState(blankData);

    useEffect(() => {
      queryConnTableList({projectCode:curProject.projectCode}).then((result:ConnTableListItem)=>{
        if (result.code==0){
          const data:selSubClassItem[] = [];
          let tabNames:string[]=(result.tableList)?result.tableList:[];
          tabNames.map((value,index)=>{
            data.push({
              key: index,
              text:value
            }) 
          });
          setTableNamesData(data);
        }else{
          message.destroy();
          message.error(result.msg);
        }
      });
    }, []);

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: (changableRowKeys:(string|number)[]) => {
            let newSelectedRowKeys:(string|number)[] = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            setSelectedRowKeys(newSelectedRowKeys);
          },
        },
        {
          key: 'even',
          text: 'Select Even Row',
          onSelect: (changableRowKeys:(string|number)[]) => {
            let newSelectedRowKeys:(string|number)[] = [];
            newSelectedRowKeys = changableRowKeys.filter((key, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            setSelectedRowKeys(newSelectedRowKeys);
          },
        },
      ],
    };

    const onDoGenFile = () => {
      form.validateFields(['subClassItem']).then((values)=>{
        const {subClassItem} = values;
        const param = {
          projectCode:curProject.projectCode,
          subClass:subClassItem,
          tables:selTables,
        };
        execGenFile(param).then((result:GenResult)=>{
          if (result.code!=0){
            message.destroy();
            message.error(result.msg);
          }else{
            message.destroy();
            message.success(result.msg);
          }
        })
      });
    };
  
    const renderFooter = () => {
      return (
         <>
           <Button onClick={() => {if (onCancel) onCancel();}}>取消</Button>
           <Button type="primary" onClick={() => onDoGenFile()}>
             生成
           </Button>
         </>
      );
    }
  
  const options = subClassItems.map((subClassItem) => <Option key={subClassItem} value={subClassItem}>{subClassItem}</Option>);

  const columns = [
    {
      title: '表名称',
      dataIndex: 'text',
      width: 250,
    },
  ];

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '10px 40px 5px' }}
        destroyOnClose
        title="文件生成"
        visible={props.ModalVisible}
        footer={renderFooter()}
        onCancel={() => {if (onCancel) onCancel()}}
      >
        <Form
          form={form}
          initialValues = {{
            subClassItem:'',
          }}
        >

          <FormItem {...formItemLayout} label={'分类文本'} name="subClassItem"
            rules={[
              {
                required: true,
                message: '输入分类文本',
              },
            ]}
          >
            <Select showSearch 
                    placeholder="选择分组"
                    onSelect={(value,option)=>{}}>
                    {options}
            </Select>
          </FormItem>
          <Table  columns={columns} 
                  dataSource={tableNamesData} 
                  rowKey={record => record.key}
                  rowSelection={rowSelection}
                  size="small"
                  pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
        </Form>
      </Modal>
    );
  };
  
  export default connect(() => ({}))(ProjectGenFile);