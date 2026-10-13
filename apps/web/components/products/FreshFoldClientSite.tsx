"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  MapPin,
  PackageCheck,
  Shirt,
  Sparkles,
  Truck,
  WashingMachine,
} from "lucide-react";

type FreshFoldClientSiteProps = {
  clientName: string;
  location?: string;
  email?: string;
};

const services = [
  {
    icon: Sparkles,
    title: "Professional dry cleaning",
    copy: "Care for suits, formal wear, dresses and garments that need specialist attention.",
    timing: "Typical turnaround: 2–3 days",
  },
  {
    icon: WashingMachine,
    title: "Wash & fold",
    copy: "Everyday laundry washed, dried, folded and packed neatly for easy collection or delivery.",
    timing: "Household & weekly laundry",
  },
  {
    icon: Shirt,
    title: "Pressing & ironing",
    copy: "Crisp shirts, uniforms, trousers and workwear professionally pressed and ready to wear.",
    timing: "Same-day slots where available",
  },
  {
    icon: PackageCheck,
    title: "Bulky household items",
    copy: "Blankets, duvets, curtains and selected household textiles handled with care.",
    timing: "Quoted by item and size",
  },
];

const commercial = [
  "Guest houses & lodges",
  "Restaurants & hospitality",
  "Clinics & wellness businesses",
  "Schools & uniforms",
  "Salons, spas & towels",
  "Offices & staff workwear",
];

const imageSet = [
  {
    src: "https://images.unsplash.com/photo-1742535036703-2f61723e93b6?auto=format&fit=crop&w=1400&q=82",
    alt: "Laundry professional folding freshly cleaned clothes",
    href: "https://unsplash.com/photos/laundry-worker-neatly-folds-clothes-in-a-facility-OYgfYhBlAG8",
    credit: "EqualStock · Unsplash",
  },
  {
    src: "https://images.unsplash.com/photo-1765015981416-22180f61400a?auto=format&fit=crop&w=1200&q=82",
    alt: "Laundry worker pressing garments beside folded linens",
    href: "https://unsplash.com/photos/man-ironing-clothes-in-a-laundry-service-CuyYYKpncj4",
    credit: "Zoshua Colah · Unsplash",
  },
  {
    src: "https://images.unsplash.com/photo-1696546761220-6c418dfefb8d?auto=format&fit=crop&w=1200&q=82",
    alt: "Professional ironing and garment care",
    href: "https://unsplash.com/photos/a-close-up-of-a-person-ironing-a-shirt-gemRf7XA7hs",
    credit: "Anton Savinov · Unsplash",
  },
];

