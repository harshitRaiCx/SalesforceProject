import { LightningElement, api,wire} from 'lwc';
import getContacts from '@salesforce/apex/fetchContacts.getContacts';
 
export default class ShowContacts extends LightningElement {

    columns = [
        {label:"First Name", fieldName:"FirstName", type:"text"},
        {label:"Last Name", fieldName:"LastName", type:"text"},
        {label:"Email", fieldName:"Email", type:"email"},
    ];
    
    @api recordId;
    @api contacts;
    @api error;

    @wire(getContacts,{accId:'$recordId'})
    wiredContact({data,error}){
        if(data){
            this.contacts=data;
            console.log(this.contacts);
            console.log('Sucess');
        }
        else{
            this.contacts=undefined;
            this.error=error;
            console.log('Error' + this.error);
        }
    }
}