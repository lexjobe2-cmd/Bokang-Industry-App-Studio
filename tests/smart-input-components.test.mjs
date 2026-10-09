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
 const code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};vm.runInNewContext(code,{require:(name)=>name==="./MoveTrackWorkspaceNav"?load("../apps/web/components/products/MoveTrackWorkspaceNav.tsx"):require(name),module,exports:module.exports});return module.exports;
}
const {QuickChoice,SmartMultiSelect,SearchableAssetPicker}=load('../apps/web/components/products/SmartFormInputs.tsx');
const {RepeatableRowActions}=load('../apps/web/components/products/RepeatableRowActions.tsx');
const noop=()=>{};
const {WorkspaceSteps}=load('../apps/web/components/products/WorkspaceSteps.tsx');
test('workspace steps expose exactly one current step with native keyboard buttons',()=>{
 const html=renderToStaticMarkup(React.createElement(WorkspaceSteps,{label:'Meeting creation steps',steps:['Details','Attendance','Minutes','Actions','Review'],step:1,onChange:noop}));
 assert.equal((html.match(/aria-current="step"/g)||[]).length,1);assert.match(html,/aria-current="step"[^>]*>2\. Attendance/);assert.equal((html.match(/type="button"/g)||[]).length,5);
});
test('people picker long prompts shrink and selected names retain stable IDs',()=>{
 const {OrganizationPeopleComboBox}=load('../apps/web/components/products/OrganizationPeopleComboBox.tsx');
 const html=renderToStaticMarkup(React.createElement(OrganizationPeopleComboBox,{people:[{id:'person-1',orgId:'org-1',displayName:'A very long employee display name',department:'Operations',jobTitle:'Supervisor',location:'Jwaneng',email:'worker@demo.invalid',active:true}],orgId:'org-1',value:['person-1'],onChange:noop,label:'Apologies',multiple:true,placeholder:'Find absent colleagues by name, department or email'}));
 assert.match(html,/min-width:0/);assert.match(html,/flex:1;overflow:hidden/);assert.match(html,/text-overflow:ellipsis;white-space:nowrap/);assert.match(html,/aria-label="Remove A very long employee display name"/);
});
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

const {MoveTrackAppShellNav}=load('../apps/web/components/products/MoveTrackAppShellNav.tsx');
test('mobile dock exposes five requested destinations with Fleet active and a separate hamburger',()=>{
 const html=renderToStaticMarkup(React.createElement(MoveTrackAppShellNav,{activeView:'fleet',atHome:false,onHome:noop,onSearch:noop,onNavigate:noop,onCompany:noop,onWorkflow:noop,theme:'light',onToggleTheme:noop}));
 const dock=html.match(/<nav[^>]*aria-label="MoveTrack mobile primary navigation"[^>]*>(.*?)<\/nav>/)?.[1];
 assert.ok(dock);assert.equal((dock.match(/<button/g)||[]).length,5);
 for(const label of ['Home','Fleet','Forms','Analytics','Profile'])assert.ok(dock.includes('>'+label+'</span>'));
 assert.match(dock,/aria-current="page"/);assert.match(html,/aria-label="Open navigation menu"/);
 const profile=renderToStaticMarkup(React.createElement(MoveTrackAppShellNav,{activeView:'profile',atHome:false,onHome:noop,onSearch:noop,onNavigate:noop,onCompany:noop,onWorkflow:noop,theme:'light',onToggleTheme:noop}));
 assert.match(profile,/aria-current="page"[^>]*>[\s\S]*?<span>Profile<\/span>/);
});
