import test from 'node:test';
import assert from 'node:assert/strict';
import {focusedFieldPage} from '../packages/domain-data/src/workspace-layout.ts';
const fields=Array.from({length:9},(_,i)=>({id:'q'+i,answer:'Answer '+i}));
test('device mode preserves field identity and answers while changing question density',()=>{
 const mobile=focusedFieldPage(fields,'q5',false),desktop=focusedFieldPage(fields,'q5',true);
 assert.deepEqual(mobile.items,[fields[5]]);assert.deepEqual(desktop.items,fields.slice(4,8));assert.equal(desktop.index,mobile.index);assert.equal(desktop.previous,'q0');assert.equal(desktop.next,'q8');assert.equal(mobile.next,'q6');assert.equal(fields[5].answer,'Answer 5');
});
test('removed conditional anchors fall back safely and boundaries have no phantom pages',()=>{
 const first=focusedFieldPage(fields,'removed',true),last=focusedFieldPage(fields,'q8',true);
 assert.equal(first.previous,'');assert.equal(first.start,0);assert.equal(last.next,'');assert.equal(last.pages,3);assert.equal(last.items.length,1);
});
test('empty sections remain navigable without manufacturing answers',()=>{
 const empty=focusedFieldPage([],'missing',false);assert.deepEqual(empty.items,[]);assert.equal(empty.pages,1);assert.equal(empty.next,'');assert.equal(empty.previous,'');
});
