import { LightningElement,api, wire } from 'lwc';
import { getRecord,getFieldValue } from 'lightning/uiRecordApi';

// References to fields
// import NAME_FIELD from '@salesforce/schema/Account.Name';
// import PHONE_FIELD from '@salesforce/schema/Account.Phone';

const FIELDS=[
    'Account.Name',
    'Account.Phone',
]

export default class WireComponent extends LightningElement {

    @api recordId;
    record;
    error;
    // @wire(getRecord,{recordId:'$recordId',fields:[NAME_FIELD,PHONE_FIELD]}) record;

    // @wire(getRecord,{recordId:'$recordId',fields:['Account.Name','Account.Phone']}) record;
    // returns data and error

    @wire(getRecord,{recordId:'$recordId',fields:FIELDS})
    wiredRecord({error,data}){
        if(data){
            this.record=data;
            this.error=undefined;
        }
        else if(error){
            this.error=error;
            this.record=undefined;
        }
    }

    get name(){
        // return this.record.data ? getFieldValue(this.record.data,NAME_FIELD):'';
        // return this.record.data ? getFieldValue(this.record.data,'Account.Name'):'';
        // return this.record.data.fields.Name.value;
        return this.record.fields.Name.value;
    }

    get phone(){
        // return this.record.data ? getFieldValue(this.record.data,PHONE_FIELD):'';
        // return this.record.data ? getFieldValue(this.record.data,'Account.Phone'):'';
        // return this.record.data.fields.Phone.value;
        return this.record.fields.Phone.value;
    }
}