import { BaseFieldConfig } from './baseFieldConfig';

export class ComboboxFieldConfig extends BaseFieldConfig {
  valueField: string;
  displayField: string;
  comboData?: any[];
  translate?: boolean;
  referenceService?: any | Function;
  objectField?: string;
  multiple?: boolean;
  loadAfterfield?: {
    name: string;
    paramName: string;
  };
  referenceServiceParams?: any;
  getReferenceServiceParams?: (item: any) => any;
}
