import { LightningElement,api,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContacts from '@salesforce/apex/MyContactListController.getContacts';
import updateAccount from '@salesforce/apex/MyContactListController.updateAccount';
import deleteContact from '@salesforce/apex/MyContactListController.deleteContact';
import sendEmail from '@salesforce/apex/MyContactListController.sendEmail';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import INDUSTRY_FIELD from "@salesforce/schema/Account.Industry";
import { publish,createMessageContext, MessageContext } from 'lightning/messageService';
import uploadFile from "@salesforce/messageChannel/uploadFile__c";
import { RefreshEvent } from 'lightning/refresh';

export default class FirstLwc extends LightningElement {

    columns =  [
        { label: 'Id', fieldName: 'Id' },
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName'},
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Phone', fieldName: 'Phone', type: 'text' },
        { label: 'Edit', fieldName: 'Email', type: "button", typeAttributes: {  
            label: 'Edit',  
            name: 'Edit',  
            title: 'Edit',  
            disabled: false,  
            value: 'Edit',  
            iconPosition: 'center',
            variant:'Brand'
            } 
        }, 
        { label: 'Delete', fieldName: 'Email', type: "button", typeAttributes: {  
            label: 'Delete',  
            name: 'Delete',  
            title: 'Delete',  
            disabled: false,  
            value: 'Delete',  
            iconPosition: 'center',
            variant:'destructive'
            } 
        }, 
        { label: 'Upload', fieldName: 'Email', type: "button", typeAttributes: {  
            label: 'Upload',  
            name: 'Upload',  
            title: 'Upload',  
            disabled: false,  
            value: 'Upload',  
            iconPosition: 'center',
            variant:'Brand' 
            } 
        }, 
    ];

    @api recordId;

    @wire(getContacts,{recordId:'$recordId'}) contacts;

    @track value;
    @track error;
    @api valueType;
    @api isLoaded = false;

    @api deleteId;
    @api title;
    @api message;
    @api task;
    @track file=false;
    @api isModalOpen=false;
    @api isfileUpload1=!false;
    @api conId;

    @api contacts1;
    connectedCallback() {
        this.isLoaded=true;
        setTimeout(() => {
            this.isLoaded=false;
          }, 2000);
    }

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: INDUSTRY_FIELD })
    wiredpicklistvalues({error,data}){
        if(data){
            this.value=data.values,
            this.error= undefined      
        }
        else{
            this.error=error,
            this.value=undefined
        }
    }
    handleChange(event) {
        this.valueType = event.detail.value;
    }

    showNotification() {
        const evt = new ShowToastEvent({
          title: this.title,
          message: this.message,
          variant: this.task,
        });
        this.dispatchEvent(evt);
      }

    handleClick(){
        updateAccount({ accId:this.recordId,picklistVal:this.valueType})
        .then(result => {
            this.isLoaded=true;
            // console.log("Sucess");
            setTimeout(() => {
                this.isLoaded=false;
                this.title="Industry Updated Sucessfully";
                this.message="Industry has been updated to "+this.valueType;
                this.task="success";
                this.showNotification();
              }, 2500);
              setTimeout(() => {
                location.reload();
              }, 3500);
        })
        .catch(error => {
            this.isLoaded=false;
            // console.log("Error - "+ error);
        });
    }

    
    @track isChildOpen=false;
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.conId=row.Id;
        if(actionName=='Edit'){
            // console.log('Inside Edit');
            this.isChildOpen=true;
            // console.log(this.isChildOpen);
            // console.log(this.contacts.data);
        }
        else if(actionName=='Delete'){
            this.isModalOpen=true;
            this.deleteId=row.Id;
            console.log(this.deleteId);
        }
        else if(actionName=='Upload'){
            this.fileUploadMessage();
        }
    }

    changeIsChildOpen(event){
        this.isChildOpen=event.detail;
    }

    updateIsChildOpen(event){
        this.isChildOpen=event.detail;
        this.title="Contact Updated Sucessfully";
        this.message="Contact has been updated sucessfully";
        this.task="success";
        this.showNotification();
    }

    closeModal(){
        this.isModalOpen=false;
    }

    submitDetails(){
        deleteContact({recId:this.deleteId})
        .then(result => {
            this.isModalOpen=false;
            console.log('Inside ThenResult');
            this.isLoaded=true;
            setTimeout(() => {
                this.isLoaded=false;
                this.title="Contact Deleted Sucessfully";
                this.message="Contact("+ this.deleteId +") has been deleted.";
                this.task="success";
                this.showNotification();
                this.dispatchEvent(new RefreshEvent());
                this.contacts.data = this.contacts.data.filter(record => record.Id !== this.deleteId);
                console.log("Deleted Sucess");
              }, 2000);

        })
        .catch(error => {
            this.isModalOpen=false;
            this.isLoaded=false;
            this.title="Deleted Contact";
            this.message="Contact can't be deleted. "+error;
            this.task="error";
            this.isDeleted=false;
            this.showNotification();
            // console.log("Inside Error - "+ error);
        });
    }

    SendEmailToContact(){
        try {
            var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
            if(selectedRecords.length > 0){
                console.log('selectedRecords are ', selectedRecords);
                sendEmail({ conList:selectedRecords})
                .then(result => {
                    this.isLoaded=true;
                    console.log("Sucess");
                    setTimeout(() => {
                        this.isLoaded=false;
                        this.title="Email Sent Sucessfully";
                        this.message="Email has been sent sucessfully to "+ selectedRecords.length +" Contacts.";
                        this.task="success";
                        this.showNotification();
                      }, 2500);
                })
                .catch(error => {
                    console.log("Error - "+ error);
                });
            }  
        } catch (error) {
            console.log(error);
        }
 
    }

    context = createMessageContext();
    fileUploadMessage(){
        this.isfileUpload1=!this.isfileUpload1;
        this.publishMC();
    }

    publishMC() {
        const payLoad = {
            isfileUpload:this.isfileUpload1,
            conId:this.conId
        };
        publish(this.context, uploadFile, payLoad);
    }

}