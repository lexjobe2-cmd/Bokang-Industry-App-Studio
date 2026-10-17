"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown,
  ClipboardList, Database, FileText, Globe2, Layers3, Mail, MapPin,
  Menu, Phone, SearchCheck, ShieldCheck, Target, X
} from "lucide-react";
import styles from "./StatsTechnicians.module.css";

const services = [
  { number: "01", icon: SearchCheck, title: "Research & surveys", summary: "Market, satisfaction, baseline, social, educational, feasibility and tracer studies.", details: ["Quantitative and qualitative research", "Customer and stakeholder surveys", "Baseline and tracer studies"] },
  { number: "02", icon: BarChart3, title: "Data intelligence", summary: "Rigorous data collection, management, digitalisation, analysis and statistical modelling.", details: ["SPSS, CsPro and Excel", "Survey instrument design", "Evidence synthesis and reporting"] },
  { number: "03", icon: Target, title: "Strategy & policy", summary: "Turn evidence into informed policy decisions, strategic plans and business direction.", details: ["Policy reviews and analysis", "Strategy development", "Research-led recommendations"] },
  { number: "04", icon: Layers3, title: "Monitoring & evaluation", summary: "Evaluate projects, programmes and outcomes with methods fit for their context.", details: ["Formative and impact evaluations", "Outcome assessment", "Programme learning and improvement"] },
  { number: "05", icon: ClipboardList, title: "Market & brand insights", summary: "Understand audiences, satisfaction, reputation, communication and business opportunities.", details: ["Brand perception", "Customer experience and loyalty", "Market segmentation and benchmarking"] },
  { number: "06", icon: FileText, title: "Training & reporting", summary: "Clear reporting, practical workshops and capacity building for evidence-led teams.", details: ["Analytical reports and presentations", "Statistical-package training", "Implementation workshops"] }
] as const;

const studies = [
  {
    id: "children", label: "2025", tag: "Social policy", ordinal: "01",
    title: "National Policy on Vulnerable Children",
    summary: "A policy-related research assignment addressing vulnerable children in Botswana.",
    scope: "National policy research",
    context: "Referenced under ISIX Logistics / National Development Bank in the supplied company referees.",
    evidence: "Referees record · 2025 · stated duration: 1 month",
    theme: "children"
  },
  {
    id: "trade", label: "2024–25", tag: "Trade & livelihoods", ordinal: "02",
    title: "Women in Cross-Border Trade Survey",
    summary: "A Botswana survey project focused on women participating in cross-border trade.",
    scope: "Social and development survey",
    context: "Referenced under ISIX Logistics / National Development Bank in the supplied company referees.",
    evidence: "Referees record · 2024/25 · stated duration: 12 months",
    theme: "trade"
  },
  {
    id: "mva", label: "2022", tag: "Brand research", ordinal: "03",
    title: "Brand Perception Survey",
    summary: "A documented brand-perception research engagement for the Motor Vehicle Accident Fund.",
    scope: "Brand and audience research",
    context: "Motor Vehicle Accident Fund is explicitly named as the organisation in the company referees.",
    evidence: "Referees record · 2022 · stated duration: 3 months",
    theme: "brand"
  }
] as const;

type Category = "All projects" | (typeof studies)[number]["tag"];

const organisations = [
  { name: "MVA Fund", title: "Motor Vehicle Accident Fund", link: "https://mvafund.bw/", sub: "Named project organisation" },
  { name: "I-SIX", title: "I-Six Logistics", link: "https://isixlogistics.co.bw/", sub: "Named in project referees" },
  { name: "NDB", title: "National Development Bank", link: "https://www.ndb.bw/", sub: "Named in project referees" }
] as const;

const approach = [
  { number: "01", title: "Define the real question", detail: "Start with the decision to be made, not a survey for its own sake." },
  { number: "02", title: "Design the right method", detail: "Match hypotheses, instruments and fieldwork to the people and context." },
  { number: "03", title: "Gather credible evidence", detail: "Use disciplined data collection, quality checks and suitable analytical tools." },
  { number: "04", title: "Reveal what matters", detail: "Move beyond tables to meaningful interpretation and clear conclusions." },
  { number: "05", title: "Turn insight into action", detail: "Work alongside clients as recommendations become plans and decisions." }
] as const;

