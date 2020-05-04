import { XtalElement } from "xtal-element/XtalElement.js";
import { define } from "trans-render/define.js";
import {repeat} from "trans-render/repeat.js";
import { createTemplate } from "trans-render/createTemplate.js";
import {RenderContext, TransformValueOptions, TransformRules} from 'trans-render/types.d.js';
import {update} from 'trans-render/update.js';
import {init} from 'trans-render/init.js';

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

const formTemplate = createTemplate(/* html */`
<form></form>
`);

const itemTemplate = createTemplate(/* html */`
<label class="form-radio-label">
  <input name="pronoun" class="form-radio-field" type="radio" required value="." />
  <i class="form-radio-button"></i>
  <span></span>
</label>
`);

export class XtalRadioGroupMD extends XtalElement {
    static get is() {
        return 'xtal-radio-group-md';
    }

    readyToInit = true;

    readyToRender = true;

    mainTemplate = mainTemplate;

    initTransform = {
      slot: [{}, {slotchange: this.handleSlotChange}],
      '[target]': [{}, {change: this.handleChange}]
    } as TransformRules;

    handleSlotChange(e: Event){
        (e.target as HTMLSlotElement).assignedNodes({flatten: true}).forEach((nodx) =>{
          if(nodx.nodeType !== 1) return;
          const node = nodx as HTMLElement;
          const datalist = node.localName === 'datalist' ? node : node.querySelector('datalist');
          if(datalist !== null){
              const target = this.root.querySelector('[target]') as HTMLElement;
              const itemTransform = {
                label: ({idx}) => ({
                  input: ({target}) => (<any>target).value = (<any>datalist.children[idx]).value,
                  span: x => (datalist.children[idx].textContent || (<any>datalist).children[idx].value)
                })
              } as TransformValueOptions;
              const ctx = init(formTemplate, {
                Transform:{
                  form: ({target, ctx}) => repeat(itemTemplate, ctx , datalist.children.length, target, itemTransform)
                } as TransformRules
              }, target);
              ctx.update = update;
              
          }
      })
    }
    handleChange(e: Event){
      this.de('value', {
        value: (<any>e).target.value
      })
    }

    

}
define(XtalRadioGroupMD);
