import { LightningElement, api } from 'lwc';
import { subscribe,createMessageContext } from 'lightning/messageService';
import uploadFile from "@salesforce/messageChannel/uploadFile__c";

export default class FileUpload extends LightningElement {
    @api isdisabled=!false;
    @api conId;
    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }

    subscription = null;
    context = createMessageContext();

    connectedCallback(){
        this.subscribeMC();
    }

    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.context, uploadFile, (message) => {
            this.displayMessage(message);
        });
     }
     @api status="Upload Disabled";
     displayMessage(message) {
        if(message.isfileUpload==true){
            this.status="Upload Disabled";
        }
        else{
            this.status="Upload Enabled";
        }
        this.isdisabled=message.isfileUpload;
        this.conId=message.conId;
    }

    handleUploadFinished(){
        
    }

}