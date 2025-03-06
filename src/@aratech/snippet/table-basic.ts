import { MatTableDataSource } from '@angular/material/table'

export class TableBasic {
	tableData: MatTableDataSource<any> = new MatTableDataSource<any>([])
	tableColumns: string[] = []
	tableDataCount: number = 0
}
