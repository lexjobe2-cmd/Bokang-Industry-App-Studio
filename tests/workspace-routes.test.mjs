import test from 'node:test';
import assert from 'node:assert/strict';
import {allWorkspaceViews,fromMoveTrackPath,moveTrackPath,isMoveTrackSameScreen} from '../apps/web/components/products/movetrack-routes.ts';
test('every workspace has an independent deep link that survives a trailing slash',()=>{
 for(const view of allWorkspaceViews){const screen={kind:'workspace',view};assert.deepEqual(fromMoveTrackPath(moveTrackPath(screen)),screen);assert.deepEqual(fromMoveTrackPath(moveTrackPath(screen)+'/'),screen);}
 for(const kind of ['home','company','search','workflows'])assert.deepEqual(fromMoveTrackPath(moveTrackPath({kind})),{kind});
});
test('unknown links fall back safely and workspace equality respects different destinations',()=>{
 assert.deepEqual(fromMoveTrackPath('/app/not-a-workspace'),{kind:'home'});assert.deepEqual(fromMoveTrackPath('/app'),{kind:'workspace',view:'control'});
 assert.equal(isMoveTrackSameScreen({kind:'workspace',view:'meetings'},{kind:'workspace',view:'fleet'}),false);assert.equal(isMoveTrackSameScreen({kind:'company'},{kind:'company'}),true);
});
