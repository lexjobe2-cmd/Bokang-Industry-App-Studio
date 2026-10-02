import { ClinicFlowPublicShell, clinicEyebrow, clinicLead, clinicTitle } from "../../../../components/products/ClinicFlowPublicShell";
import { ClinicAppointmentRequest } from "../../../../components/products/ClinicAppointmentRequest";

export default async function ClinicBookPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Clinic").slice(0,120);
  return <ClinicFlowPublicShell clientName={client} current="book">
    <section style={{maxWidth:1000,margin:"0 auto",padding:"82px 22px 46px"}}><p style={clinicEyebrow}>Appointments</p><h1 style={{...clinicTitle,maxWidth:820}}>Request the right type of visit without writing a medical history into a web form.</h1><p style={{...clinicLead,maxWidth:760}}>The first request captures only the information scheduling staff need to match the patient to an appropriate appointment. Detailed clinical intake can happen securely after confirmation.</p></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 90px"}}><ClinicAppointmentRequest clientName={client}/></section>
  </ClinicFlowPublicShell>;
}
