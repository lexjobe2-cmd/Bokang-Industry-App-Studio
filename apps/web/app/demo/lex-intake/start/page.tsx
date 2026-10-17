import { LexIntakePublicShell, legalEyebrow, legalLead, legalTitle } from "../../../../components/products/LexIntakePublicShell";
import { LexIntakeEnquiryForm } from "../../../../components/products/LexIntakeEnquiryForm";

export default async function LexStartPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Law Firm").slice(0,120);
  return <LexIntakePublicShell clientName={client} current="start">
    <section style={{maxWidth:1000,margin:"0 auto",padding:"82px 22px 46px"}}><p style={legalEyebrow}>Initial enquiry</p><h1 style={{...legalTitle,maxWidth:820}}>Tell the firm enough to route the enquiry—without sending the whole file.</h1><p style={{...legalLead,maxWidth:760}}>A good legal intake experience protects both sides: it gives the firm enough information to screen the matter while avoiding unnecessary confidential detail before engagement.</p></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 90px"}}><LexIntakeEnquiryForm clientName={client}/></section>
  </LexIntakePublicShell>;
}
