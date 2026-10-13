"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Droplets,
  Factory,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

type AquaFlowClientSiteProps = {
  clientName: string;
  location?: string;
  email?: string;
  phone?: string;
};

const products = [
  { size: "330ml", use: "Events & meetings", pack: "24 bottle case", accent: "Compact" },
  { size: "500ml", use: "Everyday hydration", pack: "24 bottle case", accent: "Popular" },
  { size: "1.5L", use: "Home & travel", pack: "Case supply", accent: "Family" },
  { size: "5L", use: "Household supply", pack: "Single / multi-unit", accent: "Home" },
  { size: "20L", use: "Refill & dispenser", pack: "Returnable / exchange", accent: "Office" },
];

const imageSet = [
  {
    src: "https://images.pexels.com/photos/11860559/pexels-photo-11860559.jpeg?auto=compress&dpr=1&h=1100&w=1600",
    alt: "Clear bottled water against a blue background",
    href: "https://www.pexels.com/photo/a-clear-plastic-bottle-in-blue-background-11860559/",
    credit: "Pexels · nerea arance",
  },
  {
    src: "https://images.pexels.com/photos/11860562/pexels-photo-11860562.jpeg?auto=compress&dpr=1&h=900&w=1400",
    alt: "Close-up of clear water bottles with blue caps",
    href: "https://www.pexels.com/photo/close-up-photo-of-water-bottles-11860562/",
    credit: "Pexels · nerea arance",
  },
  {
    src: "https://images.pexels.com/photos/6812505/pexels-photo-6812505.jpeg?auto=compress&dpr=1&h=900&w=1200",
    alt: "Water dispenser bottle in a modern office environment",
    href: "https://www.pexels.com/photo/plastic-bottle-of-water-6812505/",
    credit: "Pexels · Pavel Danilyuk",
  },
];

