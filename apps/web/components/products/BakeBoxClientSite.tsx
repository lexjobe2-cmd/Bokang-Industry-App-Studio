"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
  Wheat,
} from "lucide-react";

type BakeBoxClientSiteProps = {
  clientName: string;
  location?: string;
  email?: string;
  phone?: string;
};

const bakes = [
  {
    name: "Classic scones",
    detail: "Plain, raisin or seasonal flavour",
    pack: "12 / 24 piece boxes",
    demoPrice: "from P120",
  },
  {
    name: "Cinnamon rolls",
    detail: "Soft rolls with glaze or cream-cheese finish",
    pack: "6 / 12 piece boxes",
    demoPrice: "from P120",
  },
  {
    name: "Cupcakes",
    detail: "Chocolate, vanilla, red velvet and seasonal flavours",
    pack: "6 / 12 / 24 packs",
    demoPrice: "from P100",
  },
  {
    name: "Treat boxes",
    detail: "Mixed brownies, cookies, rolls and mini bakes",
    pack: "Curated box",
    demoPrice: "request price",
  },
  {
    name: "Celebration cakes",
    detail: "Birthday, shower and small-event cakes",
    pack: "Pre-order",
    demoPrice: "request quote",
  },
];

const photos = [
  {
    src: "https://images.pexels.com/photos/3951306/pexels-photo-3951306.jpeg?auto=compress&dpr=1&h=1000&w=1500",
    alt: "Freshly baked cinnamon rolls with icing",
    href: "https://www.pexels.com/photo/cinnamon-rolls-3951306/",
    credit: "Pexels · NastyaSensei",
  },
  {
    src: "https://images.pexels.com/photos/4640864/pexels-photo-4640864.jpeg?auto=compress&dpr=1&h=900&w=1300",
    alt: "Baker preparing fresh cinnamon rolls on a tray",
    href: "https://www.pexels.com/photo/person-preparing-bread-on-tray-4640864/",
    credit: "Pexels · ArtHouse Studio",
  },
  {
    src: "https://images.pexels.com/photos/24252052/pexels-photo-24252052.jpeg?auto=compress&dpr=1&h=900&w=1300",
    alt: "Fresh pastries displayed in a bakery",
    href: "https://www.pexels.com/photo/close-up-of-pastry-lying-on-display-in-a-bakery-24252052/",
    credit: "Pexels · Natalia Sevruk",
  },
];

