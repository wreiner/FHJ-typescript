// XML XSD Validator
console.log('Validator loading ...');

// Note that the ! at then end vows for a result which is not null
const inputXML: HTMLInputElement = document.querySelector('#inputXML')! as HTMLInputElement;
const inputXSD:HTMLInputElement = document.querySelector('#inputXSD')! as HTMLInputElement;
const btnValidate:HTMLButtonElement = document.querySelector('#btnValidate')! as HTMLButtonElement;

// The ? after a variable/constant is for optional chaining
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
inputXML?.addEventListener('change', loadValidationFile);
inputXSD?.addEventListener('change', loadValidationFile);
btnValidate?.addEventListener('click', validate);

// Note: this as a parameter is always sent as the first parameter in a function
// Note: Event is sent with the EventListener
function loadValidationFile(this: HTMLInputElement):void {
    console.log("Load File ...");
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    // Works similar to AJaX XMLHttpRequest
    // If no files available - do nothing
    if(!this.files || this.files.length==0){
        return;
    }
    let file:File = this.files![0];
    let file_ext = file.name.split('.').pop();
    let fileReader:FileReader = new FileReader();
    fileReader.onload = function ():void {
        if (typeof fileReader.result === "string") {
            switch(file_ext){
                case 'xml':
                    validator.setXML(file.name, fileReader.result);
                    break;
                case 'xsd':
                    validator.setXSD(file.name, fileReader.result);
                    break;
                default:
            }
        }
    };
    fileReader.readAsText(file);
}

function validate(){
    const divOutput: HTMLElement = document.querySelector('#output')! as HTMLElement;
    validator.validate();
    if(validator.isValid()){
        divOutput.innerHTML = '<h3 class="valid">Valid</h3>';
    }else{
        divOutput.innerHTML = '<h3 class="invalid">In-Valid</h3>';
        divOutput.innerHTML += '<ul>';
        for(let err of validator.getErrors()){
            err = err.replace('file_0.xml',validator.getXMLFilename().replace('xml','<b>xml</b>'));
            err = err.replace('file_0.xsd',validator.getXSDFilename().replace('xsd','<b>xsd</b>'));
            divOutput.innerHTML += `<li>${err}</li>`;
        }
        divOutput.innerHTML += '</ul>';
    }

}

// Use library: https://github.com/kripken/xml.js/
interface Window { xmllint: XMLLint; }
interface XMLLint { validateXML( opts: ValidationOpts ):ValidationResult }
interface ValidationOpts { xml:string, schema:string }
interface ValidationResult { errors:string[] }

class Validator {
    private xmllint:XMLLint;
    private valid:boolean = false;
    private xml_content:string = '';
    private xsd_content:string = '';
    private xml_filename:string = '';
    private xsd_filename:string = '';
    private errors:string[] = [];

    constructor(_xmllint:XMLLint) {
        if(!_xmllint){
            throw new ReferenceError("XMLLint Object not defined!");
        }
        this.xmllint = _xmllint;
    }

    setXML(_filename:string, _xml:string){
        this.xml_filename=_filename;
        this.xml_content=_xml;
    }

    setXSD(_filename:string, _xsd:string){
        this.xsd_filename=_filename;
        this.xsd_content=_xsd;
    }
    validate():void {
        this.reset();
        let result:ValidationResult = window.xmllint.validateXML({xml: this.xml_content, schema: this.xsd_content});
        if(result.errors){
            this.errors = result.errors;
            this.valid = false;
        }else{
            this.errors = [];
            this.valid = true;
        }
    };

    isValid():boolean{
        return this.valid;
    }

    getXMLFilename(){
        return this.xml_filename;
    }

    getXSDFilename(){
        return this.xsd_filename;
    }

    getErrors():string[]{
        return this.errors;
    }

    reset():void{
        this.valid = false;
        this.errors = [];
    }
}

const validator = new Validator(window.xmllint);

