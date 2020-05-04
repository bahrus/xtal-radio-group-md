import { XtalElement } from "xtal-element/XtalElement.js";
import { define } from "trans-render/define.js";
import { repeat } from "trans-render/repeat.js";
import { createTemplate } from "trans-render/createTemplate.js";
import { update } from 'trans-render/update.js';
import { init } from 'trans-render/init.js';
const mainTemplate = createTemplate(/* html */ `
<slot></slot>
<div class="form-radio form-radio-inline" target></div>
<style>
:host {
  display: block; }

.form-radio {
  position: relative;
  margin-top: 2.25rem;
  margin-bottom: 2.25rem;
  text-align: left; }

.form-radio-inline .form-radio-label {
  display: inline-block;
  margin-right: 1rem; }

.form-radio-legend {
  margin: 0 0 0.125rem 0;
  font-weight: 500;
  font-size: 1rem;
  color: #333; }

.form-radio-label {
  position: relative;
  cursor: pointer;
  padding-left: 1.5rem;
  text-align: left;
  color: #333;
  display: block;
  margin-bottom: 0.5rem; }

.form-radio-label:hover i {
  color: #337ab7; }

.form-radio-label span {
  display: block;
  padding-top: 4px;
  padding-left: 4px; }

.form-radio-label input {
  width: auto;
  opacity: 0.0001;
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  margin: 0;
  padding: 0; }

.form-radio-button {
  position: absolute;
  left: 0;
  cursor: pointer;
  display: block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #999; }

.form-radio-button::before,
.form-radio-button::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  margin: 0.25rem;
  width: 1rem;
  height: 1rem;
  transition: transform 0.28s ease, color 0.28s ease;
  border-radius: 50%;
  border: 0.125rem solid currentColor;
  will-change: transform, color; }

.form-radio-button::after {
  transform: scale(0);
  background-color: #337ab7;
  border-color: #337ab7; }

.form-radio-field:checked ~ .form-radio-button::after {
  transform: scale(0.5); }

.form-radio-field:checked ~ .form-radio-button::before {
  color: #337ab7; }

.form-has-error .form-radio-button {
  color: #d9534f; }

</style>
`);
const formTemplate = createTemplate(/* html */ `
<form></form>
`);
const itemTemplate = createTemplate(/* html */ `
<label class="form-radio-label">
  <input name="pronoun" class="form-radio-field" type="radio" required value="." />
  <i class="form-radio-button"></i>
  <span></span>
</label>
`);
export class XtalRadioGroupMD extends XtalElement {
    constructor() {
        super(...arguments);
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = mainTemplate;
        this.initTransform = {
            slot: [{}, { slotchange: this.handleSlotChange }],
            '[target]': [{}, { change: this.handleChange }]
        };
    }
    static get is() {
        return 'xtal-radio-group-md';
    }
    handleSlotChange(e) {
        e.target.assignedNodes({ flatten: true }).forEach((nodx) => {
            if (nodx.nodeType !== 1)
                return;
            const node = nodx;
            const datalist = node.localName === 'datalist' ? node : node.querySelector('datalist');
            if (datalist !== null) {
                const target = this.root.querySelector('[target]');
                const itemTransform = {
                    label: ({ idx }) => ({
                        input: ({ target }) => target.value = datalist.children[idx].value,
                        span: x => (datalist.children[idx].textContent || datalist.children[idx].value)
                    })
                };
                const ctx = init(formTemplate, {
                    Transform: {
                        form: ({ target, ctx }) => repeat(itemTemplate, ctx, datalist.children.length, target, itemTransform)
                    }
                }, target);
                ctx.update = update;
            }
        });
    }
    handleChange(e) {
        this.de('value', {
            value: e.target.value
        });
    }
}
define(XtalRadioGroupMD);
