import { BaseFieldConfig } from './baseFieldConfig';

export class TextAreaFieldConfig extends BaseFieldConfig {
  minLength?: number;
  maxLength?: number;
  rows: number;
}
