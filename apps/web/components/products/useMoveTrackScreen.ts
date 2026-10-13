"use client";
import {useEffect,useState,useCallback} from "react";
import {fromMoveTrackPath,moveTrackPath,type MoveTrackScreen} from "./movetrack-routes";

/** Standalone Pages uses paths; the embedded Studio keeps its host route using a hash. */
export function useMoveTrackScreen(){
 const [screen,setScreen]=useState<MoveTrackScreen>({kind:"home"});
 useEffect(()=>{
  const read=()=>setScreen(fromMoveTrackPath(window.location.pathname.startsWith("/demo/")?window.location.hash.slice(1):window.location.pathname));
  read();window.addEventListener("popstate",read);window.addEventListener("hashchange",read);
  return ()=>{window.removeEventListener("popstate",read);window.removeEventListener("hashchange",read);};
 },[]);
 const navigate=useCallback((next:MoveTrackScreen)=>{
  const path=moveTrackPath(next);
  const url=window.location.pathname.startsWith("/demo/")?window.location.pathname+window.location.search+"#"+path:path+window.location.search;
  if(window.location.pathname+window.location.search+window.location.hash!==url)window.history.pushState({},"",url);
  setScreen(next);window.scrollTo({top:0,behavior:"auto"});
 },[]);
 return {screen,navigate};
}
