import React from "react";
import {createRoot} from "react-dom/client";
import { MoveTrackDemoLab } from "../../web/components/products/MoveTrackDemoLab";
import { MoveTrackDriverApp } from "../../web/components/products/MoveTrackDriverApp";
import "./styles.css";
const driver=window.location.pathname.startsWith("/driver/move-track");
const id=new URLSearchParams(window.location.search).get("driver")||"DRV-001";
function FrontendPreview(){
 if(driver)return <main className="driver-page"><nav className="driver-top"><a href="/">← Fleet + SHE demo</a><span>FRONTEND SIMULATION · NO SIGN-IN</span></nav><MoveTrackDriverApp driverId={id}/></main>;
 return <MoveTrackDemoLab/>;
}
const element=document.getElementById("root");
if(element)createRoot(element).render(<React.StrictMode><FrontendPreview/></React.StrictMode>);
