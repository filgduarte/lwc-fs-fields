import { LightningElement, api } from 'lwc';
import { FlowAttributeChangeEvent } from 'lightning/flowSupport';

export default class Fsf_AIOTextField extends LightningElement {
    @api label;
    @api component;
    @api placeholder;
    @api value;
    @api required;
    @api disabled;
    @api readonly;
    @api type;
    @api formatter;
    @api max;
    @api min;
    @api pattern;
    @api step;
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
        return this.component === 'input';
    }

    get isLong() {
        return this.component === 'textarea';
    }

    get isRich() {
        return this.component === 'richtext';
    }

    get inputProps() {
        let props = {
            disabled: this.disabled,
            label: this.label,
            required: this.required,
            value: this.value,
            onchange: this.onchange,
        };

        switch (this.component) {
            case 'text':
                const textPropsByTypes = {
                    'text': ['maxlength', 'minlength', 'pattern', 'placeholder', 'message-when-pattern-mismatch', 'message-when-too-long', 'message-when-too-short'],
                    'number': ['formatter', 'max', 'min', 'placeholder', 'step', 'message-when-range-overflow', 'message-when-range-underflow'],
                    'date': ['max', 'min', 'placeholder'],
                    'datetime': ['max', 'min'],
                    'email': ['maxlength', 'minlength', 'patter', 'placeholder', 'message-when-patter-mismatch', 'message-when-too-long', 'message-when-too-short'],
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
                    { ...props, readonly: this.readonly }
                );

                if (this.type === 'number') {
                    if (props.hasOwnProperty(max)) props.max = parseFloat(props.max);
                    if (props.hasOwnProperty(min)) props.min = parseFloat(props.min);
                    if (props.hasOwnProperty(step)) props.step = parseFloat(props.step);
                }

                if (textPropsByTypes[this.type].includes('maxlength')) {
                    if (props.hasOwnProperty(maxlength)) props.maxlength = parseInt(props.maxlength);
                    if (props.hasOwnProperty(minlength)) props.minlength = parseInt(props.minlength);
                }
            break;

            case 'longtext':
                props = {
                    ...props,
                    readonly: this.readonly,
                    maxlength: parseInt(this.max),
                    minlength: parseInt(this.min),
                    placeholder: this.placeholder,
                    'message-when-too-short': this.minErrorMessage,
                    'message-when-too-loong': this.maxErrorMessage,
                }
            break;

            case 'richttext':
                props = {
                    ...props,
                    placeholder: this.placeholder,
                }
            break;
        }

        return props;
    }
}