export function AquaFlowClientSite({
  clientName,
  location = "Gaborone, Botswana",
  email = "jobebokang@gmail.com",
  phone = "",
}: AquaFlowClientSiteProps) {
  const [submitted, setSubmitted] = useState(false);
  const [product, setProduct] = useState("20L");
  const [frequency, setFrequency] = useState("One-time order");

  const whatsAppHref = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    const normalized = digits.startsWith("267") ? digits : "267" + digits.replace(/^0+/, "");
    return "https://wa.me/" + normalized + "?text=" + encodeURIComponent("Hi " + clientName + ", I would like to order purified water.");
  }, [phone, clientName]);

  const initials = useMemo(
    () => clientName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AF",
    [clientName]
  );

  return (
    <main className="aquaflow-site">
      <header className="aquaflow-nav">
        <a className="aquaflow-brand" href="#top" aria-label={clientName + " home"}>
          <span className="aquaflow-mark">{initials}</span>
          <span>
            <strong>{clientName}</strong>
            <small>Purified water · delivery · refill</small>
          </span>
        </a>
        <nav className="aquaflow-navlinks" aria-label="Public website navigation">
          <a href="#water">Water</a>
          <a href="#delivery">Delivery</a>
          <a href="#business">Business</a>
          <a href="#quality">Quality</a>
        </nav>
        {whatsAppHref ? (
          <a className="aquaflow-nav-cta" href={whatsAppHref} target="_blank" rel="noreferrer">WhatsApp order</a>
        ) : (
          <a className="aquaflow-nav-cta" href="#order">Order water</a>
        )}
      </header>

      <section id="top" className="aquaflow-hero">
        <div className="aquaflow-hero-copy">
          <span className="aquaflow-kicker">Purified water · {location}</span>
          <h1>Pure water, ready when home or business needs it.</h1>
          <p>
            Bottled water, 20L refill and delivery, office supply and custom-labelled
            event water — presented through a clean customer-first website for {clientName}.
          </p>
          <div className="aquaflow-hero-actions">
            {whatsAppHref ? (
              <a className="aquaflow-primary" href={whatsAppHref} target="_blank" rel="noreferrer">
                WhatsApp to order <ArrowRight size={17} />
              </a>
            ) : (
              <a className="aquaflow-primary" href="#order">
                Order water <ArrowRight size={17} />
              </a>
            )}
            <a className="aquaflow-secondary" href="#water">See bottle sizes</a>
          </div>
          <div className="aquaflow-trust-row">
            <span><Truck size={16} /> Home & office delivery</span>
            <span><RefreshCw size={16} /> Refill / exchange ready</span>
            <span><BriefcaseBusiness size={16} /> Business & event supply</span>
          </div>
        </div>

        <div className="aquaflow-hero-media">
          <figure>
            <img src={imageSet[0]!.src} alt={imageSet[0]!.alt} />
            <figcaption>
              <span>Clear. Clean. Convenient.</span>
              <a href={imageSet[0]!.href} target="_blank" rel="noreferrer">{imageSet[0]!.credit}</a>
            </figcaption>
          </figure>
          <div className="aquaflow-hero-chip">
            <Droplets size={20} />
            <span>Popular supply</span>
            <strong>20L refill & exchange</strong>
          </div>
        </div>
      </section>

      <section className="aquaflow-flow">
        {[
          ["01", "Choose", "Select bottle size and quantity."],
          ["02", "Schedule", "Choose delivery, collection or refill."],
          ["03", "Confirm", "Business confirms availability and timing."],
          ["04", "Receive", "Water delivered or ready for collection."],
        ].map(([number, title, copy]) => (
          <article key={number}>
            <strong>{number}</strong>
            <div><span>{title}</span><small>{copy}</small></div>
          </article>
        ))}
      </section>

      <section id="water" className="aquaflow-section">
        <div className="aquaflow-section-heading">
          <div>
            <span className="aquaflow-kicker">Water for every use</span>
            <h2>From a meeting bottle to a 20L home refill.</h2>
          </div>
          <p>
            Botswana suppliers commonly sell across several sizes instead of a single
            product. This template makes those sizes easy to understand before a customer
            calls, messages or places an enquiry.
          </p>
        </div>

        <div className="aquaflow-product-grid">
          {products.map((item, index) => (
            <article key={item.size} className={index === 4 ? "aquaflow-product-featured" : ""}>
              <span>{item.accent}</span>
              <h3>{item.size}</h3>
              <p>{item.use}</p>
              <small>{item.pack}</small>
              <a href="#order" onClick={() => setProduct(item.size)}>Select <ArrowRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section id="delivery" className="aquaflow-delivery">
        <div className="aquaflow-delivery-media">
          <figure>
            <img src={imageSet[2]!.src} alt={imageSet[2]!.alt} />
            <a href={imageSet[2]!.href} target="_blank" rel="noreferrer">{imageSet[2]!.credit}</a>
          </figure>
        </div>
        <div className="aquaflow-delivery-copy">
          <span className="aquaflow-kicker">Delivery + recurring supply</span>
          <h2>Never make “we ran out of water” the office plan.</h2>
          <p>
            Let households and businesses request once-off, weekly, fortnightly or
            monthly delivery. The public site stays simple while recurring schedules are
            handled privately in the operations workspace.
          </p>
          <div className="aquaflow-feature-list">
            <div><CheckCircle2 size={17} /><span>Home and office delivery</span></div>
            <div><CheckCircle2 size={17} /><span>Weekly or monthly recurring supply</span></div>
            <div><CheckCircle2 size={17} /><span>20L container exchange tracking</span></div>
            <div><CheckCircle2 size={17} /><span>Configurable service areas</span></div>
          </div>
          <a className="aquaflow-text-link" href="#order">Schedule delivery <ArrowRight size={16} /></a>
        </div>
      </section>

      <section id="business" className="aquaflow-business">
        <div>
          <span className="aquaflow-kicker aquaflow-kicker-light">Business & events</span>
          <h2>Your brand can travel on every bottle.</h2>
          <p>
            Offer custom-labelled bottled water for offices, conferences, weddings,
            hospitality and corporate events, with the client logo, quantity and event
            date collected through a structured request.
          </p>
          <div className="aquaflow-business-tags">
            {["Corporate offices", "Conferences", "Weddings", "Hotels & lodges", "Restaurants", "Sports events"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <a href="#order" className="aquaflow-light-button">Request branded water</a>
        </div>
        <figure>
          <img src={imageSet[1]!.src} alt={imageSet[1]!.alt} />
          <figcaption>
            <span>Custom-labelled supply ready</span>
            <a href={imageSet[1]!.href} target="_blank" rel="noreferrer">{imageSet[1]!.credit}</a>
          </figcaption>
        </figure>
      </section>

      <section id="quality" className="aquaflow-section aquaflow-quality">
        <div className="aquaflow-section-heading">
          <div>
            <span className="aquaflow-kicker">Purification & trust</span>
            <h2>Explain the process without inventing claims.</h2>
          </div>
          <p>
            The client config determines the actual purification method, certifications
            and laboratory evidence. This demo intentionally avoids claiming standards
            or test results that have not been supplied by the business.
          </p>
        </div>
        <div className="aquaflow-quality-grid">
          <article><Factory size={24} /><h3>Source & treatment</h3><p>Describe the real source and treatment process supplied by the client.</p></article>
          <article><Droplets size={24} /><h3>Purification</h3><p>Show filtration, RO, UV, ozone or other steps only when actually used.</p></article>
          <article><ShieldCheck size={24} /><h3>Quality evidence</h3><p>Publish certificates or laboratory reports only when the client provides them.</p></article>
          <article><PackageCheck size={24} /><h3>Sealing & handling</h3><p>Explain bottling, sealing, storage and delivery handling in simple terms.</p></article>
        </div>
      </section>

      <section id="order" className="aquaflow-order">
        <div className="aquaflow-order-copy">
          <span className="aquaflow-kicker">Order / delivery request</span>
          <h2>What water do you need?</h2>
          <p>
            This is a proposal/demo order flow. It captures the customer experience but
            does not process payment or create a real delivery.
          </p>
          <div className="aquaflow-contact">
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
          <div className="aquaflow-success">
            <CheckCircle2 size={30} />
            <h3>Demo order request captured.</h3>
            <p>
              In a production setup, {clientName} would receive the request in the
              private order and delivery workspace for confirmation.
            </p>
            <button type="button" onClick={() => setSubmitted(false)}>Create another demo order</button>
          </div>
        ) : (
          <form
            className="aquaflow-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label>
              Name / company
              <input required name="name" placeholder="Customer or company name" />
            </label>
            <label>
              Mobile
              <input required name="phone" inputMode="tel" placeholder="+267 ..." />
            </label>
            <label>
              Product
              <select value={product} onChange={(event) => setProduct(event.target.value)}>
                {products.map((item) => <option key={item.size}>{item.size}</option>)}
                <option>Custom-branded bottled water</option>
              </select>
            </label>
            <label>
              Frequency
              <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
                <option>One-time order</option>
                <option>Weekly</option>
                <option>Every 2 weeks</option>
                <option>Monthly</option>
                <option>Event / corporate order</option>
              </select>
            </label>
            <label>
              Quantity
              <input required name="quantity" placeholder="e.g. 6 × 20L or 10 cases" />
            </label>
            <label>
              Delivery / collection
              <select name="fulfilment">
                <option>Delivery</option>
                <option>Collection</option>
                <option>Refill / exchange</option>
              </select>
            </label>
            <label className="aquaflow-form-wide">
              Delivery area / notes
              <textarea rows={4} name="notes" placeholder="Area, preferred day, event date, custom label requirements or other details." />
            </label>
            <button className="aquaflow-form-submit" type="submit">
              Submit demo order <ArrowRight size={17} />
            </button>
          </form>
        )}
      </section>

      <footer className="aquaflow-footer">
        <div className="aquaflow-footer-brand">
          <span className="aquaflow-mark">{initials}</span>
          <div><strong>{clientName}</strong><p>Purified water · refill · delivery · business supply</p></div>
        </div>
        <div>
          <span>{location}</span>
          {phone ? <span>{phone}</span> : null}
          <a href={"mailto:" + email}>{email}</a>
        </div>
        <small>Designed &amp; developed by Bokang Jobe · Interactive proposal website</small>
      </footer>
    </main>
  );
}
