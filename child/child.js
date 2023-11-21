import { LightningElement, api } from 'lwc';

export default class Child extends LightningElement {

    @api
    firstName='Harshit';

    uppercaseItemName='default value';


    get itemName(){
        return this.uppercaseItemName;
    }

    set itemName(value){
        this.uppercaseItemName=value.toUpperCase();
    }

}