"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gem,
  Heart,
  MapPin,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

type NailMuseClientSiteProps = {
  clientName: string;
  location?: string;
  email?: string;
  phone?: string;
};

const services = [
  { name: "Gel overlay", duration: "60–90 min", price: "from P150", note: "Natural nail finish" },
  { name: "Gel-X / soft gel tips", duration: "90–120 min", price: "from P250", note: "Length + shape" },
  { name: "Builder gel", duration: "90 min", price: "from P200", note: "Strength + structure" },
  { name: "Polygel set", duration: "90–120 min", price: "from P250", note: "Sculpted look" },
  { name: "Soak-off", duration: "30–50 min", price: "from P70", note: "Safe removal" },
  { name: "Nail art", duration: "add-on", price: "from P10 / nail", note: "Custom detail" },
];

const gallery = [
  {
    src: "https://images.pexels.com/photos/6135681/pexels-photo-6135681.jpeg?auto=compress&dpr=1&h=900&w=1400",
    alt: "Professional manicure treatment in a beauty salon",
    href: "https://www.pexels.com/photo/professional-manicure-treatment-6135681/",
    credit: "Pexels · Gabriel Puyén",
  },
  {
    src: "https://images.pexels.com/photos/4677852/pexels-photo-4677852.jpeg?auto=compress&dpr=1&h=900&w=1200",
    alt: "Close-up of a professional manicure",
    href: "https://www.pexels.com/photo/professional-manicure-in-close-up-4677852/",
    credit: "Pexels · Leeloo The First",
  },
  {
    src: "https://images.pexels.com/photos/6135675/pexels-photo-6135675.jpeg?auto=compress&dpr=1&h=900&w=1200",
    alt: "Client receiving professional nail care",
    href: "https://www.pexels.com/photo/photo-of-a-person-s-hand-getting-a-manicure-6135675/",
    credit: "Pexels · Gabriel Puyén",
  },
];

