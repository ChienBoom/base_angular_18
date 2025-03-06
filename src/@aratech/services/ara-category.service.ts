import { BaseService } from './base.service';

export interface ICategoryConfigService {
  getCategoryConfig(): Promise<any>;
}

export interface ICategoryService {
  get(params?: any, page?: number, limit?: number): Promise<any>;
  getDetail(id: string): Promise<any>;
  post(item: any): Promise<any>;
  put(item: any, itemId: string): Promise<any>;
  delete(id: string): Promise<any>;
}

export class CategoryService<
  T extends BaseService<any> & ICategoryConfigService
> implements ICategoryService
{
  constructor(private service: T) {}

  get(params?: any, page?: number, limit?: number): Promise<any> {
    return this.service.get(params, page, limit);
  }
  getDetail(id: string): Promise<any> {
    return this.service.getDetail(id);
  }
  post(item: any): Promise<any> {
    return this.service.post(item);
  }
  put(item: any, itemId: string): Promise<any> {
    return this.service.put(item, itemId);
  }
  delete(id: string): Promise<any> {
    return this.service.delete(id);
  }
}