export function FreshFoldClientSite({
  clientName,
  location = "Gaborone, Botswana",
  email = "jobebokang@gmail.com",
}: FreshFoldClientSiteProps) {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState("Wash & fold");
  const [fulfilment, setFulfilment] = useState("Pickup & delivery");

  const initials = useMemo(
    () => clientName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "FF",
    [clientName]
  );

  return (
    <main className="freshfold-site">
      <header className="freshfold-nav">
        <a className="freshfold-brand" href="#top" aria-label={clientName + " home"}>
          <span className="freshfold-mark">{initials}</span>
          <span>
            <strong>{clientName}</strong>
            <small>Dry cleaning & laundry care</small>
          </span>
        </a>
        <nav className="freshfold-navlinks" aria-label="Public website navigation">
          <a href="#services">Services</a>
          <a href="#pickup">Pickup & delivery</a>
          <a href="#commercial">Commercial</a>
          <a href="#about">About</a>
        </nav>
        <a className="freshfold-nav-cta" href="#book">Book a service</a>
      </header>

      <section id="top" className="freshfold-hero">
        <div className="freshfold-hero-copy">
          <span className="freshfold-kicker">Professional garment care · {location}</span>
          <h1>Clean clothes. Careful hands. Less laundry in your week.</h1>
          <p>
            Dry cleaning, wash & fold, pressing and convenient pickup options for
            households and businesses. A polished digital front door for {clientName}.
          </p>
          <div className="freshfold-hero-actions">
            <a className="freshfold-primary" href="#book">
              Book a service <ArrowRight size={17} />
            </a>
            <a className="freshfold-secondary" href="#services">Explore services</a>
          </div>
          <div className="freshfold-trust-row">
            <span><CheckCircle2 size={16} /> Garment-by-garment care</span>
            <span><Clock3 size={16} /> Clear turnaround times</span>
            <span><Truck size={16} /> Pickup & delivery ready</span>
          </div>
        </div>
        <figure className="freshfold-hero-media">
          <img src={imageSet[0].src} alt={imageSet[0].alt} />
          <figcaption>
            <span>Fresh care, ready to wear.</span>
            <a href={imageSet[0].href} target="_blank" rel="noreferrer">{imageSet[0].credit}</a>
          </figcaption>
        </figure>
      </section>

      <section className="freshfold-value-strip" aria-label="Service highlights">
        <article>
          <strong>01</strong>
          <span>Schedule or drop off</span>
        </article>
        <article>
          <strong>02</strong>
          <span>Professional cleaning & pressing</span>
        </article>
        <article>
          <strong>03</strong>
          <span>Quality check & packaging</span>
        </article>
        <article>
          <strong>04</strong>
          <span>Collect or receive delivery</span>
        </article>
      </section>

      <section id="services" className="freshfold-section">
        <div className="freshfold-section-heading">
          <div>
            <span className="freshfold-kicker">Everyday care + special garments</span>
            <h2>Laundry services that fit real life.</h2>
          </div>
          <p>
            Choose the service you need without navigating a software dashboard.
            Customers see the business, the care offered and the fastest way to book.
          </p>
        </div>
        <div className="freshfold-service-grid">
          {services.map(({ icon: Icon, title, copy, timing }) => (
            <article key={title} className="freshfold-service-card">
              <span className="freshfold-service-icon"><Icon size={21} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <small>{timing}</small>
            </article>
          ))}
        </div>
      </section>

      <section id="pickup" className="freshfold-split freshfold-pickup">
        <div className="freshfold-photo-stack">
          <figure className="freshfold-photo-main">
            <img src={imageSet[1].src} alt={imageSet[1].alt} />
          </figure>
          <div className="freshfold-photo-note">
            <Truck size={20} />
            <strong>Pickup → clean → return</strong>
            <span>Built for busy households and repeat business clients.</span>
          </div>
        </div>
        <div className="freshfold-copy-block">
          <span className="freshfold-kicker">Pickup & delivery</span>
          <h2>Your laundry can move without adding another errand.</h2>
          <p>
            Customers can request collection, choose a preferred day and tell the
            cleaner exactly what needs attention. The business can then manage the
            job privately in the operations workspace.
          </p>
          <div className="freshfold-steps">
            {[
              ["Book", "Choose service, quantity and collection preference."],
              ["Collect", "Confirm address and pickup window."],
              ["Care", "Clean, press, inspect and package."],
              ["Return", "Deliver or notify the customer for collection."],
            ].map(([title, copy], index) => (
              <div key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{title}</strong><p>{copy}</p></div>
              </div>
            ))}
          </div>
          <a className="freshfold-text-link" href="#book">Schedule a pickup <ArrowRight size={16} /></a>
        </div>
      </section>

      <section id="commercial" className="freshfold-commercial">
        <div className="freshfold-commercial-copy">
          <span className="freshfold-kicker freshfold-kicker-light">Commercial laundry</span>
          <h2>Reliable recurring care for businesses.</h2>
          <p>
            Position {clientName} for hospitality, uniforms, towels, linen and scheduled
            repeat laundry without exposing any internal customer or job data publicly.
          </p>
          <div className="freshfold-commercial-tags">
            {commercial.map((item) => <span key={item}>{item}</span>)}
          </div>
          <a href="#book" className="freshfold-light-button">Request commercial service</a>
        </div>
        <figure className="freshfold-commercial-media">
          <img src={imageSet[2].src} alt={imageSet[2].alt} />
          <figcaption>
            <a href={imageSet[2].href} target="_blank" rel="noreferrer">{imageSet[2].credit}</a>
          </figcaption>
        </figure>
      </section>

      <section id="about" className="freshfold-section freshfold-care-section">
        <div className="freshfold-section-heading">
          <div>
            <span className="freshfold-kicker">Care people can understand</span>
            <h2>Built around trust, not technical jargon.</h2>
          </div>
          <p>
            A laundry website should reassure customers about how their garments are
            handled, when they will be ready and how they get them back.
          </p>
        </div>
        <div className="freshfold-care-grid">
          <article><Droplets size={24} /><h3>Fabric-aware care</h3><p>Different items can be routed to the cleaning method configured by the business.</p></article>
          <article><Shirt size={24} /><h3>Pressing & finish</h3><p>Garments are presented neatly, pressed and packaged for a ready-to-wear finish.</p></article>
          <article><CheckCircle2 size={24} /><h3>Quality check</h3><p>Orders can pass through a final inspection before collection or delivery.</p></article>
          <article><MapPin size={24} /><h3>Local convenience</h3><p>Service areas, branch details and pickup availability can be tailored for each client.</p></article>
        </div>
      </section>

      <section id="book" className="freshfold-booking">
        <div className="freshfold-booking-copy">
          <span className="freshfold-kicker">Book a service</span>
          <h2>Tell us what needs cleaning.</h2>
          <p>
            This is a proposal/demo booking flow. It shows the customer experience
            without sending real orders or processing payment.
          </p>
          <div className="freshfold-contact-card">
            <CalendarDays size={20} />
            <div>
              <strong>Need a commercial quote?</strong>
              <a href={"mailto:" + email + "?subject=" + encodeURIComponent(clientName + " laundry enquiry")}>{email}</a>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="freshfold-success">
            <span><CheckCircle2 size={28} /></span>
            <h3>Demo booking captured.</h3>
            <p>
              In a live implementation, {clientName} would receive this request inside
              the private operations workspace for confirmation and scheduling.
            </p>
            <button type="button" onClick={() => setSubmitted(false)}>Create another demo request</button>
          </div>
        ) : (
          <form
            className="freshfold-form"
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
              Mobile number
              <input required name="phone" placeholder="+267 ..." inputMode="tel" />
            </label>
            <label>
              Service
              <select value={service} onChange={(event) => setService(event.target.value)}>
                <option>Wash & fold</option>
                <option>Dry cleaning</option>
                <option>Pressing & ironing</option>
                <option>Blankets / duvets</option>
                <option>Commercial laundry</option>
              </select>
            </label>
            <label>
              How should we handle the order?
              <select value={fulfilment} onChange={(event) => setFulfilment(event.target.value)}>
                <option>Pickup & delivery</option>
                <option>I will drop off & collect</option>
                <option>Commercial recurring service</option>
              </select>
            </label>
            <label className="freshfold-form-wide">
              Area / address
              <input name="location" placeholder="e.g. Broadhurst, Gaborone" />
            </label>
            <label className="freshfold-form-wide">
              Notes
              <textarea name="notes" rows={4} placeholder="Tell us about garments, quantities, stains or preferred pickup time." />
            </label>
            <button className="freshfold-form-submit" type="submit">
              Submit demo booking <ArrowRight size={17} />
            </button>
          </form>
        )}
      </section>

      <footer className="freshfold-footer">
        <div>
          <span className="freshfold-mark">{initials}</span>
          <div>
            <strong>{clientName}</strong>
            <p>Dry cleaning · Laundry · Pressing · Pickup & delivery</p>
          </div>
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