function BrandMark({ invert = false }: { invert?: boolean }) {
  return <span className={styles.brand} aria-label="Stats Technicians">
    <span className={styles.logoMark} aria-hidden="true"><i/><i/><i/><i/><i/><i/></span>
    <span className={styles.brandCopy}><strong className={invert ? styles.brandLight : ""}>STATS<span>TECHNICIANS</span></strong><small>RESEARCH  /  DATA  /  STRATEGY</small></span>
  </span>;
}

function SignalGraphic() {
  return <div className={styles.signal} aria-label="Abstract research data visualisation">
    <div className={styles.signalTop}><span><i className={styles.liveDot}/> EVIDENCE EXPLORER</span><span>ST / 001</span></div>
    <div className={styles.chartCenter}>
      <div className={styles.chartGrid}>
        <span>01</span><span>02</span><span>03</span><span>04</span>
      </div>
      <div className={styles.bars} aria-hidden="true">
        {[36, 57, 46, 72, 61, 88, 76, 96, 82].map((height, i) => <motion.span key={i} initial={{ height: 0 }} whileInView={{ height: height + "%" }} viewport={{ once: true }} transition={{ duration: 0.65, delay: i * 0.055 }} style={{ height: height + "%" }}/>)}
      </div>
      <svg className={styles.trend} viewBox="0 0 500 240" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 192 C50 188 65 152 110 167 S189 117 235 129 S330 70 365 78 S440 45 500 20" stroke="#d8f78e" strokeWidth="4" fill="none"/>
        <circle cx="365" cy="78" r="8" fill="#d8f78e" stroke="#152e28" strokeWidth="5"/>
        <circle cx="500" cy="20" r="8" fill="#d8f78e" stroke="#152e28" strokeWidth="5"/>
      </svg>
      <div className={styles.chartCaption}>FROM QUESTIONS TO CLARITY <ArrowUpRight size={16}/></div>
    </div>
    <div className={styles.signalBottom}><div><span>RESEARCH PRINCIPLE</span><strong>Simple. Thorough. Factual.</strong></div><span className={styles.signalGlyph}><BarChart3 size={26}/></span></div>
  </div>;
}

