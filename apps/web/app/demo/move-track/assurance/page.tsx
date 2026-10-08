import type { Metadata } from "next";
import { MoveTrackDemoLab } from "../../../../components/products/MoveTrackDemoLab";

export const metadata: Metadata={
 title:"MoveTrack AI · Fleet & SHE Operational Assurance Demo",
 description:"Try fleet checklists, meeting registers, toolbox talks, JSA, JRA, vehicle grounding and controlled release without signing in."
};

export default function AssuranceDemoPage(){
 return <MoveTrackDemoLab/>;
}
