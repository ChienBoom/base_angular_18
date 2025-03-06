import { AraFormComponent } from '@aratech/components/ara-form/ara-form.component';

import { ControlType } from '../enums/controlType';

export class BaseFieldConfig {
  type: ControlType = ControlType.Text;
  name: string;
  tabIndex?: number;
  title: string;
  required?: boolean;
  showInGrid = true;
  fitRowWidth?: boolean;
  defaultValue?: any;
  flex?: number = 1;
  allowFilter?: boolean;
  width?: string;
  merge?: number;
  mergeEnd?: boolean;
  disabled?: (item: any) => boolean;
  validators?: (formComponent: AraFormComponent) => any;
  asyncValidators?: (formComponent: AraFormComponent) => any;
  existsValidators?: (formComponent: AraFormComponent) => any;
}
