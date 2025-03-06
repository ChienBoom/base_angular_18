import { BaseFieldConfig } from './baseFieldConfig';

export class DynamicFieldConfig extends BaseFieldConfig {
  component: any;
  setInput?: (instance: any, item: any) => any;
  beforeSaveAsync?: (instance: any, item: any) => Promise<any>;
}
