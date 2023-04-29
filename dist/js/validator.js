"use strict";
// XML XSD Validator
console.log('Validator loading ...');
// Note that the ! at then end vows for a result which is not null
const inputXML = document.querySelector('#inputXML');
const inputXSD = document.querySelector('#inputXSD');
const btnValidate = document.querySelector('#btnValidate');
// The ? after a variable/constant is for optional chaining
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html
inputXML === null || inputXML === void 0 ? void 0 : inputXML.addEventListener('change', loadValidationFile);
inputXSD === null || inputXSD === void 0 ? void 0 : inputXSD.addEventListener('change', loadValidationFile);
btnValidate === null || btnValidate === void 0 ? void 0 : btnValidate.addEventListener('click', validate);
// Note: this as a parameter is always sent as the first parameter in a function
// Note: Event is sent with the EventListener
function loadValidationFile() {
    console.log("Load File ...");
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    // Works similar to AJaX XMLHttpRequest
    // If no files available - do nothing
    if (!this.files || this.files.length == 0) {
        return;
    }
    let file = this.files[0];
    let file_ext = file.name.split('.').pop();
    let fileReader = new FileReader();
    fileReader.onload = function () {
        if (typeof fileReader.result === "string") {
            switch (file_ext) {
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
function validate() {
    const divOutput = document.querySelector('#output');
    validator.validate();
    if (validator.isValid()) {
        divOutput.innerHTML = '<h3 class="valid">Valid</h3>';
    }
    else {
        divOutput.innerHTML = '<h3 class="invalid">In-Valid</h3>';
        divOutput.innerHTML += '<ul>';
        for (let err of validator.getErrors()) {
            err = err.replace('file_0.xml', validator.getXMLFilename().replace('xml', '<b>xml</b>'));
            err = err.replace('file_0.xsd', validator.getXSDFilename().replace('xsd', '<b>xsd</b>'));
            divOutput.innerHTML += `<li>${err}</li>`;
        }
        divOutput.innerHTML += '</ul>';
    }
}
class Validator {
    constructor(_xmllint) {
        this.valid = false;
        this.xml_content = '';
        this.xsd_content = '';
        this.xml_filename = '';
        this.xsd_filename = '';
        this.errors = [];
        if (!_xmllint) {
            throw new ReferenceError("XMLLint Object not defined!");
        }
        this.xmllint = _xmllint;
    }
    setXML(_filename, _xml) {
        this.xml_filename = _filename;
        this.xml_content = _xml;
    }
    setXSD(_filename, _xsd) {
        this.xsd_filename = _filename;
        this.xsd_content = _xsd;
    }
    validate() {
        this.reset();
        let result = window.xmllint.validateXML({ xml: this.xml_content, schema: this.xsd_content });
        if (result.errors) {
            this.errors = result.errors;
            this.valid = false;
        }
        else {
            this.errors = [];
            this.valid = true;
        }
    }
    ;
    isValid() {
        return this.valid;
    }
    getXMLFilename() {
        return this.xml_filename;
    }
    getXSDFilename() {
        return this.xsd_filename;
    }
    getErrors() {
        return this.errors;
    }
    reset() {
        this.valid = false;
        this.errors = [];
    }
}
const validator = new Validator(window.xmllint);
//# sourceMappingURL=validator.js.map