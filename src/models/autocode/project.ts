import { Effect, Reducer } from 'umi';

import { saveAutoCodeProject} from '@/services/autocode/projectservice';

export interface AutoCodeProject {
    projectCode?: number;
    projectName?: string;
    rootPackage?: string;
    subClass?: string;
    rootDir?:string;
    connClassname?: string;
    connDriverName?: string;
    connUrl?: string;
    connUsername?: string;
    connPassword?: string;
}

export interface AutoCodeProjectStateType {
    status?: 'ok' | 'error';
    type?: string;
}

export interface AutoCodeProjectModelType {
    namespace: string;
    state: AutoCodeProjectStateType;
    effects: {
        saveAutoCodeProject: Effect;
    };
    reducers: {
        setAutoCodeProject: Reducer<any>;
    };
}

const AutoCodeProjectModel: AutoCodeProjectModelType = {
    namespace: 'project',
    state: {status:undefined},
    effects: {
      *saveAutoCodeProject({payload,callback}, { call,put }) {
        const response = yield call(saveAutoCodeProject,payload);
        yield put({
            type: 'setAutoCodeProject',
            payload: response,
        });
        if (response && response.suc && callback){
            callback(response.data);
        }
      },
    },
    reducers: {
        setAutoCodeProject(state, { payload }) {
            return {
              ...state,
              status: payload.status,
              type: payload.type,
            };
          },
    },
  };
  
  export default AutoCodeProjectModel;