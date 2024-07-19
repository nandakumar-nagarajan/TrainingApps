import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from "./material.module";
import { DropdownComponent } from './components/controls/scdropdown/scdropdown.component';
import { DatepickerComponent } from './components/controls/scdatepicker/scdatepicker.component';
import { DynamicFormComponent } from './components/forms/scdynamic-form/scdynamic-form.component';
import { ScmainComponent } from './components/forms/scmain/scmain.component';
import { ScuserFormComponent } from './components/forms/scuser-form/scuser-form.component';
import { ScMainService } from "ClientApp/app/services/scmain.service";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslationConfigModule } from './translation.config.module';
import { AppConfig } from '../config/app.config';

import { ScconfirmBottomsheetComponent } from './components/forms/scconfirm-bottomsheet/scconfirm-bottomsheet.component';
import { SharedDataService } from "ClientApp/app/services/scshared.data.service";
import { ScformBuilderComponent } from './components/forms/scform-builder/scform-builder.component';
import { ScformApprovalComponent } from './components/forms/scform-approval/scform-approval.component';
import { SchomeComponent } from './components/forms/schome/schome.component';
import { ScenduserComponent } from './components/forms/scenduser/scenduser.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ModifyDatePipe, CustomDateFormat } from 'ClientApp/app/pipes/scmodify-date.pipe';
import { MatPaginatorIntlCro } from 'ClientApp/config/CustomPaginatorConfiguration';
import { ScformlistComponent } from './components/forms/scformlist/scformlist.component';
import { ScloginComponent } from './components/forms/sclogin/sclogin.component';
import { ScusercreationComponent } from './components/forms/scusercreation/scusercreation.component';
import { ScusercreationpopupComponent } from './components/forms/scusercreationpopup/scusercreationpopup.component';
import { ScalertWindowComponent } from './components/forms/scalert-window/scalert-window.component';
import { JwtInterceptor } from './helpers/scjwt.interceptor';
import { ErrorInterceptor, SCErrorHandler } from './helpers/scerror.interceptor';
import { ScadminDashboardComponent } from './components/forms/scadmin-dashboard/scadmin-dashboard.component';
import { ScadminDocumentViewComponent } from './components/forms/scadmin-document-view/scadmin-document-view.component';
import { SciwaAuthenticateComponent } from './components/forms/sciwa-authenticate/sciwa-authenticate.component';
import { ScgridComponent } from './components/controls/scgrid/scgrid.component';
import { ScapprovalStatusComponent } from './components/forms/scapproval-status/scapproval-status.component';
import { ScapprovalPaymentEventComponent } from './components/forms/scapproval-payment-event/scapproval-payment-event.component';
import { ScbatchjobrunedittemplateComponent } from './components/forms/scbatchjobrun-edit-template/scbatchjobrun-edit-template.component';
import { ScbatchjobruntemplateComponent } from './components/forms/scbatchjobrun-template/scbatchjobrun-template.component';
import { ScbatcheditdialogComponent } from './components/forms/scbatch-edit-dialog/scbatch-edit-dialog.component';
import { ScbatcheditpopupdialogComponent } from './components/forms/scbatch-edit-popup-dialog/scbatch-edit-popup-dialog.component';
import { ScformHistoryComponent } from './components/forms/scform-history/scform-history.component';
import { ScdocumentHistoryComponent } from './components/forms/scdocument-history/scdocument-history.component';
import { ScapprovalAbsenceComponent } from './components/forms/scapproval-absence/scapproval-absence.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ScapprovalPersonComponent } from './components/forms/scapproval-person/scapproval-person.component';
import { SccustomGridComponent } from './components/controls/sccustom-grid/sccustom-grid.component';
import { ProfileComponent } from './components/forms/scprofile/scprofile.component';
import { ScdocumentApprovalComponent } from './components/forms/scdocument-approval/scdocument-approval.component';
import { ScdocumentPanelComponent } from './components/forms/scdocument-panel/scdocument-panel.component';
import { ScdocumentPageComponent } from './components/forms/scdocument-page/scdocument-page.component';
import { ScdocumentApprovalPopupComponent } from './components/forms/scdocument-approval-popup/scdocument-approval-popup.component';
import { ScpubllishedDocumentPanelComponent } from './components/forms/scpubllished-document-panel/scpubllished-document-panel.component';
import { ScpubllishedDocumentPopupComponent } from './components/forms/scpubllished-document-popup/scpubllished-document-popup.component';
import { ScuserComponent } from './components/forms/scuser/scuser.component';
import { ScuserGroupComponent } from './components/forms/scuser-group/scuser-group.component';
import { ScuserGroupPopupComponent } from './components/forms/scuser-group-popup/scuser-group-popup.component';
import { ScuserGroupCreationComponent } from './components/forms/scuser-group-creation/scuser-group-creation.component';
import { ScimportComponent } from './components/forms/scimport/scimport.component';
import { ScimportPopupComponent } from './components/forms/scimport-popup/scimport-popup.component';
import { ScimportProcessComponent } from './components/forms/scimport-process/scimport-process.component';
import { ScimportHistoryComponent } from './components/forms/scimport-history/scimport-history.component';
import { ScimportStatusViewComponent } from './components/forms/scimport-status-view/scimport-status-view.component';
import { ScmassCopyComponent } from './components/forms/scmass-copy/scmass-copy.component';
import { ScmanagerDocumentPanelComponent } from './components/forms/scmanager-document-panel/scmanager-document-panel.component';
import { ScmanagerDocumentPopupComponent } from './components/forms/scmanager-document-popup/scmanager-document-popup.component';
import { ScmanageSubstitutePopupComponent } from './components/forms/scmanage-substitute-popup/scmanage-substitute-popup.component';
import { ScmanageSubstituteComponent } from './components/forms/scmanage-substitute/scmanage-substitute.component';
import { ScsubstituteCreationComponent } from './components/forms/scsubstitute-creation/scsubstitute-creation.component';
import { ScswitchUserComponent } from './components/forms/scswitch-user/scswitch-user.component';
import { ScuserSubstituteComponent } from './components/forms/scuser-substitute/scuser-substitute.component';
import { ScsubstituteCreationPopupComponent } from './components/forms/scsubstitute-creation-popup/scsubstitute-creation-popup.component';
import { ScformFieldLogsPopupComponent } from './components/forms/scform-field-logs-popup/scform-field-logs-popup.component';
import { ScmanagerApprovalHistoryPopupComponent } from './components/forms/scmanager-approval-history-popup/scmanager-approval-history-popup.component';
import { ScmanagerDocumentApprovalComponent } from './components/forms/scmanager-document-approval/scmanager-document-approval.component';
import { ScapprovalVacationComponent } from './components/forms/scapproval-vacation/scapproval-vacation.component';
import { ScfilterComponent } from './components/forms/scfilter/scfilter.component';
import { SccustomDropdownComponent } from './components/controls/sccustom-dropdown/sccustom-dropdown.component';
import { ScbonusFormComponent } from './components/forms/scbonus-form/scbonus-form.component';
import { ScbonusPanelComponent } from './components/forms/scbonus-panel/scbonus-panel.component';
import { ScuserCostcenterComponent } from './components/forms/scuser-costcenter/scuser-costcenter.component';
import { ScmanageCostcenterComponent } from './components/forms/scmanage-costcenter/scmanage-costcenter.component';
import { SccostcenterCreationComponent } from './components/forms/sccostcenter-creation/sccostcenter-creation.component';
import { SccostcenterCreationPopupComponent } from './components/forms/sccostcenter-creation-popup/sccostcenter-creation-popup.component';
import { ScemploymentContractComponent } from './components/forms/scemployment-contract/scemployment-contract.component';
import { ScemploymentContractCreationComponent } from './components/forms/scemployment-contract-creation/scemployment-contract-creation.component';
import { ScemploymentContractHistoryComponent } from './components/forms/scemployment-contract-history/scemployment-contract-history.component';
import { ScemploymentContractFormComponent } from './components/forms/scemployment-contract-form/scemployment-contract-form.component';
import { ScemploymentHotelContractFormComponent } from './components/forms/scemployment-hotel-contract-form/scemployment-hotel-contract-form.component';
import { ScemploymentGeneralContractFormComponent } from './components/forms/scemployment-general-contract-form/scemployment-general-contract-form.component';
import { ScemploymentLearnEarnContractFormComponent } from './components/forms/scemployment-learn-earn-contract-form/scemployment-learn-earn-contract-form.component';
import { ScemploymentContractSearchComponent } from './components/forms/scemployment-contract-search/scemployment-contract-search.component';
import { SctabRefreshComponent } from './components/forms/sctab-refresh/sctab-refresh.component';
import { ScsettingsComponent } from './components/forms/scsettings/scsettings.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SccustomFilterComponent } from './components/controls/sccustom-filter/sccustom-filter.component';
import { ScpayrollClerkViewComponent } from './components/forms/scpayroll-clerk-view/scpayroll-clerk-view.component';
import { ScapproversListComponent } from './components/forms/scapprovers-list/scapprovers-list.component';
import { ScconfigurationComponent } from './components/forms/scconfiguration/scconfiguration.component';
import { SclicenseComponent } from './components/forms/sclicense/sclicense.component';
import { ScheaderGroupComponent } from './components/forms/scheader-group/scheader-group.component';
import { ScformListPanelComponent } from './components/forms/scform-list-panel/scform-list-panel.component';
import { ScformGroupPanelComponent } from './components/forms/scform-group-panel/scform-group-panel.component';
import { ScbulkUserFormComponent } from './components/forms/scbulk-user-form/scbulk-user-form.component';
import { ScbulkUserFormPanelComponent } from './components/forms/scbulk-user-form-panel/scbulk-user-form-panel.component';
import { ScbulkProcessPanelComponent } from './components/forms/scbulk-process-panel/scbulk-process-panel.component';
import { ScbulkUserPaymentFormPanelComponent } from './components/forms/scbulk-user-payment-form-panel/scbulk-user-payment-form-panel.component';
import { ScgridEditableComponent } from './components/controls/scgrid-editable/scgrid-editable.component';
import { ScroleBasedRightsComponent } from './components/forms/scrole-based-rights/scrole-based-rights.component';
import { SccolumnConfigurationComponent } from './components/forms/sccolumn-configuration/sccolumn-configuration.component';
import { ScResizeColumnDirective } from './helpers/scresize-column.directive';
import { ScsetupComponent } from './components/configuration/scsetup/scsetup.component';
import { ScsetupAppsettingComponent } from './components/configuration/scsetup-appsetting/scsetup-appsetting.component';
import { ScgridServersideComponent } from './components/controls/scgrid-serverside/scgrid-serverside.component';
import { ScfilterConfigurationComponent } from './components/forms/scfilter-configuration/scfilter-configuration.component';
import { SchelpDocumentComponent } from './components/forms/schelp-document/schelp-document.component';
import { ScgeneralHelpDocumentComponent } from './components/forms/scgeneral-help-document/scgeneral-help-document.component';
import { ScemploymentContractSignatureComponent } from './components/forms/scemployment-contract-signature/scemployment-contract-signature.component';
import { ScpublishedFreesearchComponent } from './components/forms/scpublished-freesearch/scpublished-freesearch.component';
import { ScdocumentApproverListComponent } from './components/forms/scdocument-approver-list/scdocument-approver-list.component';
import { ScdocumentMonitoringViewComponent } from './components/forms/scdocument-monitoring-view/scdocument-monitoring-view.component';
import { SchierarchicalGridComponent } from './components/controls/schierarchical-grid/schierarchical-grid.component';
import { CdkDetailRowDirective } from './components/controls/schierarchical-grid/cdk-detail-row';
import { SchierarchicalDropdownComponent } from './components/controls/schierarchical-dropdown/schierarchical-dropdown.component';
import { ScmanageContractStagesComponent } from './components/forms/scmanage-contract-stages/scmanage-contract-stages.component';
import { PsformbuilderFieldsComponent } from './components/forms/psformbuilder-fields/psformbuilder-fields.component';
import { SearchPipe } from './pipes/search.pipe';
import { ScpersonListComponent } from './components/forms/scperson-list/scperson-list.component';
import { ScpersonCreationPanelComponent } from './components/forms/scperson-creation-panel/scperson-creation-panel.component';
import { ScchiplistComponent } from './components/controls/scchiplist/scchiplist.component';
import { PspersonBasicDataComponent } from './components/forms/psperson-basic-data/psperson-basic-data.component';
import { PspersonEmploymentContractComponent } from './components/forms/psperson-employment-contract/psperson-employment-contract.component';
import { PspersonDegreeComponent } from './components/forms/psperson-degree/psperson-degree.component';
import { PspersonCompetenciesComponent } from './components/forms/psperson-competencies/psperson-competencies.component';
import { PscontractOtherinformationComponent } from './components/forms/pscontract-otherinformation/pscontract-otherinformation.component';
import { PspersonWorkExperiencesComponent } from './components/forms/psperson-work-experiences/psperson-work-experiences.component';
import { PsformGroupsComponent } from './components/controls/psform-groups/psform-groups.component';
import { PsmultipleDataComponent } from './components/controls/psmultiple-data/psmultiple-data.component';
import { PsmultipleDataChildComponent } from './components/controls/psmultiple-data-child/psmultiple-data-child.component';
import { PspersonContractsComponent } from './components/forms/psperson-contracts/psperson-contracts.component';
import { PsformMultirowHandlerComponent } from './components/controls/psform-multirow-handler/psform-multirow-handler.component';
import { PsemployeeProfileComponent } from './components/forms/psemployee-profile/psemployee-profile.component';
import { PsfilterButtonsComponent } from './components/controls/psfilter-buttons/psfilter-buttons.component';
import { PscompanyComponent } from './components/forms/pscompany/pscompany.component';
import { DirtyformGuard } from './guards/dirtyform.guard';
import { PspersonTerminationComponent } from 'ClientApp/app/components/forms/psperson-termination/psperson-termination.component';
import { PsholidayViewComponent } from './components/forms/psholiday-view/psholiday-view.component';
import { PsholidayTabViewComponent } from './components/forms/psholiday-tab-view/psholiday-tab-view.component';
import { PsabsenceHistoryComponent } from './components/forms/psabsence-history/psabsence-history.component';
import { PsvacationHistoryComponent } from './components/forms/psvacation-history/psvacation-history.component';
import { PsVacationFormComponent } from './components/forms/psvacation-form/psvacation-form.component';
import { PsAbsenceFormComponent } from './components/forms/psabsence-form/psabsence-form.component';
import { PspersonListViewComponent } from './components/forms/psperson-list-view/psperson-list-view.component';
import { PstemplateSelectionComponent } from './components/controls/pstemplate-selection/pstemplate-selection.component';
import { PsfieldmappingComponent } from './components/forms/psfieldmapping/psfieldmapping.component';
import { DatePipe } from '@angular/common';
import { PssearchDropdownComponent } from './components/controls/pssearch-dropdown/pssearch-dropdown.component';
import { PspersonEmploymentContractUpdateComponent } from './components/forms/psperson-employment-contract-update/psperson-employment-contract-update.component';
import { PssearchPopupComponent } from './components/controls/pssearch-popup/pssearch-popup.component';
import { PspersonManagerViewComponent } from './components/forms/psperson-manager-view/psperson-manager-view.component';
import { PspersonManagerSearchComponent } from './components/forms/psperson-manager-search/psperson-manager-search.component';
import { PsapprovalHistoryComponent } from './components/forms/psapproval-history/psapproval-history.component';
import { PshomePageComponent } from './components/forms/pshome-page/pshome-page.component';
import { PshomePageTasksComponent } from './components/forms/pshome-page-tasks/pshome-page-tasks.component';
import { PshomePageNotificationsComponent } from './components/forms/pshome-page-notifications/pshome-page-notifications.component';
import { PspersonEmployeeProofComponent } from './components/forms/psperson-employee-proof/psperson-employee-proof.component';
import { PsfieldLanguageTextComponent } from './components/controls/psfield-language-text/psfield-language-text.component';
import { PspersonAttachmentComponent } from './components/forms/psperson-attachment/psperson-attachment.component';
// Calling load to get configuration + translation
export function initResources(config: AppConfig, translate: TranslationConfigModule) {
    return () => config.load(translate);
}

