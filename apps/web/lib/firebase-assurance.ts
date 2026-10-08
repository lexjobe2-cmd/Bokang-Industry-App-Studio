"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider, getAuth, getRedirectResult, onAuthStateChanged,
  signInWithPopup, signInWithRedirect, signOut, type Auth, type User
} from "firebase/auth";
import { useEffect, useState } from "react";

const config = {
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
export const firebaseConfigured = Object.values(config).every(value=>typeof value==="string"&&!!value.trim());
export function configuredFirebaseAuth():Auth|null {
 if (!firebaseConfigured || typeof window==="undefined") return null;
 const app=getApps().some(a=>a.name==="movetrack-assurance")?getApp("movetrack-assurance"):initializeApp(config,"movetrack-assurance");
 return getAuth(app);
}
export function useAssuranceIdentity() {
 const [user,setUser]=useState<User|null>(null);
 const [ready,setReady]=useState(false);
 const [error,setError]=useState("");
 useEffect(()=>{
   const auth=configuredFirebaseAuth();
   if(!auth){setReady(true);return;}
   const unsubscribe=onAuthStateChanged(auth, identity=>{setUser(identity);setReady(true);},e=>{setError(e.message);setReady(true);});
   void getRedirectResult(auth).catch((e:unknown)=>setError(e instanceof Error?e.message:"Unable to complete Firebase sign in."));
   return unsubscribe;
 },[]);
 async function login() {
   setError("");
   const auth=configuredFirebaseAuth();
   if(!auth){setError("Firebase environment settings are missing.");return;}
   const provider=new GoogleAuthProvider();
   // Google sign-in authenticates identity only. Drive permissions are requested separately.
   try {
     if(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) await signInWithRedirect(auth,provider);
     else await signInWithPopup(auth,provider);
   }catch(e){setError(e instanceof Error?e.message:"Sign-in failed");}
 }
 async function logout() {
   const auth=configuredFirebaseAuth();
   if(auth){await signOut(auth);setUser(null);}
 }
 return {user,ready,configured:firebaseConfigured,error,login,logout};
}