export function NailMuseClientSite({
  clientName,
  location = "Gaborone, Botswana",
  email = "jobebokang@gmail.com",
  phone = "",
}: NailMuseClientSiteProps) {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState("Gel overlay");
  const [day, setDay] = useState("Saturday");

  const whatsAppHref = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    const normalized = digits.startsWith("267") ? digits : "267" + digits.replace(/^0+/, "");
    return "https://wa.me/" + normalized + "?text=" + encodeURIComponent("Hi " + clientName + ", I would like to book a nail appointment.");
  }, [phone, clientName]);

  const initials = useMemo(
    () => clientName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "NM",
    [clientName]
  );

  return (
    <main className="nailmuse-site">
      <header className="nailmuse-nav">
        <a className="nailmuse-brand" href="#top" aria-label={clientName + " home"}>
          <span className="nailmuse-mark">{initials}</span>
          <span>
            <strong>{clientName}</strong>
            <small>Nails · art · appointments</small>
          </span>
        </a>
        <nav className="nailmuse-navlinks" aria-label="Public website navigation">
          <a href="#looks">Looks</a>
          <a href="#services">Services</a>
          <a href="#book">Book</a>
          <a href="#about">About</a>
        </nav>
        {whatsAppHref ? (
          <a className="nailmuse-nav-cta" href={whatsAppHref} target="_blank" rel="noreferrer">WhatsApp booking</a>
        ) : (
          <a className="nailmuse-nav-cta" href="#book">Book your set</a>
        )}
      </header>

      <section id="top" className="nailmuse-hero">
        <div className="nailmuse-hero-copy">
          <span className="nailmuse-kicker">Nail appointments · {location}</span>
          <h1>Your next set deserves its own moment.</h1>
          <p>
            Gel overlays, tips, builder gel, polygel and custom nail art with a clean,
            visual booking experience made for how clients actually discover nail techs.
          </p>
          <div className="nailmuse-hero-actions">
            {whatsAppHref ? (
              <a className="nailmuse-primary" href={whatsAppHref} target="_blank" rel="noreferrer">
                WhatsApp to book <ArrowRight size={17} />
              </a>
            ) : (
              <a className="nailmuse-primary" href="#book">
                Book an appointment <ArrowRight size={17} />
              </a>
            )}
            <a className="nailmuse-secondary" href="#looks">See recent looks</a>
          </div>
          <div className="nailmuse-social-proof">
            <span><Star size={15} fill="currentColor" /> Visual-first portfolio</span>
            <span><CalendarDays size={15} /> Appointment-led booking</span>
            <span><MapPin size={15} /> Clear location & hours</span>
          </div>
        </div>

        <div className="nailmuse-hero-media">
          <figure className="nailmuse-hero-main">
            <img src={gallery[0]!.src} alt={gallery[0]!.alt} />
            <figcaption>
              <span>Clean prep. Precise finish.</span>
              <a href={gallery[0]!.href} target="_blank" rel="noreferrer">{gallery[0]!.credit}</a>
            </figcaption>
          </figure>
          <div className="nailmuse-hero-card">
            <span>Popular this week</span>
            <strong>Gel overlay</strong>
            <small>Demo pricing from P150</small>
          </div>
        </div>
      </section>

      <section id="looks" className="nailmuse-section">
        <div className="nailmuse-section-heading">
          <div>
            <span className="nailmuse-kicker">Looks that sell the service</span>
            <h2>Let the work speak before the booking form does.</h2>
          </div>
          <p>
            Botswana nail tech marketing is heavily visual. This template gives the
            business an owned portfolio instead of leaving every client journey inside
            social media posts.
          </p>
        </div>
        <div className="nailmuse-gallery">
          {gallery.map((image, index) => (
            <figure key={image.src} className={index === 0 ? "nailmuse-gallery-wide" : ""}>
              <img src={image.src} alt={image.alt} />
              <figcaption>
                <span>{index === 0 ? "Signature manicure" : index === 1 ? "Detail work" : "Fresh set"}</span>
                <a href={image.href} target="_blank" rel="noreferrer">{image.credit}</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="services" className="nailmuse-menu">
        <div className="nailmuse-menu-intro">
          <span className="nailmuse-kicker nailmuse-kicker-light">Service menu</span>
          <h2>Simple prices. Clear time. Easy choice.</h2>
          <p>
            Nail businesses in Botswana frequently advertise the exact set, price,
            location and booking contact together. This demo turns that pattern into a
            proper service menu.
          </p>
          <small>Sample demo pricing — each client configures their own final menu.</small>
        </div>
        <div className="nailmuse-service-list">
          {services.map((item) => (
            <article key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.note} · {item.duration}</span>
              </div>
              <strong>{item.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="nailmuse-benefits">
        {[
          [Palette, "Design-led", "Show shapes, colour, French, ombré and custom art in a visual portfolio."],
          [Clock3, "Booking clarity", "Display appointment lengths, available days and booking policies before the client arrives."],
          [ShieldCheck, "Care & hygiene", "Explain prep, removal and hygiene practices without making unsupported health claims."],
          [Heart, "Client retention", "Create a home for repeat bookings, fills, reminders and favourite styles."],
        ].map(([Icon, title, copy]) => {
          const BenefitIcon = Icon as typeof Sparkles;
          return (
            <article key={String(title)}>
              <BenefitIcon size={23} />
              <h3>{String(title)}</h3>
              <p>{String(copy)}</p>
            </article>
          );
        })}
      </section>

      <section id="about" className="nailmuse-story">
        <div className="nailmuse-story-copy">
          <span className="nailmuse-kicker">Built for social-first beauty businesses</span>
          <h2>Keep the personality. Own the customer journey.</h2>
          <p>
            Social posts are excellent for discovery. The website gives {clientName} a
            permanent place for services, pricing, location, policies, portfolio and
            appointments — all under the business name.
          </p>
          <div className="nailmuse-story-points">
            <span><CheckCircle2 size={16} /> Appointment availability</span>
            <span><CheckCircle2 size={16} /> Price menu & add-ons</span>
            <span><CheckCircle2 size={16} /> Nail art portfolio</span>
            <span><CheckCircle2 size={16} /> Repeat-client flow</span>
          </div>
        </div>
        <figure className="nailmuse-story-media">
          <img src={gallery[1]!.src} alt={gallery[1]!.alt} />
        </figure>
      </section>

      <section id="book" className="nailmuse-booking">
        <div className="nailmuse-booking-copy">
          <span className="nailmuse-kicker">Book your appointment</span>
          <h2>Pick your set. Pick your day.</h2>
          <p>
            This demo mirrors the quick appointment behaviour clients already use on
            WhatsApp and booking links, while giving the business a cleaner owned
            experience.
          </p>
          <div className="nailmuse-contact-box">
            <Gem size={21} />
            <div>
              <strong>{clientName}</strong>
              <span>{location}</span>
              {phone ? <span>{phone}</span> : null}
              {phone ? <span>{phone}</span> : null}
          <a href={"mailto:" + email}>{email}</a>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="nailmuse-success">
            <Sparkles size={30} />
            <h3>Demo appointment request captured.</h3>
            <p>
              In production, the nail tech would confirm the time, set and any nail-art
              extras from the private booking workspace.
            </p>
            <button type="button" onClick={() => setSubmitted(false)}>Book another demo slot</button>
          </div>
        ) : (
          <form
            className="nailmuse-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label>
              Name
              <input required name="name" placeholder="Your name" />
            </label>
            <label>
              Mobile
              <input required name="phone" inputMode="tel" placeholder="+267 ..." />
            </label>
            <label>
              Service
              <select value={service} onChange={(event) => setService(event.target.value)}>
                {services.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </label>
            <label>
              Preferred day
              <select value={day} onChange={(event) => setDay(event.target.value)}>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </label>
            <label className="nailmuse-form-wide">
              Inspiration / notes
              <textarea rows={4} name="notes" placeholder="Shape, length, colour, nail art, soak-off or reference style." />
            </label>
            <button className="nailmuse-form-submit" type="submit">
              Request appointment <ArrowRight size={17} />
            </button>
          </form>
        )}
      </section>

      <footer className="nailmuse-footer">
        <div className="nailmuse-footer-brand">
          <span className="nailmuse-mark">{initials}</span>
          <div><strong>{clientName}</strong><p>Nails · nail art · appointments</p></div>
        </div>
        <div>
          <span>{location}</span>
          <a href={"mailto:" + email}>{email}</a>
        </div>
        <small>Designed &amp; developed by Bokang Jobe · Interactive proposal website</small>
      </footer>
    </main>
  );
}
