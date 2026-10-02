import { LedgerDeskPublicShell, ledgerEyebrow, ledgerLead, ledgerTitle } from "../../../../components/products/LedgerDeskPublicShell";
import { LedgerStartForm } from "../../../../components/products/LedgerStartForm";

export default async function LedgerStartPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Accounting Firm").slice(0,120);

  return <LedgerDeskPublicShell clientName={client} current="start">
    <section style={{maxWidth:1000,margin:"0 auto",padding:"82px 22px 46px"}}><p style={ledgerEyebrow}>Start a conversation</p><h1 style={{...ledgerTitle,maxWidth:820}}>Describe the finance problem before uploading financial records.</h1><p style={{...ledgerLead,maxWidth:760}}>The first step should establish fit, scope and timing. Detailed ledgers, payroll files and supporting documents belong in the secure onboarding workflow after engagement acceptance.</p></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 90px"}}><LedgerStartForm clientName={client}/></section>
  </LedgerDeskPublicShell>;
}