export function BakeBoxClientSite({
  clientName,
  location = "Gaborone, Botswana",
  email = "",
  phone = "",
}: BakeBoxClientSiteProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedBake, setSelectedBake] = useState("Classic scones");
  const [fulfilment, setFulfilment] = useState("Collection");

  const initials = useMemo(
    () => clientName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "BB",
    [clientName]
  );

  const whatsAppHref = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    const normalized = digits.startsWith("267") ? digits : "267" + digits.replace(/^0+/, "");
    return "https://wa.me/" + normalized + "?text=" +
      encodeURIComponent("Hi " + clientName + ", I would like to place a bakery order.");
  }, [phone, clientName]);

  return (
    <main className="bakebox-site">
      <header className="bakebox-nav">
        <a className="bakebox-brand" href="#top" aria-label={clientName + " home"}>
          <span className="bakebox-mark">{initials}</span>
          <span>
            <strong>{clientName}</strong>
            <small>Fresh bakes · pre-orders · pickup</small>
          </span>
        </a>

        <nav className="bakebox-navlinks" aria-label="Bakery website navigation">
          <a href="#menu">Bakes</a>
          <a href="#how">How to order</a>
          <a href="#story">Our kitchen</a>
          <a href="#order">Order</a>
        </nav>

        {whatsAppHref ? (
          <a className="bakebox-nav-cta" href={whatsAppHref} target="_blank" rel="noreferrer">WhatsApp order</a>
        ) : (
          <a className="bakebox-nav-cta" href="#order">Place an order</a>
        )}
      </header>

      <section id="top" className="bakebox-hero">
        <div className="bakebox-hero-copy">
          <span className="bakebox-kicker">Freshly baked · {location}</span>
          <h1>Warm bakes worth planning your day around.</h1>
          <p>
            Scones, cinnamon rolls, cupcakes, treat boxes and celebration bakes made for
            morning tea, office sharing, weekends and the moments that deserve something sweet.
          </p>

          <div className="bakebox-hero-actions">
            <a className="bakebox-primary" href="#menu">
              See today&apos;s bakes <ArrowRight size={17} />
            </a>
            {whatsAppHref ? (
              <a className="bakebox-secondary" href={whatsAppHref} target="_blank" rel="noreferrer">
                Order on WhatsApp
              </a>
            ) : (
              <a className="bakebox-secondary" href="#order">Start an order</a>
            )}
          </div>

          <div className="bakebox-trust-row">
            <span><Clock3 size={16} /> Pre-order friendly</span>
            <span><ShoppingBag size={16} /> Pickup ready</span>
            <span><Truck size={16} /> Delivery can be configured</span>
          </div>
        </div>

        <div className="bakebox-hero-media">
          <figure className="bakebox-hero-main">
            <img src={photos[0]!.src} alt={photos[0]!.alt} />
            <figcaption>
              <span>Fresh batch energy.</span>
              <a href={photos[0]!.href} target="_blank" rel="noreferrer">{photos[0]!.credit}</a>
            </figcaption>
          </figure>
          <div className="bakebox-drop-card">
            <Sparkles size={20} />
            <span>Weekend drop</span>
            <strong>Scones + cinnamon rolls</strong>
            <small>Demo menu — client configures final products and prices.</small>
          </div>
        </div>
      </section>

      <section className="bakebox-social-strip">
        <span>Fresh drops</span>
        <span>Box orders</span>
        <span>WhatsApp booking</span>
        <span>Collection & delivery</span>
        <span>Corporate treats</span>
      </section>

      <section id="menu" className="bakebox-section">
        <div className="bakebox-section-heading">
          <div>
            <span className="bakebox-kicker">What&apos;s baking</span>
            <h2>A simple menu people can actually order from.</h2>
          </div>
          <p>
            The strongest local bakery pages put the product, pack size, price and order
            contact together. This demo turns that social-selling pattern into an owned
            bakery website.
          </p>
        </div>

        <div className="bakebox-menu-grid">
          {bakes.map((item, index) => (
            <article key={item.name} className={index === 1 ? "bakebox-menu-featured" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
              <small>{item.pack}</small>
              <div>
                <strong>{item.demoPrice}</strong>
                <button type="button" onClick={() => {
                  setSelectedBake(item.name);
                  document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
                }}>
                  Order <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="bakebox-demo-price-note">
          Sample demo pricing only. Each bakery controls its own products, flavours, box sizes and final prices.
        </p>
      </section>

      <section id="how" className="bakebox-how">
        <div className="bakebox-how-media">
          <figure>
            <img src={photos[1]!.src} alt={photos[1]!.alt} />
            <a href={photos[1]!.href} target="_blank" rel="noreferrer">{photos[1]!.credit}</a>
          </figure>
        </div>

        <div className="bakebox-how-copy">
          <span className="bakebox-kicker">Pre-order without the DM confusion</span>
          <h2>Choose. Confirm. Bake. Collect.</h2>
          <p>
            Botswana bakers often announce flavour drops and collect orders through WhatsApp.
            The site keeps that familiar behaviour, while giving customers one clear place to see
            the menu, timing, pickup details and ordering rules.
          </p>

          <div className="bakebox-order-steps">
            {[
              ["Choose your bake", "Pick a product, pack size and preferred flavour."],
              ["Choose your date", "Tell the baker when you need the order."],
              ["Get confirmation", "The bakery confirms availability and final price."],
              ["Pickup or delivery", "Collect from the bakery or use delivery where offered."],
            ].map(([title, copy], index) => (
              <div key={title}>
                <span>{index + 1}</span>
                <div><strong>{title}</strong><p>{copy}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bakebox-occasion">
        <div>
          <span className="bakebox-kicker bakebox-kicker-light">Boxes for more than one craving</span>
          <h2>Morning meetings, birthdays, school treats and weekend boxes.</h2>
          <p>
            Let the bakery sell individual orders and larger boxes without turning the public
            website into a complicated restaurant checkout.
          </p>
          <div className="bakebox-occasion-tags">
            {["Office tea", "Birthdays", "Baby showers", "School treats", "Weekend boxes", "Corporate gifting"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a className="bakebox-light-button" href="#order">Request a larger order</a>
        </div>

        <figure>
          <img src={photos[2]!.src} alt={photos[2]!.alt} />
          <figcaption>
            <Gift size={16} />
            <span>Build a box around the occasion.</span>
          </figcaption>
        </figure>
      </section>

      <section id="story" className="bakebox-section bakebox-story">
        <div className="bakebox-section-heading">
          <div>
            <span className="bakebox-kicker">A real bakery front door</span>
            <h2>Introduce the baker before asking for the order.</h2>
          </div>
          <p>
            The homepage gives the business a proper identity, while still keeping the
            fast social-media style of photos, flavour announcements and direct ordering.
          </p>
        </div>

        <div className="bakebox-values">
          <article><Wheat size={23} /><h3>Fresh batches</h3><p>Show when products are baked and which items are available by pre-order or daily drop.</p></article>
          <article><Package size={23} /><h3>Clear box sizes</h3><p>Customers can understand the pack before sending a message or request.</p></article>
          <article><CalendarDays size={23} /><h3>Lead-time clarity</h3><p>Publish real order cutoffs and advance-notice requirements per product.</p></article>
          <article><MapPin size={23} /><h3>Pickup confidence</h3><p>Make location, collection windows and delivery rules easy to find.</p></article>
        </div>
      </section>

      <section id="order" className="bakebox-order">
        <div className="bakebox-order-copy">
          <span className="bakebox-kicker">Place a bakery request</span>
          <h2>What should we bake for you?</h2>
          <p>
            This is a proposal/demo order form. It captures the intended customer journey
            without processing live payments or sending a real bakery order.
          </p>

          <div className="bakebox-contact-card">
            <ShoppingBag size={20} />
            <div>
              <strong>{clientName}</strong>
              <span>{location}</span>
              {phone ? <span>{phone}</span> : null}
              {email ? <a href={"mailto:" + email}>{email}</a> : null}
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="bakebox-success">
            <CheckCircle2 size={30} />
            <h3>Demo order request captured.</h3>
            <p>
              In production, {clientName} would review the product, date, quantity and
              fulfilment choice in the private bakery order workspace before confirming it.
            </p>
            <button type="button" onClick={() => setSubmitted(false)}>Start another demo order</button>
          </div>
        ) : (
          <form className="bakebox-form" onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}>
            <label>
              Name
              <input required name="name" placeholder="Your name" />
            </label>
            <label>
              Mobile
              <input required name="phone" inputMode="tel" placeholder="+267 ..." />
            </label>
            <label>
              Bake
              <select value={selectedBake} onChange={(event) => setSelectedBake(event.target.value)}>
                {bakes.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </label>
            <label>
              Pickup / delivery
              <select value={fulfilment} onChange={(event) => setFulfilment(event.target.value)}>
                <option>Collection</option>
                <option>Delivery</option>
                <option>Confirm with baker</option>
              </select>
            </label>
            <label>
              Quantity / box size
              <input required name="quantity" placeholder="e.g. 24 scones / 2 boxes" />
            </label>
            <label>
              Date needed
              <input required name="date" type="date" />
            </label>
            <label className="bakebox-form-wide">
              Flavour / notes
              <textarea name="notes" rows={4} placeholder="Flavour, icing, allergy note, event, delivery area or other details." />
            </label>
            <button className="bakebox-form-submit" type="submit">
              Submit demo request <ArrowRight size={17} />
            </button>
          </form>
        )}
      </section>

      <footer className="bakebox-footer">
        <div className="bakebox-footer-brand">
          <span className="bakebox-mark">{initials}</span>
          <div>
            <strong>{clientName}</strong>
            <p>Scones · rolls · cakes · sweet boxes</p>
          </div>
        </div>
        <div>
          <span>{location}</span>
          {phone ? <span>{phone}</span> : null}
          {email ? <a href={"mailto:" + email}>{email}</a> : null}
        </div>
        <small>Designed &amp; developed by Bokang Jobe · Interactive proposal website</small>
      </footer>
    </main>
  );
}
