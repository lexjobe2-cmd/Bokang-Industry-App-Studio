"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Home,
  MapPin,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Warehouse,
} from "lucide-react";

type CleanCareClientSiteProps = {
  clientName: string;
  location?: string;
  email?: string;
  phone?: string;
};

const services = [
  { icon: Home, title: "Residential cleaning", copy: "Routine home cleaning, one-off visits and move-in / move-out care." },
  { icon: Building2, title: "Office & commercial", copy: "Scheduled cleaning for offices, shops, schools and professional spaces." },
  { icon: Sparkles, title: "Deep cleaning", copy: "Detailed cleaning for kitchens, bathrooms, tiles, upholstery and high-touch areas." },
  { icon: Warehouse, title: "Post-construction", copy: "Dust, debris and finishing cleanup before a site is handed over or occupied." },
  { icon: SprayCan, title: "Hygiene services", copy: "Washroom, sanitary and consumable support where offered by the business." },
  { icon: ShieldCheck, title: "Specialised cleaning", copy: "Configurable industrial, clinical or high-level cleaning services where qualified." },
];

export function CleanCareClientSite({
  clientName,
  location = "Gaborone, Botswana",
  email = "jobebokang@gmail.com",
  phone = "",
}: CleanCareClientSiteProps) {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState("Residential cleaning");

  const whatsAppHref = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    const normalized = digits.startsWith("267") ? digits : "267" + digits.replace(/^0+/, "");
    return "https://wa.me/" + normalized + "?text=" + encodeURIComponent("Hi " + clientName + ", I would like to request a cleaning quote.");
  }, [phone, clientName]);

  const initials = useMemo(
    () => clientName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CC",
    [clientName]
  );

  return (
    <main className="cleancare-site">
      <header className="cleancare-nav">
        <a href="#top" className="cleancare-brand">
          <span className="cleancare-mark">{initials}</span>
          <span><strong>{clientName}</strong><small>Professional cleaning services</small></span>
        </a>
        <nav className="cleancare-navlinks">
          <a href="#services">Services</a>
          <a href="#process">How it works</a>
          <a href="#commercial">Commercial</a>
          <a href="#quote">Get a quote</a>
        </nav>
        {whatsAppHref ? (
          <a className="cleancare-nav-cta" href={whatsAppHref} target="_blank" rel="noreferrer">WhatsApp quote</a>
        ) : (
          <a className="cleancare-nav-cta" href="#quote">Request a quote</a>
        )}
      </header>

      <section id="top" className="cleancare-hero">
        <div className="cleancare-copy">
          <span className="cleancare-kicker">Homes · offices · commercial spaces</span>
          <h1>A cleaner space, without the cleaning becoming your whole day.</h1>
          <p>
            Professional cleaning for homes and businesses with clear services,
            flexible scheduling and a simple quote request experience for {clientName}.
          </p>
          <div className="cleancare-actions">
            {whatsAppHref ? (
              <a className="cleancare-primary" href={whatsAppHref} target="_blank" rel="noreferrer">WhatsApp for a quote <ArrowRight size={17} /></a>
            ) : (
              <a className="cleancare-primary" href="#quote">Get a cleaning quote <ArrowRight size={17} /></a>
            )}
            <a className="cleancare-secondary" href="#services">Explore services</a>
          </div>
          <div className="cleancare-proof">
            <span><Clock3 size={16} /> Flexible scheduling</span>
            <span><CheckCircle2 size={16} /> Service checklist ready</span>
            <span><MapPin size={16} /> {location}</span>
          </div>
        </div>

        <div className="cleancare-visual">
          <div className="cleancare-room">
            <div className="cleancare-window" />
            <div className="cleancare-sofa" />
            <div className="cleancare-table" />
            <div className="cleancare-shine one">✦</div>
            <div className="cleancare-shine two">✦</div>
            <div className="cleancare-shine three">✦</div>
          </div>
          <div className="cleancare-visual-card">
            <Sparkles size={20} />
            <div><strong>Site assessment ready</strong><span>Tell us the space, frequency and cleaning need.</span></div>
          </div>
        </div>
      </section>

      <section id="services" className="cleancare-section">
        <div className="cleancare-section-heading">
          <div>
            <span className="cleancare-kicker">Cleaning solutions</span>
            <h2>Show the client exactly what gets cleaned.</h2>
          </div>
          <p>
            A cleaning website should sell the service itself — not construction.
            The service mix can be configured per company so only work they actually
            provide is shown.
          </p>
        </div>
        <div className="cleancare-service-grid">
          {services.map(({ icon: Icon, title, copy }) => (
            <article key={title}>
              <span><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#quote" onClick={() => setService(title)}>Request this service <ArrowRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="cleancare-process">
        <div>
          <span className="cleancare-kicker cleancare-kicker-light">Simple booking flow</span>
          <h2>From dirty space to scheduled clean.</h2>
          <p>Keep the customer journey obvious while job allocation and operational records remain in the private workspace.</p>
        </div>
        <div className="cleancare-steps">
          {[
            ["01", "Tell us about the space", "Home, office, shop, site or specialised facility."],
            ["02", "Get a quote", "Confirm scope, frequency and any special requirements."],
            ["03", "Schedule the team", "Choose a date and service window."],
            ["04", "Clean & close out", "Complete the work and capture customer confirmation."],
          ].map(([num,title,copy]) => (
            <article key={num}><strong>{num}</strong><div><h3>{title}</h3><p>{copy}</p></div></article>
          ))}
        </div>
      </section>

      <section id="commercial" className="cleancare-commercial">
        <div>
          <span className="cleancare-kicker">Commercial cleaning</span>
          <h2>Recurring cleaning for spaces that have to stay ready.</h2>
          <p>
            Support offices, retail, hospitality, education and other commercial
            customers with recurring schedules, site requirements and structured quote requests.
          </p>
          <div className="cleancare-tags">
            {["Offices","Retail","Guest houses","Schools","Clinics","Warehouses","Post-construction","Property handovers"].map((item)=><span key={item}>{item}</span>)}
          </div>
        </div>
        <div className="cleancare-commercial-card">
          <Building2 size={28} />
          <strong>Contract cleaning</strong>
          <p>Daily, weekly or custom schedules can be configured per client and site.</p>
          <a href="#quote">Request site assessment <ArrowRight size={15} /></a>
        </div>
      </section>

      <section id="quote" className="cleancare-quote">
        <div>
          <span className="cleancare-kicker">Get a cleaning quote</span>
          <h2>Tell us what needs attention.</h2>
          <p>This is a proposal/demo request flow and does not send a live booking or payment.</p>
          <div className="cleancare-contact">
            <MapPin size={20} />
            <div>
              <strong>{clientName}</strong>
              <span>{location}</span>
              {phone ? <span>{phone}</span> : null}
              <a href={"mailto:" + email}>{email}</a>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="cleancare-success">
            <CheckCircle2 size={30} />
            <h3>Demo quote request captured.</h3>
            <p>In production, {clientName} would receive this inside the private cleaning operations workspace.</p>
            <button type="button" onClick={() => setSubmitted(false)}>Create another demo request</button>
          </div>
        ) : (
          <form className="cleancare-form" onSubmit={(event)=>{event.preventDefault();setSubmitted(true);}}>
            <label>Name / company<input required name="name" placeholder="Your name or business" /></label>
            <label>Mobile<input required name="phone" inputMode="tel" placeholder="+267 ..." /></label>
            <label>Service<select value={service} onChange={(event)=>setService(event.target.value)}>{services.map((item)=><option key={item.title}>{item.title}</option>)}</select></label>
            <label>Frequency<select name="frequency"><option>One-time clean</option><option>Weekly</option><option>2–3 times per week</option><option>Daily contract</option><option>Custom schedule</option></select></label>
            <label className="cleancare-wide">Location / site<input name="location" placeholder="Area or site location" /></label>
            <label className="cleancare-wide">What needs cleaning?<textarea rows={4} name="notes" placeholder="Size of space, rooms, special areas, preferred date or site requirements." /></label>
            <button type="submit" className="cleancare-submit">Submit demo quote <ArrowRight size={17} /></button>
          </form>
        )}
      </section>

      <footer className="cleancare-footer">
        <div><span className="cleancare-mark">{initials}</span><div><strong>{clientName}</strong><p>Residential · commercial · deep cleaning · site services</p></div></div>
        <small>Designed &amp; developed by Bokang Jobe · Interactive proposal website</small>
      </footer>
    </main>
  );
}
