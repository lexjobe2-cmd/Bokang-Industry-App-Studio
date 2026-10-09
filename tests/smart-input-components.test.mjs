import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const require=createRequire(new URL('../apps/assurance-demo/package.json',import.meta.url));
const rootRequire=createRequire(new URL('../package.json',import.meta.url));
const ts=rootRequire('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function load(path){
 const source=readFileSync(new URL(path,import.meta.url),'utf8');
 const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText;
 const module={exports:{}};vm.runInNewContext(code,{require,module,exports:module.exports});return module.exports;
}
const {QuickChoice,SmartMultiSelect,SearchableAssetPicker}=load('../apps/web/components/products/SmartFormInputs.tsx');
const {RepeatableRowActions}=load('../apps/web/components/products/RepeatableRowActions.tsx');
const noop=()=>{};
test('inspection choices expose explicit selected FAIL and accessible N/A buttons',()=>{
 const html=renderToStaticMarkup(React.createElement(QuickChoice,{options:['PASS','FAIL','NA'],value:'FAIL',onChange:noop}));
 assert.match(html,/aria-pressed="true"[^>]*>FAIL/);assert.match(html,/>N\/A</);assert.match(html,/min-height:44px/);
});
test('large multi-select dictionaries expose search without preselecting answers',()=>{
 const html=renderToStaticMarkup(React.createElement(SmartMultiSelect,{options:Array.from({length:12},(_,i)=>'Hazard '+i),value:[],onChange:noop,label:'hazards'}));
 assert.match(html,/aria-label="Search hazards"/);assert.equal((html.match(/aria-pressed="false"/g)||[]).length,12);
});
test('row movement boundaries disable unavailable actions and preserve explicit duplication',()=>{
 const html=renderToStaticMarkup(React.createElement(RepeatableRowActions,{index:0,count:1,onMove:noop,onRemove:noop,onDuplicate:noop}));
 assert.equal((html.match(/disabled=""/g)||[]).length,2);assert.match(html,/aria-label="Duplicate entry 1"/);
});
test('asset picker searches fleet and retains selected asset identity',()=>{
 const html=renderToStaticMarkup(React.createElement(SearchableAssetPicker,{assets:[{id:'truck-1',fleetNo:'DT-001',makeModel:'Dump truck'}],value:'truck-1',onChange:noop}));
 assert.match(html,/aria-label="Search fleet assets"/);assert.match(html,/value="truck-1" selected=""/);
});
