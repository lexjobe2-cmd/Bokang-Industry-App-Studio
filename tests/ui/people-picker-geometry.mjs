// Render the actual standalone app via Chrome DevTools; physical Safari remains a separate check.
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {mkdtemp,readFile,rm,writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitFor(fn,label,timeout=25000){
 const deadline=Date.now()+timeout;
 while(Date.now()<deadline){try{const result=await fn();if(result)return result;}catch{}await sleep(200);}
 throw Error("Timed out waiting for "+label);
}
const base=process.env.MOVETRACK_BASE_URL||"http://127.0.0.1:4173";
const userData=await mkdtemp(join(tmpdir(),"movetrack-chrome-"));
const chrome=spawn(process.env.CHROME_BIN||"google-chrome",[
 "--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu",
 "--remote-allow-origins=*","--remote-debugging-port=0","--user-data-dir="+userData,
 "--no-first-run","--no-default-browser-check","about:blank"
],{stdio:"ignore"});
let ws;
try{
 const port=await waitFor(async()=>{
  const file=(await readFile(join(userData,"DevToolsActivePort"),"utf8")).split("\n")[0];
  return Number(file)>0?Number(file):null;
 },"Chrome DevTools",15000);
 const page=await fetch("http://127.0.0.1:"+port+"/json/new?about:blank",{method:"PUT"}).then(r=>r.json());
 ws=new WebSocket(page.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{
  ws.addEventListener("open",resolve,{once:true});
  ws.addEventListener("error",reject,{once:true});
 });
 let serial=0;
 const pending=new Map();
 ws.addEventListener("message",event=>{
  const packet=JSON.parse(event.data);
  if(!packet.id)return;
  const p=pending.get(packet.id);
  if(!p)return;
  pending.delete(packet.id);
  packet.error?p.reject(Error(JSON.stringify(packet.error))):p.resolve(packet.result);
 });
 function send(method,params={}){
  return new Promise((resolve,reject)=>{
   const id=++serial;
   pending.set(id,{resolve,reject});
   ws.send(JSON.stringify({id,method,params}));
  });
 }
 async function evaluate(expression){
  const result=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw Error("Browser evaluation failed: "+JSON.stringify(result.exceptionDetails));
  return result.result?.value;
 }
 async function ensureTheme(desired){
  // Local persistence hydrates after initial render. Never accept a transient default
  // theme as proof the requested palette has been applied.
  await sleep(220);
  const actual=await evaluate("document.querySelector('.movetrack-root')?.getAttribute('data-theme')");
  if(actual!==desired){
   const label=desired==="dark"?"Switch to dark mode":"Switch to light mode";
   const clicked=await evaluate("(()=>{const b=document.querySelector('button[aria-label="+JSON.stringify(label)+"]');if(!b)return false;b.click();return true;})()");
   assert.ok(clicked,"Missing theme toggle for "+desired);
  }
  await waitFor(()=>evaluate("document.querySelector('.movetrack-root')?.getAttribute('data-theme')==="+JSON.stringify(desired)),"actual stable "+desired+" theme");
  await sleep(240);
  assert.equal(await evaluate("document.querySelector('.movetrack-root')?.getAttribute('data-theme')"),desired,"Theme changed unexpectedly during hydration");
 }
 await send("Page.enable");
 await send("Runtime.enable");
 const checks=[];
 for(const {width,height,theme} of [
  {width:320,height:700,theme:"light"},
  {width:320,height:700,theme:"dark"},
  {width:390,height:844,theme:"light"},
  {width:390,height:844,theme:"dark"},
  {width:844,height:390,theme:"dark"},
  {width:1280,height:800,theme:"light"}
 ]){
  await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<900});
  await send("Page.navigate",{url:base+"/app/meetings"});
  await waitFor(()=>evaluate("!!document.querySelector('.movetrack-root button[aria-haspopup=\"listbox\"]')"),"meeting editor people picker");
  await ensureTheme(theme);
  await evaluate("document.querySelector('.movetrack-root button[aria-haspopup=\"listbox\"]')?.click()");
  await waitFor(()=>evaluate("document.querySelectorAll('.movetrack-person-option').length>=2"),"employee rows");
  const result=await evaluate(String.raw`(()=>{
   const rows=[...document.querySelectorAll('.movetrack-person-option')];
   const visible=rows.filter(r=>r.getBoundingClientRect().height>0);
   const measures=visible.map(r=>{
    const b=r.getBoundingClientRect(), detail=r.querySelector('.movetrack-person-details');
    const contents=detail?[...detail.children]:[];
    const lastBottom=Math.max(...contents.map(c=>c.getBoundingClientRect().bottom));
    return {top:b.top,bottom:b.bottom,height:b.height,contentBottom:lastBottom};
   });
   const collisions=measures.slice(1).filter((r,i)=>measures[i].bottom>r.top+.5);
   const overflowing=measures.filter(x=>x.contentBottom>x.bottom+.5);
   const footer=document.querySelector('.movetrack-people-footer')?.getBoundingClientRect();
   const options=document.querySelector('.movetrack-people-options');
   return {rows:visible.length,collisions:collisions.length,clippedContents:overflowing.length,
    minRowHeight:Math.min(...measures.map(x=>x.height)),footerBottom:footer?.bottom,
    viewportWidth:innerWidth,viewportHeight:innerHeight,
    listScrollable:options.scrollHeight>options.clientHeight,
    horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2};
  })()`);
  assert.ok(result.rows>=2,"Employee directory not populated");
  assert.equal(result.collisions,0,JSON.stringify({width,height,theme,result}));
  assert.equal(result.clippedContents,0,JSON.stringify({width,height,theme,result}));
  assert.equal(result.horizontalOverflow,false,JSON.stringify({width,height,theme,result}));
  if(width<=844)assert.ok(result.footerBottom<=height+2,JSON.stringify({width,height,theme,result}));
  assert.ok(result.listScrollable,JSON.stringify({width,height,theme,result}));
  checks.push({width,height,theme,...result});
  console.log("Picker geometry OK",JSON.stringify(checks.at(-1)));
  // Stress dynamic text at accessible larger sizes, including an unbroken identifier.
  if(width===320&&theme==="dark"){
   const stress=await evaluate(String.raw`(()=>{
    const rows=[...document.querySelectorAll('.movetrack-person-option')];
    const detail=rows[0]?.querySelector('.movetrack-person-details');
    if(!detail)return {error:'No employee detail'};
    const nodes=[...detail.children];
    nodes[0].textContent='Very long employee display name '.repeat(10);
    nodes[1].textContent='Heavy-duty mechanical maintenance and operational compliance division '.repeat(3);
    nodes[2].textContent='unbroken.staff.directory.identifier.'+'x'.repeat(240)+'@example.invalid';
    nodes[3].textContent='Francistown North work site, Botswana '.repeat(4);
    for(const node of nodes)node.style.fontSize='20px';
    const a=rows[0].getBoundingClientRect(),b=rows[1].getBoundingClientRect();
    return {height:a.height,nextStart:b.top,firstEnd:a.bottom,
     textBottom:Math.max(...nodes.map(x=>x.getBoundingClientRect().bottom)),
     textWidth:Math.max(...nodes.map(x=>x.getBoundingClientRect().width)),
     pageWidth:document.documentElement.scrollWidth,viewport:innerWidth};
   })()`);
   assert.ok(stress.height>200,JSON.stringify(stress));
   assert.ok(stress.firstEnd<=stress.nextStart+.5,JSON.stringify(stress));
   assert.ok(stress.textBottom<=stress.firstEnd+.5,JSON.stringify(stress));
   assert.ok(stress.pageWidth<=stress.viewport+2,JSON.stringify(stress));
   console.log("LONG TEXT / LARGE TYPE PASSED",JSON.stringify(stress));
  }
  if(width===390){
   const screenshot=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
   await writeFile("ui-geometry-people-picker-"+theme+".png",Buffer.from(screenshot.data,"base64"));
  }
 }

 // Screenshot regression: measure the exact failing Agenda/Clear buttons with browser-computed
 // foreground and background, never infer contrast from authored CSS strings.
 for(const {width,height} of [{width:320,height:700},{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){
  for(const theme of ["light","dark"]){
   await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<900});
   await send("Page.navigate",{url:base+"/app/meetings"});
   await waitFor(()=>evaluate("!!document.querySelector('select[aria-label=\"Meeting mobile step\"],.movetrack-task-outline')"),"meeting navigation");
   await ensureTheme(theme);
   if(width<1024){
    await evaluate(String.raw`(()=>{
     const sel=document.querySelector('select[aria-label="Meeting mobile step"]');
     if(!sel)throw Error("No meeting step picker");
     Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(sel,'2');
     sel.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
   }else{
    await evaluate(String.raw`[...document.querySelectorAll('.movetrack-task-outline button')].find(x=>x.textContent?.includes('Minutes'))?.click()`);
   }
   await waitFor(()=>evaluate(String.raw`[...document.querySelectorAll('button')].some(x=>x.textContent?.trim()==='+ Safety moment'&&!x.closest('[hidden]'))`),"visible agenda buttons");
   const contrastCheck=await evaluate(String.raw`(()=>{
     function channel(c){c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);}
     function lum(rgb){
      const values=rgb.match(/[\d.]+/g)?.slice(0,3).map(Number)??[];
      if(values.length!==3)throw Error('Invalid rgb '+rgb);
      return channel(values[0])*.2126+channel(values[1])*.7152+channel(values[2])*.0722;
     }
     function ratio(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
     const wanted=['Clear draft','+ Safety moment','+ Previous action follow-up','+ Incident and near-miss learnings'];
     return wanted.map(label=>{
      const button=[...document.querySelectorAll('button')].find(x=>x.textContent?.trim()===label&&!x.closest('[hidden]'));
      if(!button)return {label,error:'Missing visible control'};
      const style=getComputedStyle(button);
      const bg=style.backgroundColor,fg=style.color;
      return {label,fg,bg,contrast:ratio(fg,bg),variant:button.dataset.mtVariant,classes:button.className};
     });
    })()`);
   for(const control of contrastCheck){
    assert.ok(!control.error,JSON.stringify({width,height,theme,control}));
    assert.ok(control.contrast>=4.5,JSON.stringify({width,height,theme,control}));
    assert.ok(control.classes.includes("movetrack-ui-button"),JSON.stringify({width,height,theme,control}));
   }
   console.log("MEETING BUTTON CONTRAST PASSED",JSON.stringify({width,height,theme,actualTheme:await evaluate("document.querySelector('.movetrack-root')?.getAttribute('data-theme')"),controls:contrastCheck}));
   if(width===390&&theme==="dark"){
    const screenshot=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
    await writeFile("ui-geometry-meeting-agenda-dark.png",Buffer.from(screenshot.data,"base64"));
   }
  }
 }

 // App-wide entry state audit: this is diagnostic, not certification of every open dialog.
 const routePaths=[
  "/","/company","/app/control","/app/fleet","/app/drivers","/app/sites",
  "/app/assign","/app/jobs","/search","/workflows","/app/forms",
  "/app/meetings","/app/paper","/app/release","/app/analytics",
  "/app/workforce","/app/profile","/app/local-data","/app/settings","/app/admin"
 ];
 const entryResults=[];
 const scanExpression=[
  "(()=>{",
  "const vw=document.documentElement.clientWidth;",
  "const visible=e=>e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';",
  "const elements=[...document.querySelectorAll('main,nav,section,article,button,input,select,textarea')].filter(visible);",
  "const outside=elements.filter(e=>{const r=e.getBoundingClientRect();return r.right>vw+2||r.left< -2;}).slice(0,8).map(e=>({kind:e.tagName,label:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,55)}));",
  "const narrow=elements.filter(e=>['INPUT','SELECT','TEXTAREA'].includes(e.tagName)&&!['checkbox','radio','hidden','color'].includes(e.getAttribute('type'))&&e.getBoundingClientRect().width<90).slice(0,8).map(e=>({kind:e.tagName,label:e.getAttribute('aria-label')||e.getAttribute('placeholder')||'',width:Math.round(e.getBoundingClientRect().width)}));",
  "const clipped=elements.filter(e=>e.tagName==='BUTTON'&&e.scrollWidth>e.clientWidth+3&&getComputedStyle(e).overflowX==='hidden').slice(0,8).map(e=>(e.textContent||'').trim().slice(0,55));",
  "return {viewport:vw,page:document.documentElement.scrollWidth,outside,narrow,clipped,theme:document.querySelector('.movetrack-root')?.getAttribute('data-theme')||'unknown'};",
  "})()"
 ].join("\n");
 for(const width of [320,390]){
  await send("Emulation.setDeviceMetricsOverride",{width,height:844,deviceScaleFactor:1,mobile:true});
  for(const theme of ["light","dark"]){
   for(const route of routePaths){
    await send("Page.navigate",{url:base+route});
    await waitFor(()=>evaluate("!!document.querySelector('.movetrack-root')"),"workspace "+route);
    await ensureTheme(theme);
    const metrics=await evaluate(scanExpression);
    const item={route,width,requestedTheme:theme,...metrics};
    entryResults.push(item);
    if(metrics.page>metrics.viewport+2||metrics.outside.length||metrics.clipped.length||metrics.narrow.length)
     console.log("UI AUDIT FINDING",JSON.stringify(item));
    if(width===390&&theme==="dark"&&["/","/app/admin","/app/fleet","/app/forms","/app/meetings","/app/analytics","/workflows","/search"].includes(route)){
     const shot=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
     const name="ui-geometry-"+(route==="/"?"home":route.replace(/^\//,"").replaceAll("/","-"))+".png";
     await writeFile(name,Buffer.from(shot.data,"base64"));
    }
   }
  }
 }
 await writeFile("ui-geometry-results.json",JSON.stringify(entryResults,null,2));
 const overflowing=entryResults.filter(x=>x.page>x.viewport+2||x.outside.length);
 const clipped=entryResults.filter(x=>x.clipped.length);
 const narrow=entryResults.filter(x=>x.narrow.length);
 console.log("ENTRY MATRIX:",entryResults.length,"rendered entry states;",overflowing.length,"out-of-bounds;",clipped.length,"potentially clipped buttons;",narrow.length,"narrow inputs. Detailed evidence saved to artifact.");
 console.log("PASSED",checks.length,"real Chromium people-picker geometry cases; physical Safari still unverified.");
}finally{
 if(ws)ws.close();
 chrome.kill("SIGTERM");
 await rm(userData,{recursive:true,force:true}).catch(()=>{});
}
