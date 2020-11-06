import { Button, Input, Form,Modal} from 'antd';
import { connect, Dispatch } from 'umi';
import React, { FC } from 'react';
import formItemLayout from '../ProjectLib';

const FormItem = Form.Item;

export interface ProjectSubClassItemModifyProps {
    onCancel?: () => void;
    onSubmit?: (updateItem:string,srcItemIndex?: number) => void;
    modifyModalVisible: boolean;
    srcItemTxt?: string;
    srcItemIndex?:number;
    dispatch?: Dispatch;
}

const ProjectSubClassItemModify: FC<ProjectSubClassItemModifyProps> = (props) => {
    const { onCancel,onSubmit,srcItemTxt } = props;
    const [form] = Form.useForm();
    const [subClassItem,setSubClassItem] = React.useState(srcItemTxt);
  
    const onFinish = () => {
      form.validateFields().then((values)=>{
            const {subClassItem} = values;
            const {srcItemIndex} = props;
            if (onSubmit)
                onSubmit(subClassItem,srcItemIndex);
          })
    };
  
    const renderFooter = () => {
      return (
         <>
           <Button onClick={() => {if (onCancel) onCancel();}}>取消</Button>
           <Button type="primary" onClick={() => onFinish()}>
             确定
           </Button>
         </>
      );
    }
  
    return (
      <Modal
        width={440}
        bodyStyle={{ padding: '10px 40px 5px' }}
        destroyOnClose
        title="分类"
        visible={props.modifyModalVisible}
        footer={renderFooter()}
        onCancel={() => {if (onCancel) onCancel()}}
      >
          <Form
            form={form}
            initialValues = {{
              subClassItem:subClassItem,
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
              <Input placeholder={'输入分类文本'}/>
            </FormItem>
          </Form>
      </Modal>
    );
  };
  
  export default connect(() => ({}))(ProjectSubClassItemModify);