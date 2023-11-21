import { LightningElement,api } from 'lwc';

export default class EditContact extends LightningElement {
    @api 
    isLoaded=false;
    closeModel=true;
    @api contactId;

    connectedCallback(){
        this.isLoaded=!false;
        setTimeout(() => {
            this.isLoaded=false;
        }, 500);
    }

    handleclose(){
        this.closeModel=false;
        const selectedEvent = new CustomEvent("handleclose", {
            detail: this.closeModel
          });
      
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
    }

    handleclick(){
        this.isLoaded=true;
        setTimeout(() => {
            this.isLoaded=false;
            console.log("Update Sucess");
          }, 1000);
          setTimeout(() => {
            this.closeModel=false;
            const selectedEvent = new CustomEvent("handleclick", {
                detail: this.closeModel
              });
              this.dispatchEvent(selectedEvent);
          }, 1001);

    }

}