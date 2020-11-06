import { connect,Dispatch } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useState,useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { AutoCodeProjectStateType,AutoCodeProject } from '@/models/autocode/project';
import { queryProjectList } from '@/services/autocode/projectservice';
import ProjectModify from './component/ProjectModify';
import ProjectGenFile from './component/ProjectGenFile';

interface ProjectListProps {
  dispatch: Dispatch;
  project:AutoCodeProjectStateType
}

const ProjectList: React.FC<ProjectListProps> = (props) => {
  
  const actionRef = useRef<ActionType>();
  const [modifyModalVisible, setModifyModalVisible] = useState<boolean>(false);
  const [genFileModalVisible, setGenFileModalVisible] = useState<boolean>(false);
  const [curProject, setCurProject] = useState<AutoCodeProject>({});
  const columns: ProColumns<AutoCodeProject>[] = [
    {
      title: '项目编号',
      dataIndex: 'projectCode',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '项目包根目录',
      dataIndex: 'rootPackage',
    },
    {
      title: '驱动名',
      dataIndex: 'connDriverName',
    },
    {
      title: '操作',
      dataIndex: 'projectCode',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <a onClick={() => showUpdateProjectModal(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => showGenProjectFileModal(record)}>生成</a>
        </>
      ),
    },
  ];
  //提交成功后回调(刷新列表，关闭对话框)
  const onSubmitBackCall = async (value:any) => {
    if (value && actionRef.current) {
      actionRef.current.reload();
    }
    setModifyModalVisible(false);
  }
  //取消操作的回调（关闭对话框）
  const onCancelBackCall = () => {
    setModifyModalVisible(false);
  }

  const modifyModelParam = {
    onSubmit:onSubmitBackCall,
    onCancel:onCancelBackCall,
    modifyModalVisible:modifyModalVisible,
    values:curProject
  };

  const showCreateProjectModal=()=>{
    setCurProject({});
    setModifyModalVisible(true);
  }

  const showUpdateProjectModal=(project:AutoCodeProject)=>{
    setCurProject(project);
    setModifyModalVisible(true);
  }

  const genFileModelParam = {
    onSubmit:()=>{setGenFileModalVisible(false)},
    onCancel:()=>{setGenFileModalVisible(false)},
    ModalVisible:genFileModalVisible,
    curProject:curProject,
    dispatch:props.dispatch
  };

  const showGenProjectFileModal=(project:AutoCodeProject)=>{
    setCurProject(project);
    setGenFileModalVisible(true);
  }

  return (
    <div>
      <ProTable<AutoCodeProject>
        headerTitle="项目列表"
        actionRef={actionRef}
        rowKey="projectCode"
        toolBarRender={() => [
          <Button type="primary" onClick={() => showCreateProjectModal()}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const result = await queryProjectList({...params,sorter,filter});
          return {
            data : result.list,
            page : params.current,
            success : true,
            total : result.total
          }
        }}
        columns={columns}
        pagination={{defaultPageSize:10}}
      />
      {modifyModalVisible && <ProjectModify {...modifyModelParam}/>}
      {genFileModalVisible && <ProjectGenFile {...genFileModelParam}/>}
    </div>
  );
};

//export default ProjectList;
export default connect(({project,}:{project:AutoCodeProjectStateType}) => ({project,}))(ProjectList);