@NgModule({
    declarations: [
        AppComponent,
        DropdownComponent,
        DatepickerComponent,
        DynamicFormComponent,
        ProfileComponent,
        PscontractOtherinformationComponent,
        PsformbuilderFieldsComponent,
        PspersonContractsComponent,
        PssearchDropdownComponent,
        ScmainComponent,
        ScuserFormComponent,
        ScconfirmBottomsheetComponent,
        ScformBuilderComponent,
        ScformApprovalComponent,
        SchomeComponent,
        ScenduserComponent,
        ModifyDatePipe,
        CustomDateFormat,
        ScloginComponent,
        ScusercreationComponent,
        ScusercreationpopupComponent,
        ScalertWindowComponent,
        ScformlistComponent,
        ScadminDashboardComponent,
        ScadminDocumentViewComponent,
        SciwaAuthenticateComponent,
        ScgridComponent,
        ScapprovalStatusComponent,
        ScapprovalPaymentEventComponent,
        ScbatchjobrunedittemplateComponent,
        ScbatchjobruntemplateComponent,
        ScbatcheditdialogComponent,
        ScbatcheditpopupdialogComponent,
        ScformHistoryComponent,
        ScdocumentHistoryComponent,
        ScapprovalAbsenceComponent,
        ScapprovalPersonComponent,
        SccustomGridComponent,
        ScdocumentApprovalComponent,
        ScdocumentPanelComponent,
        ScdocumentPageComponent,
        ScdocumentApprovalPopupComponent,
        ScpubllishedDocumentPanelComponent,
        ScpubllishedDocumentPopupComponent,
        ScuserComponent,
        ScuserGroupComponent,
        ScuserGroupPopupComponent,
        ScuserGroupCreationComponent,
        ScimportComponent,
        ScimportPopupComponent,
        ScimportProcessComponent,
        ScimportHistoryComponent,
        ScimportStatusViewComponent,
        ScmassCopyComponent,
        ScmanagerDocumentPanelComponent,
        ScmanagerDocumentPopupComponent,
        ScmanageSubstitutePopupComponent,
        ScmanageSubstituteComponent,
        ScsubstituteCreationComponent,
        ScswitchUserComponent,
        ScuserSubstituteComponent,
        ScsubstituteCreationPopupComponent,
        ScformFieldLogsPopupComponent,
        ScmanagerApprovalHistoryPopupComponent,
        ScmanagerDocumentApprovalComponent,
        ScapprovalVacationComponent,
        ScfilterComponent,
        SccustomDropdownComponent,
        ScbonusFormComponent,
        ScbonusPanelComponent,
        ScuserCostcenterComponent,
        ScmanageCostcenterComponent,
        SccostcenterCreationComponent,
        SccostcenterCreationPopupComponent,
        ScemploymentContractComponent,
        ScemploymentContractCreationComponent,
        ScemploymentContractHistoryComponent,
        ScemploymentContractFormComponent,
        ScemploymentHotelContractFormComponent,
        ScemploymentGeneralContractFormComponent,
        ScemploymentLearnEarnContractFormComponent,
        ScemploymentContractSearchComponent,
        SctabRefreshComponent,
        ScsettingsComponent,
        SccustomFilterComponent,
        ScapproversListComponent,
        ScpayrollClerkViewComponent,
        ScconfigurationComponent,
        SclicenseComponent,
        ScsettingsComponent,
        ScheaderGroupComponent,
        ScformListPanelComponent,
        ScformGroupPanelComponent,
        ScbulkUserFormComponent,
        ScbulkUserFormPanelComponent,
        ScbulkProcessPanelComponent,
        ScbulkUserPaymentFormPanelComponent,
        ScgridEditableComponent,
        ScpublishedFreesearchComponent,
        ScroleBasedRightsComponent,
        SccolumnConfigurationComponent,
        ScResizeColumnDirective,
        ScsetupComponent,
        ScsetupAppsettingComponent,
        ScgridServersideComponent,
        ScfilterConfigurationComponent,
        SchelpDocumentComponent,
        ScgeneralHelpDocumentComponent,
        ScemploymentContractSignatureComponent,
        ScdocumentApproverListComponent,
        ScdocumentMonitoringViewComponent,
        SchierarchicalGridComponent,
        SchierarchicalDropdownComponent,
        CdkDetailRowDirective,
        ScmanageContractStagesComponent,
        SearchPipe,
        ScpersonListComponent,
        ScpersonCreationPanelComponent,
        ScchiplistComponent,
        PsfilterButtonsComponent,
        PsfieldLanguageTextComponent,
        PspersonBasicDataComponent,
        PspersonEmploymentContractComponent,
        PspersonDegreeComponent,
        PspersonCompetenciesComponent,
        PspersonWorkExperiencesComponent,
        PsformGroupsComponent,
        PsmultipleDataComponent,
        PsmultipleDataChildComponent,
        PsformMultirowHandlerComponent,
        PsemployeeProfileComponent,
        PscompanyComponent,
        PspersonTerminationComponent,
        PsholidayViewComponent,
        PsholidayTabViewComponent,
        PsabsenceHistoryComponent,
        PsapprovalHistoryComponent,
        PsvacationHistoryComponent,
        PsAbsenceFormComponent,
        PsVacationFormComponent,
        PspersonListViewComponent,
        PstemplateSelectionComponent,
        PssearchPopupComponent,
        PsfieldmappingComponent,
        PshomePageComponent,
        PshomePageTasksComponent,
        PshomePageNotificationsComponent,
        PspersonManagerViewComponent,
        PspersonManagerSearchComponent,
        PspersonEmploymentContractUpdateComponent,
        PspersonEmployeeProofComponent,
        PspersonAttachmentComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule,
        TranslationConfigModule,
        HttpClientModule,
        NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
        ImageCropperModule
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
        AppComponent, ScMainService, SharedDataService,
        { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: ErrorHandler, useClass: SCErrorHandler },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        AppConfig, {
            provide: APP_INITIALIZER,
            useFactory: initResources,
            deps: [AppConfig, TranslationConfigModule],
            multi: true
        }, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
        ModifyDatePipe,
        CustomDateFormat,
        SearchPipe,
        DirtyformGuard,
        DatePipe
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ScchiplistComponent
    ]

})
export class AppModule { }

export function getBaseUrl() {
    var url = document.getElementsByTagName('base')[0].href;
    return url ? url.substr(0, url.length - 1) : url;
}
