import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppConfig } from '../../../../config/app.config';
import { Constants, GridId, PSRights } from "../../../constants/scconstants"
import { GridColumn } from '../../controls/scgrid-serverside/scgrid-serverside.component';
import { EmploymentContract } from '../../../model/sccontract.model';
import { FilterButton } from '../../../shared/interface/common.interface';
import { SortData } from '../../../model/scfilter.model';
import { AttachmentMap, AttachmentAttribute, AttachmentDataItem } from '../../../model/scattachment.model';
import { PsDataService } from '../../../services/psdata.service';
import { ScFormService } from '../../../services/scform.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeShareData } from '../../../shared/interface/shareddata.interface';
import * as moment from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from "../../../services/common.service";
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-psperson-attachment',
    templateUrl: './psperson-attachment.component.html',
    styleUrls: ['./psperson-attachment.component.scss']
})
export class PspersonAttachmentComponent implements OnInit {
    gridId: GridId.PsPersonAttachmentGrid;
    columns: GridColumn[];
    attachmentData: AttachmentDataItem[] = [];
    dataRows: AttachmentDataItem[] = [];
    totalRowCount: number = 0;
    buttons: FilterButton[] = [];
    activeSortColumn: SortData;
    formShareSubscription: Subscription;
    sharedDataInfo: EmployeeShareData;
    disableDeleteButton: boolean = true;
    contextMenuItems: any[] = [];
    personId: string = null;
    dataGroup: string = null;

    //Upload Attachment Grid Data
    newAttachment: AttachmentDataItem = new AttachmentDataItem();
    maxSizeFile: number = Constants.AttachmentMaxSize * 1024 * 1024; //2mb
    descriptionFormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
    ]);
    dialogRef: MatDialogRef<any>;
    constructor(public _config: AppConfig, private psDataService: PsDataService, private router: Router, private scformService: ScFormService, private common: CommonService, private dialog: MatDialog) {

    }

    ngOnInit(): void {
        this.psDataService.setGetFormSharedData({}); //get employe id
        
        this.formShareSubscription = this.psDataService.setGetEmployeeInfo().pipe(take(1)).subscribe(resp => {
            if (resp && !Object.keys(resp).length) {
                this.router.navigateByUrl('/main/0/persons');
            }
            this.sharedDataInfo = resp;
            this.personId = this.sharedDataInfo?.employeeId;
            this.dataGroup = "person";
            this.columns = [
                { name: "fileName", display: this._config.getResourceByKey("Name"), type: "T", sortable: true, sortType: "string", clickable: true },
                { name: "fileDate", display: this._config.getResourceByKey("AttachmentDate"), type: "DATE",  sortable: true, sortType: "string" },
                { name: "fileDescription", display: this._config.getResourceByKey("AttachmentDescription"), type: "T",  sortable: true, sortType: "string" },
                { name: "fileType", display: this._config.getResourceByKey("AttachmentUseAsImage"), type: "T",  sortable: true, sortType: "string" }
            ];

            this.activeSortColumn = { name: "fileName", type: "T", direction: "desc", columnName: "fileName" };

            this.listAttachment(this.personId, this.dataGroup);

            //Update Context Menu 
            this.contextMenuItems = [
                { name: Constants.Delete, label: this._config.getResourceByKey("Delete") },
            ]
        });
        
    }


    //Attachments Methods
    //#region
    openModal(templateRef) {
        this.dialogRef = this.dialog.open(templateRef, {
            width: '40%',
            height: 'auto',
            disableClose: true
        });
    }

    closeModal() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    handleFile(attachmentObj: AttachmentDataItem): void {
        if (attachmentObj && attachmentObj.file.size <= this.maxSizeFile) {
            const newFile: AttachmentDataItem = {
                fileName: attachmentObj.file.name,
                fileDescription: '',
                fileDate: null,
                file: attachmentObj.file
            };
            this.newAttachment = newFile;
        } else {
            console.error('File is too large or no file selected. Maximum size is 2MB.');
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            this.newAttachment.file = event.dataTransfer.files[0];
            this.handleFile(this.newAttachment);
        }
    }

    onFileChange(event: any): void {
        this.newAttachment.file = event.target.files[0];
        this.handleFile(this.newAttachment);
    }

    datePickerChange(event: any)
    {
        const minDate = new Date('2020-01-01');
        const maxDate = new Date('2025-12-31');
        const selectedDate = new Date(event.value);

        if (selectedDate < minDate || selectedDate > maxDate) {
            console.log('Selected date must be between 2020-01-01 and 2025-12-31');
        }
        else {
            this.newAttachment.fileDate = moment(selectedDate).format('YYYYMMDD');
        }
    }

    validateDescription(event: any) {
        const description = this.newAttachment.fileDescription;

        if (description.length < 5 || description.length > 100) {
            console.log('Description must be between 5 and 100 characters');
        }
    }

    clearFile() {
        this.newAttachment = new AttachmentDataItem();
        this.closeModal();
    }

    removeAttachmentById(id: number) {
        this.dataRows = this.dataRows.filter(item => item.id !== id);
    }

    contextMenuClick(event: any) {
        switch (event.action) {
            case Constants.Delete:
                this.deleteAttachment(event.row.id, event.row.personId);
                break;
        }
    }   

    submitFileData() {
        this.uploadAttachment(this.newAttachment);
        this.closeModal();
    }

    async uploadAttachment(attachment: AttachmentDataItem) {
        await this.scformService.uploadAttachment(this.personId, attachment.fileDate, this.dataGroup, attachment.fileDescription, attachment.file)
            .then((res: any) => {
                if (res?.errorMessage == "Created") {
                    //this.dataRows.push({ ...attachment }); // Add the new attachment to the grid we are not reciving id from response 
                    //reload grid from server 
                    this.listAttachment(this.personId, this.dataGroup);
                    this.newAttachment = new AttachmentDataItem(); // Reset newAttachment for next input
                }
            })
            .catch((error: any) => {
                console.error('Upload failed:', error);
            });
    }
    
    async downloadAttachment(event: any) {
        await this.scformService.downloadAttachment(event.id)
            .then((response: any) => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const a = document.createElement('a');
                a.href = url;
                a.download = event.fileName; 
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error: any) => {
                console.error('Download failed:', error);
            });
    }

    async listAttachment(personId, dataGroup) {
        await this.scformService.getAttachment(personId, dataGroup)
            .then((res: { data?: any[] }) => {
                if (res?.data) {
                    this.attachmentData = res.data.map((form: any): AttachmentDataItem => ({
                        fileName: form.fileName,
                        fileDescription: form.fileDescription,
                        id: form.id,
                        personId: form.personId,
                        datagroup: form.datagroup,
                        fileDate: form.fileDate ? moment(form.fileDate, 'YYYYMMDD').format('DD.MM.YYYY') : null,
                        fileType: form.fileType,
                    }));
                    this.totalRowCount = res.data.length;
                    this.dataRows = this.attachmentData;
                }
            })
            .catch((error: any) => {
                throw error;
            });
    }

    async deleteAttachment(id: number, personId: string) {
        const confirm = await this.common.confirmation(this._config.getResourceByKey("AttachmentDeleteConfirmation"))
        if (confirm === Constants.Yes) {
            this.scformService.deleteAttachment(id, personId).then((response: any) => {
                if (response) {
                    if (response?.message == "OK") {
                        this.removeAttachmentById(id);
                    } else {
                        console.error("Some Error ouccured while delete", response);
                    }
                }
            })
            return true;
        }
        return false;
    }

    //#endregion
}
