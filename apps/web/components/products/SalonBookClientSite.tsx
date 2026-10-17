"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import { ArrowRight, CalendarDays, Check, Clock3, MapPin, Phone, Scissors, Sparkles } from "lucide-react";
import { barberServices, hairServices, salonBookingKey, type SalonAppointment, type SalonMode } from "../../lib/salon-book";
import styles from "./SalonBookClientSite.module.css";

type Props = { clientName: string; location?: string; email?: string; phone?: string; mode?: SalonMode };
export function SalonBookClientSite({ clientName, location = "Gaborone, Botswana", email = "", phone = "", mode = "hair" }: Props) {
  const [requests, setRequests] = usePersistentState<SalonAppointment[]>(salonBookingKey(clientName), []);
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState("");
  const isBarber = mode === "barber";
  const catalog = isBarber ? barberServices : hairServices;
  const selectedService = catalog.some((item) => item.name === service) ? service : (catalog[0]?.name ?? "");
  const initials = clientName.split(/\s+/).filter(Boolean).slice(0,2).map((p)=>p[0]?.toUpperCase()).join("");
  const whatsApp = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    const local = digits.startsWith("267") ? digits.slice(3) : digits;
    if (!/^7\d{7}$/.test(local)) return "";
    return "https://wa.me/267" + local + "?text=" + encodeURIComponent("Hello " + clientName + ". I'd like to enquire about an appointment.");
  },[phone,clientName]);
  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <a href="#top" className={styles.brand}><span className={styles.brandMark}>{initials || "SB"}</span><span><strong>{clientName}</strong><small>{isBarber?"Barber & grooming studio":"Hair & styling studio"}</small></span></a>
        <nav className={styles.nav}><a href="#services">Services</a><a href="#approach">Our approach</a><a href="#book">Appointments</a></nav>
        <a className={styles.navCta} href="#book">Request an appointment <ArrowRight size={15}/></a>
      </header>
      <section id="top" className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>{isBarber?"Cuts, fades & confidence":"Style, care & confidence"} · {location}</span>
          <h1>{isBarber?"Your next fresh cut starts here.":"Your hair. Your story. Your moment."}</h1>
          <p>{isBarber?"A modern customer-first barber experience for":"A welcoming digital home for"} <strong>{clientName}</strong>. Browse an illustrative service menu and tell the team the look, date and time you would prefer.</p>
          <div className={styles.actions}><a className={styles.primary} href="#book">Request appointment <ArrowRight size={17}/></a><a className={styles.secondary} href="#services">Explore services</a></div>
          <div className={styles.heroFacts}><span><MapPin size={16}/>{location}</span><span><CalendarDays size={16}/>Request a preferred date</span></div>
        </div>
        <div className={styles.heroArt} aria-label={isBarber?"Barber studio concept illustration":"Hair salon concept illustration"} role="img">
          <div className={styles.artGlow}/><div className={styles.artArcOne}/><div className={styles.artArcTwo}/>
          <div className={styles.artBadge}><Scissors size={27}/><span>{isBarber?"Precision meets personality.":"Beautiful hair begins with care."}</span></div>
          <div className={styles.artSignature}>STYLE<br/>WITH<br/>INTENTION<span>2026 · BOTSWANA</span></div>
        </div>
      </section>
      <section id="services" className={styles.section}>
        <div className={styles.sectionHead}><span className={styles.eyebrow}>Service menu · illustrative concept</span><h2>{isBarber?"A cut for every occasion.":"Care for every hair journey."}</h2><p>These are suggested website categories, not confirmed services or published prices for {clientName}. Actual availability, timing and pricing must be agreed with the business.</p></div>
        <div className={styles.services}>
          {catalog.map((item,index)=><article className={styles.service} key={item.name}><span className={styles.serviceNumber}>0{index+1}</span><h3>{item.name}</h3><p>{item.detail}</p><small>{item.duration}</small><a href="#book" onClick={()=>setService(item.name)}>Enquire about this service <ArrowRight size={15}/></a></article>)}
        </div>
      </section>
      <section id="approach" className={styles.approach}>
        <div><span className={styles.lightEyebrow}>Your appointment journey</span><h2>Great style starts with a conversation.</h2><p>Tell the team what you need and when you would like to visit. This demo records a request locally, rather than falsely confirming a booking.</p></div>
        <div className={styles.steps}>{[["01","Choose your style","Select a service you would like to discuss."],["02","Suggest a time","Share a date and time that works for you."],["03","Await confirmation","The business would confirm availability in a live version."]].map(([n,title,detail])=><article key={n}><strong>{n}</strong><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
      </section>
      <section id="book" className={styles.booking}>
        <div className={styles.bookingIntro}><span className={styles.eyebrow}>Appointment request</span><h2>Tell us about your next visit.</h2><p>Proposed website and local demo only — no live calendar, payment, message, email or booking confirmation is sent.</p>
          <div className={styles.contact}><strong>{clientName}</strong><span><MapPin size={15}/>{location}</span>{phone?<a href={"tel:"+phone}><Phone size={15}/>{phone}</a>:null}{email?<a href={"mailto:"+email}>{email}</a>:null}{whatsApp?<a href={whatsApp} target="_blank" rel="noreferrer">Try WhatsApp on public mobile (account unverified) ↗</a>:null}</div>
        </div>
        {submitted?<div className={styles.success} role="status"><Check size={30}/><h3>Demo request saved on this device.</h3><p>This does not reserve a chair or notify {clientName}. Requests can be reviewed in the same browser’s Studio operations preview.</p><button type="button" onClick={()=>setSubmitted(false)}>Create another request</button></div>:
          <form className={styles.form} onSubmit={(event)=>{
            event.preventDefault();
            const data=new FormData(event.currentTarget);
            const booking:SalonAppointment={
              id:"SB-"+Date.now().toString(36),createdAt:new Date().toISOString(),
              clientName:String(data.get("name")||"").trim(),phone:String(data.get("phone")||"").trim(),email:String(data.get("email")||"").trim(),
              service:selectedService,stylist:String(data.get("stylist")||"").trim(),
              date:String(data.get("date")||""),time:String(data.get("time")||""),notes:String(data.get("notes")||"").trim(),status:"Requested"
            };
            setRequests((current)=>[booking,...current].slice(0,80));
            setSubmitted(true);
          }}>
            <label>Your name<input name="name" required autoComplete="name" placeholder="Name and surname"/></label>
            <label>Phone number<input name="phone" type="tel" required autoComplete="tel" placeholder="+267 ..."/></label>
            <label>Email (optional)<input name="email" type="email" autoComplete="email" placeholder="you@example.com"/></label>
            <label>Preferred service<select name="service" value={selectedService} onChange={(e)=>setService(e.target.value)}>{catalog.map((item)=><option key={item.name} value={item.name}>{item.name}</option>)}</select></label>
            <label>Preferred date<input name="date" type="date" required/></label>
            <label>Preferred time<input name="time" type="time" required/></label>
            <label className={styles.full}>Preferred stylist (optional)<input name="stylist" placeholder="Any stylist / name if known"/></label>
            <label className={styles.full}>Style details / questions<textarea name="notes" rows={4} placeholder="Describe your look, hair length, special requirements or questions"/></label>
            <p className={styles.fullNote}>Interactive demo: browser storage only, no live availability, payment or message. Do not enter sensitive information.</p>
            <button className={styles.primaryButton} type="submit">Save demo appointment request <ArrowRight size={16}/></button>
          </form>}
      </section>
      <footer className={styles.footer}><strong>{clientName}</strong><span><Sparkles size={15}/> A website concept built for hair, grooming and personal style</span><small>Designed &amp; developed by Bokang Jobe · Proposal demonstration</small></footer>
    </main>
  );
}
