import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class Fsf_AIOTextField extends LightningElement {
    @api label;
    @api component = 'input';
    @api placeholder;
    @api value;
    @api helpText;
    @api required;
    @api disabled;
    @api readonly;
    @api type = 'text';
    @api formatter;
    @api max;
    @api min;
    @api pattern;
    @api step;
    @api disabledCategories;
    @api emptyErrorMessage;
    @api maxErrorMessage;
    @api minErrorMessage;
    @api mismatchErrorMessage;

    handleChange(event) {
        this.value = event.detail.value;
        this.dispatchEvent(new FlowAttributeChangeEvent('value', this.value));
    }

    @api
    validate() {
        if (this.required && !this.value) {
            return {
                isValid: false,
                errorMessage: this.emptyErrorMessage
            }
        }
        else {
            return {
                isValid: true,
                errorMessage: ''
            }
        }
    }

    get isInput() {
        console.log(this.component);
        return this.component === 'input';
    }

    get isTextArea() {
        return this.component === 'textarea';
    }

    get isRichText() {
        return this.component === 'richtext';
    }

    get inputProps() {
        let props = {
            disabled: this.disabled ?? false,
            label: this.label ?? '',
            required: this.required ?? false,
            value: this.value ?? '',
            fieldLevelHelp: this.helpText,
            onchange: this.handleChange.bind(this),
        };
        console.log(this.type);
        switch (this.component) {
            default:
            case 'input':
                const textPropsByTypes = {
                    'text': ['maxlength', 'minlength', 'pattern', 'placeholder', 'message-when-pattern-mismatch', 'message-when-too-long', 'message-when-too-short'],
                    'number': ['formatter', 'max', 'min', 'placeholder', 'step', 'message-when-range-overflow', 'message-when-range-underflow'],
                    'date': ['max', 'min', 'placeholder'],
                    'datetime': ['max', 'min'],
                    'email': ['maxlength', 'minlength', 'pattern', 'placeholder', 'message-when-pattern-mismatch', 'message-when-too-long', 'message-when-too-short'],
                    'password': ['placeholder', 'maxlength', 'minlength', 'pattern', 'message-when-pattern-mismatch', 'message-when-too-long', 'message-when-too-short'],
                    'time': ['max', 'min'],
                    'url': ['maxlength', 'minlength', 'pattern', 'placeholder', 'message-when-pattern-mismatch', 'message-when-too-long', 'message-when-too-short'],
                }

                const textPropsVarNames = {
                    'maxlength': 'max',
                    'minlength': 'min',
                    'message-when-patter-mismatch': 'mismatchErrorMessage',
                    'message-when-range-overflow': 'maxErrorMessage',
                    'message-when-range-underflow': 'minErrorMessage',
                    'message-when-too-long': 'maxErrorMessage',
                    'message-when-too-short': 'minErrorMessage',
                }

                props = textPropsByTypes[this.type].reduce(
                    (acc, propName) => {
                        acc[propName] = textPropsVarNames.hasOwnProperty(propName) ? this[textPropsVarNames[propName]] : this[propName];
                        return acc;
                    },
                    { ...props, type: this.type, readonly: this.readonly }
                );

                if (this.type === 'number') {
                    if (props.hasOwnProperty('max')) props.max = parseFloat(props.max);
                    if (props.hasOwnProperty('min')) props.min = parseFloat(props.min);
                    if (props.hasOwnProperty('step')) props.step = parseFloat(props.step);
                }

                if (textPropsByTypes[this.type].includes('maxlength')) {
                    if (props.hasOwnProperty('maxlength')) props.maxlength = parseInt(props.maxlength);
                    if (props.hasOwnProperty('minlength')) props.minlength = parseInt(props.minlength);
                }
            break;

            case 'textarea':
                props = {
                    ...props,
                    readonly: this.readonly,
                    maxlength: parseInt(this.max),
                    minlength: parseInt(this.min),
                    placeholder: this.placeholder,
                    'message-when-too-short': this.minErrorMessage,
                    'message-when-too-long': this.maxErrorMessage,
                }
            break;

            case 'richtext':
                props = {
                    ...props,
                    placeholder: this.placeholder,
                    disabledCategories: this.disabledCategories ?? '',
                    labelVisible: true,
                }
            break;
        }
        console.log(JSON.stringify(props));
        return props;
    }
}