export function StatsTechniciansClientSite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState<Category>("All projects");
  const [selected, setSelected] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", service: "Research & surveys", message: "" });
  const reduceMotion = useReducedMotion();
  const visibleStudies = useMemo(() => category === "All projects" ? studies : studies.filter(s => s.tag === category), [category]);
  const chosen = studies.find(s => s.id === selected);
  const reveal = { initial: reduceMotion ? {} : { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.16 }, transition: { duration: 0.55 } };
  function closeMenu() { setMobileOpen(false); }
  function composeMail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = "Research enquiry — " + form.service;
    const body = ["Dumela Stats Technicians,", "", "Name: " + form.name, "Email: " + form.email, "Service: " + form.service, "", form.message, "", "Sent via the Stats Technicians website enquiry form."].join("\n");
    window.location.href = "mailto:statstechnicians@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  return <main className={styles.site} id="top">
    <header className={styles.header}>
      <div className={styles.navWrap}>
        <a href="#top" onClick={closeMenu} className={styles.brandLink}><BrandMark/></a>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <a href="#about">About</a><a href="#expertise">What we do</a><a href="#work">Our work</a><a href="#approach">Our approach</a>
        </nav>
        <a href="#contact" className={styles.navCta}>Start a conversation <ArrowUpRight size={16}/></a>
        <button className={styles.menuButton} type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>{mobileOpen ? <X size={24}/> : <Menu size={24}/>}</button>
      </div>
      <AnimatePresence>{mobileOpen && <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={styles.mobileNav} aria-label="Mobile navigation">{[["About","#about"],["What we do","#expertise"],["Our work","#work"],["Our approach","#approach"],["Contact us","#contact"]].map(([label,href]) => <a key={href} href={href} onClick={closeMenu}>{label}<ArrowUpRight size={16}/></a>)}</motion.nav>}</AnimatePresence>
    </header>

    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <motion.div className={styles.heroText} initial={reduceMotion ? {} : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <div className={styles.eyebrow}><span className={styles.eyebrowLine}/> BOTSWANA-BORN RESEARCH CONSULTANCY</div>
          <h1>Evidence that<br/><em>changes</em> what<br/>happens next<span className={styles.period}>.</span></h1>
          <p>We turn complex questions into credible research, meaningful data and strategic clarity — so organisations can move forward with confidence.</p>
          <div className={styles.heroActions}><a href="#work" className={styles.buttonLime}>Explore our work <ArrowUpRight size={18}/></a><a href="#about" className={styles.textLink}>Get to know us <ArrowDownRight size={17}/></a></div>
        </motion.div>
        <motion.div initial={reduceMotion ? {} : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className={styles.heroVisual}><SignalGraphic/><div className={styles.floatNote}><span>OUR PHILOSOPHY</span><strong>Hypotheses before facts.</strong><small>Scientific thinking. Human understanding.</small></div></motion.div>
      </div>
      <div className={styles.heroBottom}><span>ROOTED IN BOTSWANA. BUILT FOR BIG QUESTIONS.</span><a href="#expertise">SCROLL TO EXPLORE <ArrowDownRight size={15}/></a></div>
    </section>

    <section className={styles.statsSection} aria-label="Company at a glance"><div className={styles.statsGrid}>
      <div><strong>2023</strong><span>Founded in Botswana</span></div>
      <div><strong>15<span>+</span></strong><span>Years of lead-consultant experience</span></div>
      <div><strong>03</strong><span>Documented project references</span></div>
      <div className={styles.statsQuote}><span>OUR MOTTO</span><strong>Simple / Thorough / Factual</strong></div>
    </div></section>

    <section className={styles.introSection} id="about"><motion.div {...reveal} className={styles.introGrid}>
      <div className={styles.sectionMarker}><span>01 — WHO WE ARE</span><div className={styles.miniStar}>✳</div></div>
      <div><h2>Research isn&apos;t just about <em>numbers.</em><br/>It&apos;s about knowing what they mean.</h2><div className={styles.introLower}><p>STATS TECHNICIANS is a Botswana-based consultancy specialising in research, data analysis, policy analysis and strategic planning. We combine analytical discipline with a culture of integrity to help businesses, public institutions and civil society understand the bigger picture.</p><a href="#contact" className={styles.inlineArrow}>Partner with our team <ArrowUpRight size={20}/></a></div></div>
    </motion.div></section>

    <section className={styles.missionSection}><div className={styles.missionGrid}>
      <motion.div {...reveal} className={styles.missionCard}><span className={styles.darkKicker}>OUR MISSION <span>01/02</span></span><h3>Solutions grounded in truth.</h3><p>To provide business solutions through Research, Data, Strategy and Policy Analysis Services that reflect integrity of the process while giving a true picture of the situation.</p><span className={styles.cardBottom}>Integrity in every insight. <ArrowUpRight size={18}/></span></motion.div>
      <motion.div {...reveal} className={styles.visionCard}><span className={styles.darkKicker}>OUR VISION <span>02/02</span></span><h3>Credibility without borders.</h3><p>To be a global leader in credible research and strategy solutions.</p><div className={styles.values}><span>INTEGRITY</span><span>INNOVATION</span><span>TIMELINESS</span><span>EFFICIENCY</span><span>COMMITMENT</span><span>BOTHO</span></div></motion.div>
    </div></section>

    <section className={styles.serviceSection} id="expertise"><div className={styles.contentWrap}>
      <motion.div {...reveal} className={styles.sectionHead}><div><span className={styles.label}>02 — OUR EXPERTISE</span><h2>Answers for <em>every</em><br/>kind of challenge.</h2></div><p>From policy questions to brand perception, we bring the right research tools to the questions that matter to your organisation.</p></motion.div>
      <div className={styles.serviceGrid}>{services.map(service => {const Icon=service.icon;const expanded=expandedService===service.number;return <article className={styles.serviceCard} key={service.number}><button className={styles.serviceToggle} onClick={() => setExpandedService(expanded ? null : service.number)} aria-expanded={expanded}><span className={styles.serviceTop}><span>{service.number} / EXPERTISE</span><Icon size={27} strokeWidth={1.45}/></span><span className={styles.serviceName}>{service.title}</span><span className={styles.serviceSummary}>{service.summary}</span><span className={styles.expandIcon}>{expanded ? <X size={18}/> : <ArrowUpRight size={20}/>}</span></button><AnimatePresence>{expanded && <motion.div className={styles.serviceDetails} initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{service.details.map(item=><div key={item}><Check size={14}/>{item}</div>)}</motion.div>}</AnimatePresence></article>})}</div>
      <div className={styles.toolsLine}><span>OUR TOOLKIT</span><div><span>IBM SPSS</span><span>CsPro</span><span>Excel</span><span>Qualitative & quantitative methods</span></div></div>
    </div></section>

    <section className={styles.partnerSection}><div className={styles.contentWrap}>
      <div className={styles.partnerTop}><div><span className={styles.label}>REFERENCED ORGANISATIONS</span><h2>Experience across important conversations.</h2></div><p>Organisations named in the company&apos;s supplied project-reference records. References do not necessarily indicate a direct contract with every organisation shown.</p></div>
      <div className={styles.partners}>{organisations.map(org=><a key={org.name} href={org.link} target="_blank" rel="noopener noreferrer" className={styles.partner}><span className={styles.partnerLogo}>{org.name}</span><span>{org.sub}<ArrowUpRight size={14}/></span></a>)}</div>
    </div></section>

    <section className={styles.workSection} id="work"><div className={styles.contentWrap}>
      <motion.div {...reveal} className={styles.sectionHead}><div><span className={styles.label}>03 — SELECTED WORK</span><h2>Good research.<br/><em>Real-world</em> questions.</h2></div><p>A selection of assignments included in the organisation&apos;s reference records. Findings and participant-level data are not made public here.</p></motion.div>
      <div className={styles.filterRow} role="group" aria-label="Filter studies">{(["All projects","Social policy","Trade & livelihoods","Brand research"] as Category[]).map(item=><button key={item} className={category===item ? styles.filterActive : ""} aria-pressed={category===item} onClick={() => {setCategory(item);setSelected(null);}}>{item}</button>)}</div>
      <div className={styles.workGrid}>{visibleStudies.map((study,index)=><motion.article key={study.id} layout initial={reduceMotion ? {} : {opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:index*.06}} className={styles.studyCard}><div className={styles.studyVisual+" "+styles[study.theme]}><span>ST / CASE STUDY {study.ordinal}</span><div className={styles.studyArt} aria-hidden="true"><span/><span/><span/></div><span className={styles.studyYear}>{study.label}</span></div><div className={styles.studyBody}><div className={styles.studyTag}>{study.tag}</div><h3>{study.title}</h3><p>{study.summary}</p><button onClick={() => setSelected(selected===study.id ? null : study.id)} aria-expanded={selected===study.id}>View project details <ArrowUpRight size={17}/></button>{selected===study.id && <motion.div initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} className={styles.studyDetail}><strong>{study.scope}</strong><p>{study.context}</p><small>{study.evidence}</small></motion.div>}</div></motion.article>)}</div>
      <div className={styles.researchFootnote}><ShieldCheck size={19}/><p>Research archive integrity: the supplied SPSS and CSPro materials inform our understanding of fieldwork capability. Raw survey records, respondent identifiers and unverified findings are intentionally excluded from this public site.</p></div>
    </div></section>

    <section className={styles.approachSection} id="approach"><div className={styles.contentWrap}>
      <motion.div {...reveal} className={styles.sectionHead}><div><span className={styles.label}>04 — HOW WE WORK</span><h2>Built on rigour.<br/><em>Driven by curiosity.</em></h2></div><p>Our approach is scientific and collaborative. We shape the research with you, then turn the learning into decisions.</p></motion.div>
      <div className={styles.steps}>{approach.map((step,index)=><motion.div {...reveal} key={step.number} className={styles.step}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div><span className={styles.stepIcon}>{index===approach.length-1 ? <Check size={19}/> : <ArrowDownRight size={20}/>}</span></motion.div>)}</div>
    </div></section>

    <section className={styles.teamSection}><div className={styles.contentWrap}><div className={styles.teamGrid}><motion.div {...reveal}><span className={styles.label}>THE PEOPLE BEHIND THE INSIGHT</span><h2>Expertise with<br/><em>a human side.</em></h2><p>With experience spanning statistics, economics, policy analysis, data management, monitoring and evaluation, we work with clients at the point where evidence becomes action.</p></motion.div><div className={styles.teamTile}><span className={styles.teamMonogram}>MJ<span>✳</span></span><div><span>COMPANY LEADERSHIP</span><h3>Mopati Jobe</h3><p>Owner — as identified in the website brief.</p></div><div className={styles.teamNote}><Globe2 size={18}/> Botswana-based, working across sectors</div></div></div></div></section>

    <section className={styles.contactSection} id="contact"><div className={styles.contentWrap}><div className={styles.contactGrid}>
      <div className={styles.contactIntro}><span className={styles.label}>05 — LET'S WORK TOGETHER</span><h2>Have a question<br/>worth <em>answering?</em></h2><p>Tell us about the problem, policy question or research challenge you want to explore. Great work starts with a conversation.</p><a href="mailto:statstechnicians@gmail.com"><Mail size={18}/> statstechnicians@gmail.com</a><a href="tel:+2673113051"><Phone size={18}/> +267 311 3051</a><span className={styles.location}><MapPin size={18}/> Plot 6876, Mmaratanang Ward, Tlokweng, Botswana</span></div>
      <form className={styles.contactForm} onSubmit={composeMail}><div className={styles.formHeading}><strong>Start a project enquiry</strong><span>01 / 04</span></div><label>Your name<input required maxLength={100} autoComplete="name" placeholder="Your full name" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))}/></label><label>Email address<input required type="email" maxLength={150} autoComplete="email" placeholder="you@organisation.com" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))}/></label><label>What can we help with?<span className={styles.selectBox}><select value={form.service} onChange={e=>setForm(v=>({...v,service:e.target.value}))}>{services.map(service=><option key={service.number}>{service.title}</option>)}</select><ChevronDown size={16}/></span></label><label>Tell us about your project<textarea required minLength={10} maxLength={2500} rows={4} placeholder="What would you like to understand, evaluate or improve?" value={form.message} onChange={e=>setForm(v=>({...v,message:e.target.value}))}/></label><button type="submit" className={styles.sendButton}>Open email draft <ArrowUpRight size={20}/></button><p className={styles.formNote}>This opens your email application with a pre-filled message. No information is uploaded to this website or sent automatically.</p></form>
    </div></div></section>

    <footer className={styles.footer}><div className={styles.contentWrap}><div className={styles.footerMain}><a href="#top" className={styles.brandLink}><BrandMark invert/></a><p>Research. Data. Strategy.<br/>Evidence you can act on.</p><div><a href="#about">About</a><a href="#expertise">Services</a><a href="#work">Selected work</a><a href="#contact">Contact</a></div></div><div className={styles.footerBottom}><span>© {new Date().getFullYear()} STATS TECHNICIANS (PTY) LTD. All rights reserved.</span><span>Simple · Thorough · Factual</span><span>Designed &amp; developed by Bokang Jobe · <Link href="/">App Studio</Link></span></div></div></footer>
  </main>;
}
