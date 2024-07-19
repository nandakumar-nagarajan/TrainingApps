import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AppConfig } from 'ClientApp/config/app.config';
import { CustomDateFormat } from 'ClientApp/app/pipes/scmodify-date.pipe';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTable } from '@angular/material/table';
import { SharedDataService } from "ClientApp/app/services/scshared.data.service";
import { formBuilder } from 'ClientApp/app/model/scform-builder.model';
import { Users } from 'ClientApp/app/model/scuser.model'
import { FieldConfig } from '../../../field.interface';
import { Constants, GridId } from '../../../constants/scconstants';
import { SccolumnConfigurationComponent } from '../../forms/sccolumn-configuration/sccolumn-configuration.component';
import { EndusersService } from '../../../services/scenduser.service';
import { ColumnConfiguration } from '../sccustom-grid/sccustom-grid.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SortData } from '../../../model/scfilter.model';

@Component({
    selector: 'app-scgrid',
    templateUrl: './scgrid.component.html',
    styleUrls: ['./scgrid.component.scss']
})
export class ScgridComponent implements OnInit {
    @Input() gridId: string;
    @Input() columns: GridColumn[];
    @Input() filterData: any;
    @Input() dataRows: any[];
    @Input() checkBoxColumm: boolean = false;  //Determines If the Grid should be selectable using Checkboxes
    @Input() multiRowSelect: boolean = false;  //Determines If the Grid should have single selection or multi selectable rows
    @Input() showIconColumn: boolean = false;  //Determines If the Grid should have the Colour indicators for statuses
    @Input() exportToExcel: boolean = false; //Determines if the Grid should have Export to Excel Functionalities
    @Input() filterItemsAwaitingApproval: boolean = false; //Determines if the Grid should have a filter for items waiting for approval.
    @Input() filterItemsNoApproval: boolean = false; //Determines if the Grid should have a filter for items with do not require approval
    @Input() refreshColumns: boolean = false;
    @Input() totalRowCount: number = 0;
    @Input() activeSortColumn: SortData;
    @Input() manageColumns: boolean = true; //Determines if the Grid should have Column Management feature. True By Default.
    @Input() saveColumnDefinition: boolean = true; //Determines if the Grid Changed Grid column configurations can be saved. True by default if managecolumns is enabled.
    @Input() gridActions: boolean = false; //Determines if the Grid should have Grid Actions like delete
    @Input() refreshId: number;
    @Input() child: boolean = false;  //Determines If the Grid is a child grid in the Hierarchy
    @Input() hierarchicalSelections: any[] = [];
    @Input() btnCreateNew: string;
    @Input() actionColumn: boolean = false;
    @Input() contextMenuItems: any[] = [];
    @Input() btnCreateNewProof: string;
    @Input() selectedRow: any[] = [];
    @Input() showPageSizeOption: boolean = true;

