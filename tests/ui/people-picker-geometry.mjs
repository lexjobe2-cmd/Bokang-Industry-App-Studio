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
 await send("Page.enable");
 await send("Runtime.enable");
 const checks=[];
 for(const {width,height,theme} of [
  {width:320,height:700,theme:"light"},
  {width:390,height:844,theme:"light"},
  {width:390,height:844,theme:"dark"},
  {width:844,height:390,theme:"dark"},
  {width:1280,height:800,theme:"light"}
 ]){
  await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<900});
  await send("Page.navigate",{url:base+"/app/meetings"});
  await waitFor(()=>evaluate("!!document.querySelector('.movetrack-root button[aria-haspopup=\"listbox\"]')"),"meeting editor people picker");
  const mode=theme==="dark"?"Switch to dark mode":"Switch to light mode";
  await evaluate("document.querySelector('button[aria-label="+JSON.stringify(mode)+"]')?.click()");
  await waitFor(()=>evaluate("document.querySelector('.movetrack-root')?.getAttribute('data-theme')==="+JSON.stringify(theme)),"theme "+theme);
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
  "const visible=e=>e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden;",
  "const elements=[...document.querySelectorAll('main,nav,section,article,button,input,select,textarea')].filter(visible);",
  "const outside=elements.filter(e=>{const r=e.getBoundingClientRect();return r.right>vw+2||r.left< -2;}).slice(0,8).map(e=>({kind:e.tagName,label:(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,55)}));",
  "const narrow=elements.filter(e=>['INPUT','SELECT','TEXTAREA'].includes(e.tagName)&&e.getBoundingClientRect().width<90).slice(0,8).map(e=>({kind:e.tagName,label:e.getAttribute('aria-label')||e.getAttribute('placeholder')||'',width:Math.round(e.getBoundingClientRect().width)}));",
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
    const current=await evaluate("document.querySelector('.movetrack-root')?.getAttribute('data-theme')");
    if(current!==theme){
     const desired=theme==="dark"?"Switch to dark mode":"Switch to light mode";
     await evaluate("document.querySelector('button[aria-label="+JSON.stringify(desired)+"]')?.click()");
    }
    await sleep(200);
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
