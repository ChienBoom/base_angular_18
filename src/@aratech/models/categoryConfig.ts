import { GridActionType } from '../enums/gridActionType';
import { BaseFieldConfig } from './baseFieldConfig';

export class CategoryGridAction {
  type: GridActionType;
  icon: string;
  title?: string;
  dialogWidth?: string;
  component?: any;
  refreshAfterSuccess?: boolean;
  routingUrl?: string;
  routingField?: string;
  resolve?: (rowItem: any) => Promise<any>;
  dynamicConfig?: any;
  disabled?: (rowItem: any) => boolean;
  actionCode?: string;
}

export class CategoryConfig {
  type: string;
  icon?: string;
  name: string;
  title: string;
  subTitle?: string;
  expandFields?: string;
  fields: BaseFieldConfig[];
  columns?: number;
  width?: string;
  minWidth?: string;
  gridActions?: CategoryGridAction[];
  noPaging?: boolean = false;
  headerComponent?: any;
  objectFields?: string[]; //list field name is object need push data to server
  beforeSave?: Function;
  addActionCode?: string;
  editActionCode?: string;
  deleteActionCode?: string;
  pageSize?: number;
  beforeCopy?: (itemCopy: any) => void;
}
