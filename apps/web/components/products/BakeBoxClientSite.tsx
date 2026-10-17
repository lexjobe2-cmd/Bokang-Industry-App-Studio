"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import { bakeryOrdersKey, type BakeryOrder } from "../../lib/bakery-orders";
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
  const [submittedOrder, setSubmittedOrder] = useState<BakeryOrder | null>(null);
  const [, setOrders, hydrated] = usePersistentState<BakeryOrder[]>(bakeryOrdersKey(clientName), []);
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
    const local = digits.startsWith("267") ? digits.slice(3) : digits.replace(/^0/, "");
    // A phone number is not evidence that an active WhatsApp account exists.
    if (!/^7\d{7}$/.test(local)) return "";
    return "https://wa.me/267" + local + "?text=" +
      encodeURIComponent("Hi " + clientName + ", I would like to place a bakery order.");
  }, [phone, clientName]);

  const orderWhatsAppHref = submittedOrder && whatsAppHref
    ? whatsAppHref.split("?")[0] + "?text=" + encodeURIComponent(
      "Hello " + clientName + ", I would like to enquire about " + submittedOrder.quantity +
      " of " + submittedOrder.product + " for " + submittedOrder.due +
      " (" + submittedOrder.fulfilment + "). My name is " + submittedOrder.customer +
      ". Please confirm price and availability."
    )
    : "";

  const today = new Date();
  const earliestDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");

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
              Browse our sample menu <ArrowRight size={17} />
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
            <span><Truck size={16} /> Delivery subject to confirmation</span>
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
            <span>Made-to-order favourites</span>
            <strong>Scones + cinnamon rolls</strong>
            <small>Illustrative menu — confirm products, prices and availability.</small>
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
            <h2>Discover the sweet favourites.</h2>
          </div>
          <p>
            Browse our sample selection and choose a box size. Every item, flavour, price and
            delivery option must be confirmed with the bakery before your order is accepted.
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
          Illustrative prices and menu only — not a real offer. Confirm availability, ingredients, pack sizes and price with the business.
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
            Tell us what you would like to enjoy and when. We will help you prepare a clear
            enquiry with the product, pack size and collection or delivery preference.
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
            <span className="bakebox-kicker">Baked for moments worth sharing</span>
            <h2>Sweet treats for ordinary days and special occasions.</h2>
          </div>
          <p>
            From a warm scone with morning tea to a tray of cinnamon rolls for the office,
            the best bakes are the ones you get to share.
          </p>
        </div>

        <div className="bakebox-values">
          <article><Wheat size={23} /><h3>Fresh batches</h3><p>Ask which favourites are available for your preferred date and time.</p></article>
          <article><Package size={23} /><h3>Clear box sizes</h3><p>Choose an illustrative pack size and confirm the bakery&apos;s available options.</p></article>
          <article><CalendarDays size={23} /><h3>Lead-time clarity</h3><p>Allow enough time for preparation and ask about custom-order lead times.</p></article>
          <article><MapPin size={23} /><h3>Pickup confidence</h3><p>Confirm collection time and address, or ask whether delivery is available.</p></article>
        </div>
      </section>

      <section id="order" className="bakebox-order">
        <div className="bakebox-order-copy">
          <span className="bakebox-kicker">Place a bakery request</span>
          <h2>What should we bake for you?</h2>
          <p>
            This interactive demo saves your request in this browser only. It does not send
            an order to the bakery or take payment. To enquire for real, use the listed contact details.
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

        {submittedOrder ? (
          <div className="bakebox-success">
            <CheckCircle2 size={30} />
            <h3>Demo request saved on this device.</h3>
            <p>
              Your request is stored in this browser only. The bakery has not been notified,
              and this is not a confirmed order. The Studio workspace can review it on the same device.
            </p>
            {orderWhatsAppHref ? (
              <a className="bakebox-primary" href={orderWhatsAppHref} target="_blank" rel="noreferrer">
                Continue enquiry on WhatsApp <ArrowRight size={16} />
              </a>
            ) : null}
            <button type="button" onClick={() => setSubmittedOrder(null)}>Start another demo request</button>
          </div>
        ) : (
          <form className="bakebox-form" onSubmit={(event) => {
            event.preventDefault();
            if (!hydrated) return;
            const fields = new FormData(event.currentTarget);
            const get = (key: string, limit = 300) => String(fields.get(key) ?? "").trim().slice(0, limit);
            const requestedDate = get("date", 10);
            if (!requestedDate || requestedDate < earliestDate) return;
            const order: BakeryOrder = {
              id: "BK-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
              customer: get("name", 120),
              phone: get("phone", 40),
              email: get("email", 180),
              product: selectedBake,
              quantity: get("quantity", 120),
              due: requestedDate,
              fulfilment: fulfilment === "Delivery" ? "Delivery" : "Collection",
              deliveryArea: get("deliveryArea", 180),
              notes: get("notes", 1000),
              status: "Requested",
              createdAt: new Date().toISOString(),
              demoOnly: true,
            };
            if (!order.customer || !order.phone || !order.quantity) return;
            setOrders((current) => [order, ...current]);
            setSubmittedOrder(order);
          }}>
            <label>
              Name
              <input required name="name" placeholder="Your name" />
            </label>
            <label>
              Mobile
              <input required name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+267 ..." />
            </label>
            <label>
              Email (optional)
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
            </label>
            <label>
              Bake
              <select value={selectedBake} onChange={(event) => setSelectedBake(event.target.value)}>
                {bakes.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
            </label>
            <label>
              Pickup / delivery
              <select name="fulfilment" value={fulfilment} onChange={(event) => setFulfilment(event.target.value)}>
                <option>Collection</option>
                <option>Delivery</option>
                
              </select>
            </label>
            {fulfilment === "Delivery" ? (
              <label>
                Delivery area
                <input name="deliveryArea" required placeholder="Your suburb or delivery location" />
              </label>
            ) : null}
            <label>
              Quantity / box size
              <input required name="quantity" placeholder="e.g. 24 scones / 2 boxes" />
            </label>
            <label>
              Date needed
              <input required name="date" type="date" min={earliestDate} />
            </label>
            <label className="bakebox-form-wide">
              Flavour / notes
              <textarea name="notes" rows={4} placeholder="Flavour, icing, allergy note, event, delivery area or other details." />
            </label>
            <p className="bakebox-form-notice">Demo only: this request stays on your device; nothing is submitted to the bakery. For a real order, contact the business directly.</p>
            <button className="bakebox-form-submit" type="submit" disabled={!hydrated}>
              {hydrated ? "Save demo request" : "Preparing demo form"} <ArrowRight size={17} />
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