    @Output() onSingleClick = new EventEmitter<any>();
    @Output() onRowSelection = new EventEmitter<any>();
    @Output() onExportToExcel = new EventEmitter<any>();
    @Output() onEditRowInline = new EventEmitter<any>();
    @Output() onPagination = new EventEmitter<any>();
    @Output() onDeleteSelectedRows = new EventEmitter<any>();
    @Output() onCreateNew = new EventEmitter<any>();
    @Output() onContextMenuClick = new EventEmitter<any>();
    @Output() onCreateNewProof = new EventEmitter<any>();

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatTable, { read: ElementRef, static: false }) private matTableRef: ElementRef;
    @ViewChild('columnManagementTrigger', { static: false }) savedFormListTrigger: MatMenuTrigger;
    @ViewChild('actionTrigger', { static: false }) contextMenu: MatMenuTrigger;

    length = 100;
    pageSize = (document.getElementById('hdnDefaultPageSize') as HTMLFormElement).value;
    pageSizeOptions = (document.getElementById('hdnPageSizeOption') as HTMLFormElement).value.split(',');
    pageIndex = 0;
    dataSource: MatTableDataSource<any>;
    displayNoRecords: boolean = false;
    displayedColumns: any[] = [];
    selection: SelectionModel<any>;
    statusList: FieldConfig;
    statusFiltered: boolean = false;
    filterStatus: boolean = false;
    previousPageSize = 10;
    columnConfiguration: ColumnConfiguration;
    disableAddNewButton: boolean = false;
    contextMenuPosition = { x: '0px', y: '0px' };

    constructor(private _config: AppConfig, public customDatePipe: CustomDateFormat, public sharedData: SharedDataService, public dialog: MatDialog, private userService: EndusersService, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        if (this.checkBoxColumm) {
            this.displayedColumns.push('checkbox');
            if (this.child) {
                this.selection = new SelectionModel<any>(this.multiRowSelect, this.hierarchicalSelections);
            }
            else {
                this.selection = new SelectionModel<any>(this.multiRowSelect, this.selectedRow);
            }
        }

        if (this.showIconColumn) {
            this.statusList = {
                type: null,
                name: "statusList",
                options: [
                    { code: null, name: this._config.getResourceByKey("FullHistory"), display: this._config.getResourceByKey("FullHistory") },
                    { code: Constants.Green, name: this._config.getResourceByKey("Approved"), display: this._config.getResourceByKey("Approved") },
                    { code: Constants.Red, name: this._config.getResourceByKey("Rejected"), display: this._config.getResourceByKey("Rejected") }
                ],
                value: null,
                codeDisplayed: "E"
            }

            if (this.filterItemsAwaitingApproval) {
                this.statusList.options.splice(1, 0,
                    { code: Constants.Yellow, name: this._config.getResourceByKey("AwaitingApproval"), display: this._config.getResourceByKey("AwaitingApproval") }
                );
            }

            if (this.filterItemsNoApproval) {
                this.statusList.options.push(
                    { code: Constants.NoColor, name: this._config.getResourceByKey("NoApprovalRequired"), display: this._config.getResourceByKey("NoApprovalRequired") }
                );
            }
        }

        this.fillDisplayedColumns(true);
        if (this.paginator) {
            this.paginator._intl.itemsPerPageLabel = this._config.getResourceByKey("ItemsPerPage") + ":";
        }
        
    }

    async fillDisplayedColumns(saveConfiguration: boolean) {
        let gridColumns: GridColumn[] = this.columns;
        this.spinner.show("GRIDSPINNER")
        if (this.manageColumns && saveConfiguration) {
            let savedConfigColumns: GridColumn[] = [];
            await this.userService.getUserColumnConfiguration(this.gridId).then(ret => {
                if (ret && ret["docs"] && ret["docs"][0]) {
                    this.columnConfiguration = ret["docs"][0];
                    savedConfigColumns = ret["docs"][0].columns;
                }
            });

            if (savedConfigColumns && savedConfigColumns.length > 0) {
                gridColumns.forEach(x => {
                    if (!savedConfigColumns.find(y => y.name == x.name)) {
                        savedConfigColumns.push(x);
                    }
                });

                gridColumns = savedConfigColumns;
            }
        }

        let displayedColumns = [];

        if (this.checkBoxColumm) {
            displayedColumns.push('checkbox');
        }

        if (this.showIconColumn) {
            displayedColumns.push('statusIcon');
        }

        gridColumns = gridColumns.sort((a, b) => a.order < b.order ? -1 : 1);

        for (var column of gridColumns) {
            if (!column.hide) {
                displayedColumns.push(column.name);
            }
        }

        if (this.actionColumn) {
            displayedColumns.push('actions');
        }

        this.displayedColumns = [];
        setTimeout(() => {
            this.displayedColumns = displayedColumns;
        });
        this.columns = gridColumns;
        setTimeout(() => { this.spinner.hide("GRIDSPINNER"); }, 0)
    }

    ngOnChanges() {
        if (this.child) {
            this.selection = new SelectionModel<any>(this.multiRowSelect, this.hierarchicalSelections);
        }
        else {
            this.selection = new SelectionModel<any>(this.multiRowSelect, this.selectedRow);
        }

        if (this.refreshColumns) {
            this.ngOnInit();
        }

        if (!this.dataRows || (this.dataRows && this.dataRows.length == 0)) {
            this.displayNoRecords = true;
            this.createDataSource(this.dataRows);
        }
        else {
            this.displayNoRecords = false;
            this.filterStatus = this.dataRows.find(x => x.statusIcon == Constants.Red || x.statusIcon == Constants.Green) ? true : false;

            if (this.showIconColumn) {
                this.filterData["statusIcon"] = null;
                this.statusFiltered = false;
            }

            this.createDataSource(this.dataRows);
            this.applyFilter(event, "");
        }
    }

    applyFilter(event: Event, field: string) {
        const tableFilters = [];

        for (var column of this.columns) {
            tableFilters.push({
                id: column.name,
                value: this.filterData[column.name] ? this.filterData[column.name].toLowerCase() : ""
            })
        }

        if (this.showIconColumn) {
            tableFilters.push({
                id: "statusIcon",
                value: this.filterData["statusIcon"] ? this.filterData["statusIcon"].toLowerCase() : ""
            })
        }

        if (this.dataSource) {
            this.dataSource.filter = JSON.stringify(tableFilters);
            if (this.gridId == GridId.ScenduserList) {
                this.sharedData.filteredUserColumns = this.filterData as Users;
            }

            if (this.dataSource.filteredData.length == 0) {
                this.displayNoRecords = true;
            }
            else {
                this.displayNoRecords = false;
            }
        }

        if (!this.child && this.dataSource && this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    onStatusFilter(opt: string) {
        this.statusFiltered = opt ? true : false;
        this.filterData["statusIcon"] = opt;
        this.applyFilter(null, "statusIcon");
    }

    setPageSizeOptions(setPageSizeOptionsInput: string) {
        this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

    onPaginateChange(event) {
        this.pageIndex = event.pageIndex;
    }

    createDataSource(documents: any[]) {
        this.dataSource = new MatTableDataSource(documents);
        if (!this.child) {
            this.dataSource.paginator = this.paginator;
        }

        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate =
            (data: any, filtersJson: string) => {
                const matchFilter = [];
                const filters = JSON.parse(filtersJson);
                filters.forEach(filter => {
                    let dataValue = data[filter.id] === null ? '' : data[filter.id];
                    dataValue = dataValue ? dataValue.toString() : '';

                    //11350_SC Problem with Employment Contract Grid Filtering and Sorting
                    let columnDefinication = this.columns ? this.columns.find(col => col.name == filter.id) : null;
                    let columnType = columnDefinication ? columnDefinication.type : "";

                    if (dataValue && ((columnType == "DATETIME") || (columnType == "DATE") || dataValue.match(/^\d{4}\-\d{2}\-\d{2}T([01][0-9]|2[0-3])(:[0-5][0-9]){2}([:.]\d{0,3})?Z?/))) {
                        dataValue = this.customDatePipe.transform(dataValue, "isoFormatDateTime").toString();
                        let dataval2 = "".replace(/\./ig, "")
                        if (dataValue.toLowerCase().includes(filter.value.trim().toLowerCase())) {
                            matchFilter.push(dataValue.toLowerCase().includes(filter.value.trim().toLowerCase()));
                        }
                        else {
                            matchFilter.push(dataValue.toLowerCase().replace(/\./ig, "").includes(filter.value.trim().toLowerCase()));
                        }
                    }
                    else {
                        matchFilter.push(dataValue.toLowerCase().includes(filter.value.trim().toLowerCase()));
                    }
                });
                return matchFilter.every(Boolean);
            }
    }

    CreateNewProof() {
        this.onCreateNewProof.emit();
    }

    onShowRecordChange() {
        if (this.dataSource) {
            if (this.dataSource.filteredData.length == 0) {
                this.displayNoRecords = true;
            }
            else {
                this.displayNoRecords = false;
            }
        }
    }

    rowSingleClick(row: any) {
        this.onSingleClick.emit(row);
    }

    checkBoxToggle(row?: any) {
        this.selection.toggle(row);
        this.onRowSelection.emit(this.selection.selected);
    }

    exportArray() {
        this.onExportToExcel.emit();
    }

    editRowInline(row: any) {
        this.onEditRowInline.emit(row);
    }

    sortData(event: any) {
    }

    closeConfiguration(data: any) {
        this.savedFormListTrigger.closeMenu();
    }

    async onChangeColumnConfig(data: any) {
        this.spinner.show("MANAGECOLUMNSSPINNER");

        let columnConfiguration: ColumnConfiguration = this.columnConfiguration ? this.columnConfiguration : {};
        columnConfiguration.gridId = this.gridId;
        data.columns.forEach(x => {
            let newWidth = this.getColumnWidth(x).toString();
            x.width = newWidth.includes("px") ? newWidth : newWidth + "px";
        });

        if (data.save) {
            columnConfiguration.columns = data.columns;
            await this.userService.saveColumnConfiguration(columnConfiguration)
                .then(ret => {
                    this.ngOnInit();
                    this.savedFormListTrigger.closeMenu();
                });
        }
        else {
            this.columns = data.columns;
            this.fillDisplayedColumns(false);
        }

        setTimeout(() => { this.spinner.hide("MANAGECOLUMNSSPINNER"); }, 0);
    }

    getColumnWidth(column: GridColumn) {
        const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.name));
        return columnEls && columnEls[0] ? columnEls[0].clientWidth : column.width;
    }

    onDeleteSelected() {
        this.onDeleteSelectedRows.emit(this.selection.selected)
    }

    onContextMenu(event: MouseEvent, row: any) {
        if (this.contextMenuItems == null || this.contextMenuItems == undefined) {
            this.contextMenuItems = [
                { name: Constants.Update, label: this._config.getResourceByKey("UpdateRow"), icon: "edit" },
                { name: Constants.Delete, label: this._config.getResourceByKey("DeleteRow"), icon: "delete" },
            ]
        }
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'row': row };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }

    contextMenuAction(action: string, row: any) {
        this.onContextMenuClick.emit({ action: action, row: row });
    }

    createNewForm() {
        this.onCreateNew.emit();
    }
}

export class GridColumn {
    order?: number;
    name?: string;
    name_sc_text?: string;
    display?: string;
    type?: string;
    filterable?: boolean;
    width?: string;
    hide?: boolean;
    frozen?: boolean;
    editable?: boolean;
    locked?: boolean;
    maxLength?: string;
    instructionText?: string;
    multiSelect?: boolean;
    hideSelectedValueOnDisplay?: boolean;
    clickable?: boolean;
}
