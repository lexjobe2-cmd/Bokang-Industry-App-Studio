export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
export type RiskMatrix = {
  id:string; version:number; title:string;
  likelihoodLabels:readonly string[]; consequenceLabels:readonly string[];
  thresholds:{lowMax:number;mediumMax:number;highMax:number};
  approvalLevels:readonly RiskLevel[];
};
export const defaultRiskMatrix:RiskMatrix={
 id:"standard-5x5",version:1,title:"Standard 5 × 5 risk matrix",
 likelihoodLabels:["Rare","Unlikely","Possible","Likely","Almost certain"],
 consequenceLabels:["Insignificant","Minor","Moderate","Major","Catastrophic"],
 thresholds:{lowMax:4,mediumMax:9,highMax:16},
 approvalLevels:["HIGH","EXTREME"]
};
export type RiskAnswer = {likelihood:number;consequence:number;matrixId:string;matrixVersion:number};
export function scoreRisk(matrix:RiskMatrix, answer:RiskAnswer){
 if(answer.matrixId!==matrix.id||answer.matrixVersion!==matrix.version)throw new Error("Risk matrix version mismatch");
 const likelihood=answer.likelihood,consequence=answer.consequence;
 if(!Number.isInteger(likelihood)||!Number.isInteger(consequence)||
 likelihood<1||consequence<1||likelihood>matrix.likelihoodLabels.length||consequence>matrix.consequenceLabels.length)
 throw new Error("Likelihood and consequence are outside the configured matrix");
 const {lowMax,mediumMax,highMax}=matrix.thresholds;
 if(lowMax<1||mediumMax<=lowMax||highMax<=mediumMax||highMax>=matrix.likelihoodLabels.length*matrix.consequenceLabels.length)throw new Error("Invalid risk thresholds");
 const score=likelihood*consequence;
 const level:RiskLevel=score<=lowMax?"LOW":score<=mediumMax?"MEDIUM":score<=highMax?"HIGH":"EXTREME";
 return {score,level,requiresApproval:matrix.approvalLevels.includes(level)};
}
