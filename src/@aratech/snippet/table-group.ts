import { ArrayUtils } from '@aratech/utils/arrayUtils'
import { TableBasic } from './table-basic'

export class TableGroup extends TableBasic {
	sortEmptyField: string = ''
	groupFields: (item: any) => any[] = null
	isGetOptionalData: boolean = true

	dataGroup(inputData: any[]) {
		if (inputData.length === 0) {
			console.error('Thiếu đầu vào inputData hàm dataGroup')
			this.tableData.data = []
			return
		}
		if (!this.groupFields) {
			console.error('Tạo thêm trường groupFields là một callback hàm dataGroup')
			this.tableData.data = []
			return
		}
		this.tableData.data = ArrayUtils.groupData(inputData, this.groupFields, {
			isGetOptionalData: this.isGetOptionalData,
			sortEmptyField: this.sortEmptyField
		})
		// console.log(this.tableData.data)
	}

	isGroup = (_: number, __: any) => __.isGroup
	isNotGroup = (_: number, __: any) => !__.isGroup

	toggleGroupRow(_: any) {
		_.isExpanded = !_.isExpanded
		_.optionalData.forEach((e: { isExpanded: boolean }) => {
			e.isExpanded = !e.isExpanded
		})
	}
}
/* TS: Please extends TableGroup
    @Component({
        ....
        animations: [
            trigger('groupExpand', [
                state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
                state('expanded', style({ height: 'auto', minHeight: 'auto', display: 'flex' }))
            ])
        ]
    })
*/

/* HTML SPAMPLE
    <section class="table-container">
        <table mat-table multiTemplateDataRows class="detail-table-group" [dataSource]="tableData" [fixedLayout]="true">
            <!-- STT -->
            <ng-container matColumnDef="position">
                <mat-header-cell mat-header-cell *matHeaderCellDef> {{ 'Common.No' | translate }} </mat-header-cell>
                <mat-cell mat-cell *matCellDef="let e">
                    <div *ngIf="e.isExpanded" [@groupExpand]="e.isExpanded ? 'expanded' : 'collapsed'">
                        {{ e.position }}
                    </div>
                </mat-cell>
            </ng-container>
            <!-- Field ... -->

            <ng-container matColumnDef="groupRow">
                <mat-cell mat-cell *matCellDef="let e" [attr.colspan]="7" class="pl-0">
                    <button mat-icon-button>
                        <mat-icon class="mat-icon-rtl-mirror">
                            {{ e?.isExpanded ? 'expand_more' : 'chevron_right' }}
                        </mat-icon>
                    </button>
                    <b>{{ e.groupData[1].toUpperCase() }}</b>
                </mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="tableColumns; sticky: true"></mat-header-row>
            <!-- Top Group Row  -->
            <mat-row
                *matRowDef="let row; columns: ['groupRow']; when: isGroup"
                class="group-row"
                (click)="toggleGroupRow(row)"
            ></mat-row>
            <!-- Bottom Item Row -->
            <mat-row
                *matRowDef="let row; columns: tableColumns; when: isNotGroup"
                class="item-row"
                [class.visible-row]="row.isExpanded"
            ></mat-row>
        </table>
    </section>
    <mat-paginator [length]="tableDataCount" [disabled]="true" [hidePageSize]="true"></mat-paginator>
*/

/* SCSS
    @import '@aratech/scss/table.scss';

    .table-container {
        // height: calc(100vh - 270px);
    }

    .detail-table-group {
        .mat-column-position {
            white-space: nowrap !important;
            max-width: 60px !important;
            width: 100% !important;
            text-overflow: ellipsis !important;
        }
        //Code ....
    }
*/
