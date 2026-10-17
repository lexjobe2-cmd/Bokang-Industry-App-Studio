"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import { cleanCareQuoteKey, type CleanCareQuote } from "../../lib/clean-care";
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
  mobile?: string;
  availableServices?: string[];
};

const serviceCatalog = [
  { icon: Home, title: "Residential cleaning", copy: "Regular or one-off cleaning for homes and apartments." },
  { icon: Building2, title: "Office cleaning", copy: "Workspaces, reception areas, meeting rooms and everyday office care." },
  { icon: Building2, title: "Commercial cleaning", copy: "Cleaning services for shops, guest accommodation and public-facing premises." },
  { icon: Sparkles, title: "Deep cleaning", copy: "Detailed attention for heavily used spaces and high-touch surfaces." },
  { icon: Home, title: "Move-in cleaning", copy: "Prepare a property before new occupants arrive." },
  { icon: Home, title: "Move-out cleaning", copy: "End-of-tenancy and property handover cleaning." },
  { icon: Warehouse, title: "Post-construction cleaning", copy: "After-build dust, finishes and handover cleanup." },
  { icon: Sparkles, title: "Carpet cleaning", copy: "Deep care for carpet and textile flooring." },
  { icon: Sparkles, title: "Upholstery cleaning", copy: "Cleaning for sofas, chairs and fabric furnishings." },
  { icon: Sparkles, title: "Window cleaning", copy: "Windows, storefronts and glazing where suitable and safely accessible." },
  { icon: Sparkles, title: "Kitchen / bathroom deep clean", copy: "Detail cleaning for wet areas and hard-working rooms." },
  { icon: Clock3, title: "Recurring cleaning", copy: "Repeat visits on an agreed service schedule." },
  { icon: Building2, title: "Contract cleaning", copy: "Structured recurring cleaning agreements for sites and organisations." },
  { icon: Sparkles, title: "Event cleanup", copy: "Cleaning before or after functions and events." },
  { icon: SprayCan, title: "Hygiene services", copy: "Hygiene, washrooms and cleaning consumables where provided." },
  { icon: ShieldCheck, title: "Industrial / specialised cleaning", copy: "Site-specific cleaning with appropriate personnel and safety controls." },
];

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
  email = "",
  phone = "",
  mobile = "",
  availableServices,
}: CleanCareClientSiteProps) {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState("Residential cleaning");
  const [, setQuoteRequests] = usePersistentState<CleanCareQuote[]>(cleanCareQuoteKey(clientName), []);
  const displayServices = availableServices?.length
    ? serviceCatalog.filter((item) => availableServices.some((name) => name.toLowerCase() === item.title.toLowerCase()))
    : services;
  const selectedService = displayServices.some((item) => item.title === service) ? service : (displayServices[0]?.title ?? "");
  const specialisedWindowCompany = availableServices?.length && availableServices.every((name) => /window|post-construction/i.test(name));
  const commercialMenu = !availableServices?.length || availableServices.some((name) => /office|commercial|contract|hygiene|industrial/i.test(name));

  const whatsAppHref = useMemo(() => {
    const digits = (mobile || phone).replace(/\D/g, "");
    const local = digits.startsWith("267") ? digits.slice(3) : digits;
    if (!/^7\d{7}$/.test(local)) return "";
    const normalized = "267" + local;
    return "https://wa.me/" + normalized + "?text=" + encodeURIComponent("Hi " + clientName + ", I would like to request a cleaning quote.");
  }, [phone, mobile, clientName]);

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
          {commercialMenu ? <a href="#commercial">Commercial</a> : null}
          <a href="#quote">Get a quote</a>
        </nav>
        {whatsAppHref ? (
          <a className="cleancare-nav-cta" href={whatsAppHref} target="_blank" rel="noreferrer" title="Public mobile number; WhatsApp availability has not been verified">Try WhatsApp</a>
        ) : (
          <a className="cleancare-nav-cta" href="#quote">Request a quote</a>
        )}
      </header>

      <section id="top" className="cleancare-hero">
        <div className="cleancare-copy">
          <span className="cleancare-kicker">{specialisedWindowCompany ? "Window and glazing cleaning" : "Homes · offices · commercial spaces"}</span>
          <h1>{specialisedWindowCompany ? "A clearer view. A brighter first impression." : "Professional cleaning. A space that feels ready again."}</h1>
          <p>
            {clientName} cleaning service proposal for {location}. Discover the listed service options,
            describe your space, and prepare a request for a tailored quotation.
          </p>
          <div className="cleancare-actions">
            <a className="cleancare-primary" href="#quote">Request a quote <ArrowRight size={17} /></a>
            <a className="cleancare-secondary" href="#services">View services</a>
            {whatsAppHref ? <a className="cleancare-secondary" href={whatsAppHref} target="_blank" rel="noreferrer" title="Public mobile number; WhatsApp availability has not been verified">Try WhatsApp</a> : null}
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
            <h2>Cleaning options built around your space.</h2>
          </div>
          <p>
            Explore the proposed cleaning categories, then tell us what your space needs.
            The service scope is confirmed before an estimate is prepared.
          </p>
        </div>
        {!availableServices?.length ? <p style={{fontSize:12,margin:"0 0 12px",color:"#64748b"}}>Illustrative services for the proposal. Confirm which services {clientName} offers before booking.</p> : null}
        <div className="cleancare-service-grid">
          {displayServices.map(({ icon: Icon, title, copy }) => (
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

      {commercialMenu ? <section id="commercial" className="cleancare-commercial">
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
      </section> : null}

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
              {phone ? <span>Phone: {phone}</span> : null}
              {mobile && mobile !== phone ? <span>Public mobile: {mobile}</span> : null}
              {whatsAppHref ? <span>WhatsApp account availability is unverified.</span> : null}
              {email ? <a href={"mailto:" + email}>{email}</a> : null}
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="cleancare-success">
            <CheckCircle2 size={30} />
            <h3>Demo quote request captured.</h3>
            <p>Saved in this browser only. No live booking, email, payment, file upload or server submission occurred.</p>
            <button type="button" onClick={() => setSubmitted(false)}>Create another demo request</button>
          </div>
        ) : (
          <form className="cleancare-form" onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const values = new FormData(form);
            const photos = form.elements.namedItem("photos") as HTMLInputElement | null;
            const request: CleanCareQuote = {
              id: "CL-" + Date.now().toString(36),
              createdAt: new Date().toISOString(),
              name: String(values.get("name") ?? "").trim(),
              phone: String(values.get("phone") ?? "").trim(),
              email: String(values.get("email") ?? "").trim(),
              location: String(values.get("location") ?? "").trim(),
              service: String(values.get("service") ?? selectedService),
              facilityType: String(values.get("facilityType") ?? ""),
              rooms: String(values.get("rooms") ?? ""),
              area: String(values.get("area") ?? ""),
              frequency: String(values.get("frequency") ?? ""),
              preferredDate: String(values.get("preferredDate") ?? ""),
              instructions: String(values.get("notes") ?? "").trim(),
              photoNames: Array.from(photos?.files ?? []).map((file) => file.name).slice(0, 5),
              status: "New enquiry",
            };
            setQuoteRequests((current) => [request, ...current].slice(0, 50));
            form.reset();
            setSubmitted(true);
          }}>
            <label>Name / company<input required name="name" autoComplete="name" placeholder="Your name or organisation" /></label>
            <label>Phone<input required name="phone" type="tel" autoComplete="tel" placeholder="+267 ..." /></label>
            <label>Email (optional)<input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
            <label>Property type<select name="facilityType" required defaultValue=""><option value="" disabled>Choose a property type</option>{["Home / apartment","Office","Retail / restaurant","Clinic","School","Guest house / hotel","Warehouse / workshop","Industrial site","Other"].map((item)=><option key={item}>{item}</option>)}</select></label>
            <label>Service<select name="service" required value={selectedService} onChange={(event)=>setService(event.target.value)}>{displayServices.map((item)=><option key={item.title} value={item.title}>{item.title}</option>)}</select></label>
            <label>Frequency<select name="frequency"><option>Once-off</option><option>Weekly</option><option>2–3 times per week</option><option>Daily contract</option><option>Custom recurring schedule</option></select></label>
            <label>Rooms / offices<input name="rooms" type="number" min="0" max="9999" placeholder="Optional" /></label>
            <label>Approx. size (m²)<input name="area" type="number" min="0" max="1000000" placeholder="Optional" /></label>
            <label>Preferred date<input name="preferredDate" type="date" /></label>
            <label>Optional site photos<input name="photos" type="file" multiple accept="image/*" aria-describedby="clean-photo-note" /></label>
            <label className="cleancare-wide">Location / site<input required name="location" placeholder="Plot, area, suburb or town" /></label>
            <label className="cleancare-wide">Special instructions<textarea rows={4} name="notes" placeholder="Access rules, floor surfaces, preferred times, equipment and priority areas." /></label>
            <p id="clean-photo-note" className="cleancare-wide" style={{fontSize:12,color:"#64748b",margin:0}}>Interactive demo only. Details stay in this browser. Photos are not uploaded or retained; only filenames are saved. The business is not notified.</p>
            <button type="submit" className="cleancare-submit" disabled={!selectedService}>Save demo quote request <ArrowRight size={17} /></button>
          </form>
        )}
      </section>

      <footer className="cleancare-footer">
        <div><span className="cleancare-mark">{initials}</span><div><strong>{clientName}</strong><p>{availableServices?.length ? displayServices.map((s)=>s.title).slice(0,3).join(" · ") : "Proposed residential · commercial · deep cleaning services"}</p></div></div>
        <small>Designed &amp; developed by Bokang Jobe · Interactive proposal website</small>
      </footer>
    </main>
  );
}
