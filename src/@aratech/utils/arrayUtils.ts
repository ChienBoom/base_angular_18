import _ from 'lodash'
import { StringUtils } from './stringUtils'

interface OptionalData {
	isGetOptionalData: boolean
	sortEmptyField?: string
}

export class ArrayUtils {
	static removeItem(array: any[], item: any) {
		let rIndex = array.indexOf(item)
		if (rIndex > -1) {
			array.splice(rIndex, 1)
		}
	}

	static hasDuplicates(array: any[]) {
		return new Set(array).size !== array.length
	}

	// Hàm xoá hết những phần tử trùng lặp theo key
	/**
	 * @param {any[]}  list - Dữ liệu đầu vào Array of Object.
	 * @param {string} key - Trường cần kiểm tra trùng trong Array
	 * @returns {any[]} Trả về Array Object đã được lọc
	 */
	static removeDuplicate(list: any[], key: string): any[] {
		return [...new Map(list.map((item: any) => [item[key], item])).values()] as any[]
	}

	// Hàm lọc phần tử rỗng
	/**
	 * @param {any[]}  list - Dữ liệu đầu vào Array of Object.
	 * @param {string} key - Trường cần kiểm tra rỗng trong Array
	 * @returns {any[]} Trả về Array Object đã được lọc
	 */
	static removeEmpty(list: any[], key: string): any[] {
		return list.filter((item: any) => item[key])
	}

	// Hàm nhóm dữ liệu dạng "Array of Object" theo các trường đầu vào
	/**
	 * @param {any[]}  inputData - Dữ liệu đầu vào Array of Object.
	 * @param {(item: any) => any} groupFields - Callback, Hàm trả về Array chứa các cột cần group
	 * @param {OptionalData} optional - Các tùy chọn.
	 * @returns {any[]} Trả về Array Object đã được sắp xếp ['ItemGroup', 'ItemDataByGroup', 'ItemDataByGroup', 'ItemGroup', 'ItemDataByGroup', ...]
	 */
	static groupData(
		inputData: any[],
		groupFields: (item: any) => any,
		optional: OptionalData = {
			isGetOptionalData: true,
			sortEmptyField: ''
		}
	): any[] {
		if (!StringUtils.isNullOrEmpty(optional.sortEmptyField))
			inputData = ArrayUtils.sortEmptyToBottomByField(inputData, optional.sortEmptyField)
		return _.toPairs(_.groupBy(inputData, groupFields)).reduce((acc, cur) => {
			cur[1] = cur[1].map((d, i) => ({ position: i + 1, isExpanded: true, ...d }))
			return [
				{
					isGroup: true,
					isExpanded: true,
					groupData: cur[0].split(','),
					...(optional.isGetOptionalData && {
						optionalData: cur[1],
						optionalDataLength: cur[1].length
					})
				},
				...cur[1],
				...acc
			]
		}, [])
	}

	/**
	 * Sắp xếp các phần tử có giá trị `field` trống lên đầu danh sách.
	 *
	 * @param {Array<Object>} arr - Mảng các đối tượng cần sắp xếp.
	 * @param {string} field - Tên cột cần sort.
	 * @returns {Array<Object>} Mảng đã được sắp xếp với các phần tử có `field` trống ở đầu.
	 */
	static sortEmptyToTopByField(arr: Array<object>, field: string): Array<object> {
		return arr.sort((a, b) => {
			if (!a[field] && b[field]) return -1 // Nếu a có `field` trống và b không có, đưa a lên
			if (a[field] && !b[field]) return 1 // Nếu b có `field` trống và a không có, đưa b lên
			return 0 // Ngược lại, giữ nguyên thứ tự
		})
	}

	/**
	 * Sắp xếp các phần tử có giá trị `field` trống xuống cuối danh sách.
	 *
	 * @param {Array<Object>} arr - Mảng các đối tượng cần sắp xếp.
	 * @param {string} field - Tên cột cần sort.
	 * @returns {Array<Object>} Mảng đã được sắp xếp với các phần tử có `field` trống ở cuối.
	 */
	static sortEmptyToBottomByField(arr: Array<object>, field: string): Array<object> {
		return arr.sort((a, b) => {
			if (!a[field] && b[field]) return 1 // Nếu a có `field` trống và b không có, đưa a lên
			if (a[field] && !b[field]) return -1 // Nếu b có `field` trống và a không có, đưa b lên
			return 0 // Ngược lại, giữ nguyên thứ tự
		})
	}
}
