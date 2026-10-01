import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, BadgeCheck, ChevronDown, ChevronLeft, ChevronRight, Clock3,
  Cross, HeartPulse, Instagram, MapPin, Menu, MessageCircle, Microscope,
  Phone, Play, Scissors, ShieldCheck, Stethoscope, Syringe, TestTube2, X, Zap,
} from "lucide-react";

const site = {
  whatsapp: "https://wa.me/5595981195702",
  phone: "tel:+5595981195702",
  maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Veterin%C3%A1ria+Dr+Kleber%2C+Av.+Cap.+J%C3%BAlio+Bezerra%2C+358%2C+Boa+Vista+-+RR",
  instagram: "https://www.instagram.com/clinicaveterinariadrkleber/",
  facebook: "https://www.facebook.com/",
  media: "https://clinicadrkleber.netlify.app/assets/uploads/",
};

const wa = (message: string) => `${site.whatsapp}?text=${encodeURIComponent(message)}`;
const track = (event: string) => {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer?.push({ event });
};

const photos = [
  ["fachada-ampla.jpg", "Fachada da Clínica Veterinária Dr. Kleber", "Fachada"],
  ["entrada.jpg", "Entrada da clínica", "Fachada"],
  ["recepcao.jpg", "Recepção da clínica", "Recepção"],
  ["fachada-pet.jpg", "Fachada com pet", "Fachada"],
  ["dr-kleber-filhote.jpg", "Dr. Kleber com filhote", "Atendimento"],
  ["dr-kleber-atendendo-cachorro.jpg", "Dr. Kleber atendendo cachorro", "Atendimento"],
  ["dr-kleber-consultorio.jpg", "Dr. Kleber em consultório", "Atendimento"],
  ["atendimento-gato-1.jpg", "Atendimento veterinário com gato", "Atendimento"],
  ["equipe-fachada.jpg", "Equipe da clínica", "Equipe"],
  ["veterinaria-gato.jpg", "Veterinária cuidando de gato", "Equipe"],
  ["gato-recuperacao.jpg", "Gato em recuperação", "Atendimento"],
  ["eletrocardiograma.jpg", "Eletrocardiograma veterinário", "Diagnóstico"],
  ["laboratorio-idexx.jpg", "Laboratório veterinário", "Diagnóstico"],
  ["ultrassom.jpg", "Ultrassom veterinário", "Diagnóstico"],
  ["centro-cirurgico.jpg", "Centro cirúrgico", "Cirurgia"],
  ["equipe-procedimento.jpg", "Equipe em procedimento", "Cirurgia"],
  ["equipe-centro-cirurgico.jpg", "Equipe no centro cirúrgico", "Cirurgia"],
  ["procedimento-centro-cirurgico.jpg", "Procedimento no centro cirúrgico", "Cirurgia"],
  ["dr-kleber.jpg", "Dr. Kleber, médico veterinário", "Equipe"],
] as const;

const services = [
  [Zap, "Emergência 24h", "Atendimento para situações urgentes, todos os dias.", "Atendimento"],
  [Stethoscope, "Consultas veterinárias", "Avaliação clínica para cães e gatos.", "Atendimento"],
  [Syringe, "Vacinação", "Prevenção e acompanhamento veterinário.", "Prevenção"],
  [TestTube2, "Exames laboratoriais", "Exames para apoiar a investigação clínica.", "Diagnóstico"],
  [Microscope, "Ultrassonografia", "Recurso de diagnóstico e acompanhamento.", "Diagnóstico"],
  [HeartPulse, "Eletrocardiograma", "Avaliação cardíaca e apoio pré-cirúrgico.", "Diagnóstico"],
  [Cross, "Internação", "Acompanhamento contínuo quando necessário.", "Tratamento"],
  [Scissors, "Cirurgias", "Estrutura para procedimentos e recuperação.", "Tratamento"],
  [ShieldCheck, "Farmácia veterinária", "Apoio para continuidade do tratamento prescrito.", "Suporte"],
] as const;

const faq = [
  ["Vocês atendem 24 horas?", "Sim. A clínica informa atendimento veterinário 24 horas, todos os dias, inclusive para emergências."],
  ["Onde fica a clínica?", "Av. Cap. Júlio Bezerra, 358, Centro, Boa Vista — RR, CEP 69305-294."],
  ["Vocês atendem cães e gatos?", "Sim. O site da clínica informa atendimento para cães e gatos."],
  ["Como falar pelo WhatsApp?", "Use qualquer botão de WhatsApp desta página para abrir uma conversa com a clínica."],
  ["Quais serviços estão disponíveis?", "Consultas, emergência 24h, vacinação, exames laboratoriais, ultrassonografia, eletrocardiograma, internação, cirurgias e farmácia veterinária são apresentados no site da clínica."],
];

const img = (file: string) => site.media + file;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clínica Veterinária Dr. Kleber 24h | Boa Vista - RR" },
      { name: "description", content: "Atendimento veterinário 24 horas em Boa Vista - RR para cães e gatos. Consultas, emergência, vacinas, exames, internação e cirurgias." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Clínica Veterinária Dr. Kleber 24h | Boa Vista - RR" },
      { property: "og:description", content: "Atendimento veterinário completo 24 horas em Boa Vista - RR." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: img("fachada-ampla.jpg") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Clínica Veterinária Dr. Kleber 24h" },
      { name: "twitter:description", content: "Atendimento veterinário 24 horas em Boa Vista - RR." },
    ],
    links: [{ rel: "canonical", href: "https://clinicadrkleber.netlify.app/" }],
  }),
  component: ClinicHome,
});

function ClinicHome() {
  const [menu, setMenu] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [category, setCategory] = useState("Todos");
  const [faqOpen, setFaqOpen] = useState(0);

  const visiblePhotos = category === "Todos" ? photos : photos.filter(([, , c]) => c === category);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    const key = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((lightbox + 1) % photos.length);
      if (e.key === "ArrowLeft") setLightbox((lightbox - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", key); };
  }, [lightbox]);

  const closeMenu = () => setMenu(false);
  const goLightbox = (delta: number) => setLightbox((current) => current === null ? null : (current + delta + photos.length) % photos.length);

  return (
    <div className="site">
      <div className="emergency-top"><span><i /> ATENDIMENTO VETERINÁRIO 24 HORAS</span><span className="top-message">Emergências não esperam. Nossa equipe também não.</span><a href={wa("Olá, preciso de informações sobre atendimento veterinário.")} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click")}>Falar com a clínica <ArrowRight /></a></div>

      <header className="header">
        <a className="brand" href="#inicio" onClick={closeMenu}>
          <span className="brand-symbol"><HeartPulse /></span><span><strong>DR. KLEBER</strong><small>CLÍNICA VETERINÁRIA · 24H</small></span>
        </a>
        <nav className={menu ? "nav open" : "nav"} aria-label="Navegação principal">
          {["A clínica","Serviços","Exames","Cirurgias","Estrutura","Equipe","Avaliações","Contato"].map((item, i) => <a key={item} href={["#clinica","#servicos","#exames","#cirurgia","#estrutura","#equipe","#avaliacoes","#contato"][i]} onClick={closeMenu}>{item}</a>)}
          <Link to="/emergencia" className="nav-emergency" onClick={closeMenu}><Zap /> Emergência 24h</Link>
        </nav>
        <a className="header-whatsapp" href={wa("Olá, gostaria de falar com a Clínica Veterinária Dr. Kleber.")} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click")}><MessageCircle /> WhatsApp</a>
        <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? "Fechar menu" : "Abrir menu"}>{menu ? <X /> : <Menu />}</button>
      </header>

      <main id="inicio">
        <section className="hero">
          <img src={img("fachada-ampla.jpg")} alt="Clínica Veterinária Dr. Kleber em Boa Vista" fetchPriority="high" />
          <div className="hero-overlay" />
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><i /> CLÍNICA VETERINÁRIA · BOA VISTA — RR</span>
              <h1>Cuidado veterinário completo.<br /><em>24 horas por dia.</em><br />Todos os dias.</h1>
              <p>Da prevenção à emergência, seu pet encontra atendimento médico, diagnóstico, cirurgia e acompanhamento em um só lugar.</p>
              <div className="hero-actions">
                <a className="btn btn-accent" href={wa("Olá, preciso de atendimento veterinário para meu pet. Gostaria de saber como proceder.")} target="_blank" rel="noreferrer" onClick={() => track("emergency_click")}><MessageCircle /> Falar no WhatsApp <ArrowRight /></a>
                <a className="btn btn-light" href={site.maps} target="_blank" rel="noreferrer" onClick={() => track("route_click")}><MapPin /> Como chegar</a>
                <a className="text-link" href="#servicos">Ver nossos serviços <ArrowRight /></a>
              </div>
            </div>
            <div className="hero-proof">
              <div className="open-card"><span className="status-dot" /> <div><small>ATENDIMENTO 24H</small><strong>Aberto todos os dias</strong></div><Clock3 /></div>
              <div className="location-card"><MapPin /><span><small>BOA VISTA — RR</small><strong>Centro</strong></span></div>
            </div>
          </div>
          <div className="hero-rating"><strong>4,7</strong><span>★★★★★</span><small>233 avaliações no Google</small></div>
          <a className="hero-phone" href={site.phone} onClick={() => track("phone_click")}><Phone /><span><small>PLANTÃO 24H</small><strong>(95) 98119-5702</strong></span></a>
        </section>

        <section className="trust-strip" aria-label="Informações de confiança">
          <div><strong>4,7 <span>★</span></strong><small>Google</small></div><div><strong>+230</strong><small>avaliações</small></div><div><strong>24h</strong><small>todos os dias</small></div><div><strong>Boa Vista</strong><small>Roraima</small></div>
        </section>

        <section className="section split-intro" id="clinica">
          <div className="section-title"><span className="eyebrow dark">QUANDO VOCÊ MAIS PRECISA</span><h2>Emergências não têm<br /><em>hora marcada.</em></h2></div>
          <div className="intro-copy"><p>Quando algo acontece com quem faz parte da família, cada minuto importa. Por isso, a Clínica Veterinária Dr. Kleber mantém atendimento veterinário 24 horas para cães e gatos.</p><a className="btn btn-dark" href={wa("Olá, preciso de atendimento veterinário para meu pet. Gostaria de saber como proceder.")} target="_blank" rel="noreferrer"><Zap /> Preciso de atendimento agora</a></div>
          <div className="intro-image"><img src={img("dr-kleber-atendendo-cachorro.jpg")} alt="Dr. Kleber atendendo cachorro" loading="lazy" /><span>Atendimento veterinário</span></div>
        </section>

        <section className="section services-section" id="servicos">
          <div className="section-title centered"><span className="eyebrow dark">ATENDIMENTO COMPLETO</span><h2>Tudo o que seu pet precisa<br /><em>em um só lugar.</em></h2><p>Atendimento médico, diagnóstico, prevenção, cirurgia e acompanhamento com a estrutura apresentada pela clínica.</p></div>
          <div className="service-groups">
            {["Atendimento","Diagnóstico","Tratamento","Prevenção","Suporte"].map(group => (
              <div className="service-group" key={group}><span className="group-label">{group}</span>
                {services.filter(s => s[3] === group).map(([Icon, title, desc], i) => <a className="service-item" key={title} href={title === "Emergência 24h" ? wa("Olá, preciso de atendimento veterinário para meu pet. Gostaria de saber como proceder.") : "#contato"} target={title === "Emergência 24h" ? "_blank" : undefined} rel={title === "Emergência 24h" ? "noreferrer" : undefined}><span className="service-icon"><Icon /></span><span><strong>{title}</strong><small>{desc}</small></span>{title === "Emergência 24h" && <b>24H</b>}<ArrowRight /></a>)}
              </div>
            ))}
          </div>
        </section>

        <section className="dark-section diagnostics-section" id="exames">
          <div className="section-title light-title"><span className="eyebrow light">DIAGNÓSTICO</span><h2>Tecnologia para enxergar<br />o que seu pet <em>não consegue dizer.</em></h2><p>Recursos de apoio ao diagnóstico para investigar, acompanhar e orientar decisões clínicas com mais informação.</p></div>
          <div className="diagnostic-cards">
            <article><div className="diagnostic-image"><img src={img("laboratorio-idexx.jpg")} alt="Laboratório veterinário" loading="lazy" /></div><span>01</span><h3>Laboratório</h3><p>Exames laboratoriais para apoiar a investigação clínica.</p></article>
            <article><div className="diagnostic-image"><img src={img("ultrassom.jpg")} alt="Ultrassom veterinário" loading="lazy" /></div><span>02</span><h3>Ultrassonografia</h3><p>Recurso de diagnóstico e acompanhamento clínico.</p></article>
            <article><div className="diagnostic-image"><img src={img("eletrocardiograma.jpg")} alt="Eletrocardiograma veterinário" loading="lazy" /></div><span>03</span><h3>Eletrocardiograma</h3><p>Avaliação cardíaca e apoio pré-cirúrgico.</p></article>
          </div>
        </section>

        <section className="section laboratory-callout"><div><span className="eyebrow dark">AGILIDADE QUANDO IMPORTA</span><h2>Diagnóstico com agilidade<br /><em>para decisões mais precisas.</em></h2><p>O site da clínica apresenta exames laboratoriais e recursos de diagnóstico como parte da estrutura de atendimento. Informações específicas de prazo ou resultado devem ser confirmadas diretamente com a equipe.</p><a className="btn btn-dark" href={wa("Olá, gostaria de informações sobre exames veterinários.")} target="_blank" rel="noreferrer"><MessageCircle /> Perguntar sobre exames</a></div><figure><img src={img("laboratorio-idexx.jpg")} alt="Equipamento de laboratório veterinário" loading="lazy" /><figcaption>Laboratório</figcaption></figure></section>

        <section className="section surgery-section" id="cirurgia"><div className="surgery-image"><img src={img("centro-cirurgico.jpg")} alt="Centro cirúrgico veterinário" loading="lazy" /><div className="image-caption"><Scissors /> Centro cirúrgico</div></div><div className="surgery-copy"><span className="eyebrow dark">CIRURGIA</span><h2>Cirurgia exige técnica.<br /><em>E confiança.</em></h2><p>Uma estrutura apresentada pela clínica para procedimentos cirúrgicos, com atenção aos momentos de avaliação, preparação e recuperação.</p><div className="timeline">{["Avaliação","Diagnóstico","Preparação","Procedimento","Recuperação","Acompanhamento"].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div><a className="btn btn-dark" href={wa("Olá, gostaria de informações sobre cirurgia veterinária.")} target="_blank" rel="noreferrer"><MessageCircle /> Falar com a equipe</a></div></section>

        <section className="section hospitalization"><div className="hospital-copy"><span className="eyebrow dark">INTERNAÇÃO</span><h2>Quando seu pet precisa de<br /><em>acompanhamento contínuo.</em></h2><p>A internação faz parte dos serviços apresentados pela clínica para situações em que o paciente precisa de observação e cuidados veterinários contínuos.</p><ul><li><BadgeCheck /> Acompanhamento</li><li><BadgeCheck /> Observação</li><li><BadgeCheck /> Suporte durante a recuperação</li></ul></div><figure><img src={img("gato-recuperacao.jpg")} alt="Gato em recuperação na clínica" loading="lazy" /></figure></section>

        <section className="section structure-section" id="estrutura"><div className="section-title"><span className="eyebrow dark">A CLÍNICA</span><h2>Um espaço pensado<br /><em>para cuidar.</em></h2><p>Conheça ambientes, equipe, atendimento, diagnóstico e centro cirúrgico por meio das fotografias reais disponíveis.</p></div><div className="editorial-grid"><img src={img("recepcao.jpg")} alt="Recepção" loading="lazy" /><img src={img("dr-kleber-consultorio.jpg")} alt="Consultório" loading="lazy" /><img src={img("equipe-fachada.jpg")} alt="Equipe" loading="lazy" /><img src={img("centro-cirurgico.jpg")} alt="Centro cirúrgico" loading="lazy" /><img src={img("ultrassom.jpg")} alt="Ultrassom" loading="lazy" /></div></section>

        <section className="section team-section" id="equipe"><div className="team-main"><img src={img("dr-kleber.jpg")} alt="Dr. Kleber, médico veterinário" loading="lazy" /></div><div className="team-copy"><span className="eyebrow dark">EQUIPE</span><h2>Por trás de cada atendimento, existem pessoas que escolheram <em>cuidar.</em></h2><p>A clínica apresenta o Dr. Kleber e um corpo técnico por meio de fotografias reais. Funções e qualificações individuais não são ampliadas aqui sem informação oficial confirmada.</p><div className="team-mini">{["corpo-tecnico-1.jpeg","corpo-tecnico-2.jpeg","corpo-tecnico-3.jpeg","corpo-tecnico-4.jpeg"].map((x,i)=><img key={x} src={img(x)} alt={`Profissional da equipe ${i+1}`} loading="lazy" />)}</div><div className="doctor-label"><strong>Dr. Kleber</strong><span>Médico veterinário</span></div></div></section>

        <section className="video-section"><div className="video-cover"><img src={img("equipe-fachada.jpg")} alt="Equipe da Clínica Veterinária Dr. Kleber" loading="lazy" /><a href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer" onClick={() => track("video_play")}><Play /></a><span>ASSISTIR AO VÍDEO</span></div><div className="video-copy"><span className="eyebrow light">VÍDEO INSTITUCIONAL</span><h2>Conheça a Clínica<br /><em>Dr. Kleber 24h.</em></h2><p>O vídeo institucional está disponível na versão atual da clínica.</p><a className="btn btn-light" href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer"><Play /> Assistir ao vídeo</a></div></section>

        <section className="section reviews-section" id="avaliacoes"><div className="reviews-top"><div><span className="eyebrow dark">AVALIAÇÕES</span><h2>A confiança de quem já precisou<br /><em>da nossa equipe.</em></h2></div><div className="score-big"><strong>4,7</strong><span>★★★★★</span><small>233 avaliações no Google</small></div></div><div className="review-grid"><blockquote>“Sempre que levei meus pets quando dodóis, eles ficaram sarados. Eu confio nessa equipe.”<footer><strong>Guiomar Vilela</strong><span>Google</span></footer></blockquote><blockquote>“Profissionais de primeira, atenção com meu pet desde o primeiro momento. Excelente atendimento.”<footer><strong>Yrlian Gamboa</strong><span>Google</span></footer></blockquote><blockquote>“Meus pets sempre foram atendidos na clínica, eu confio e indico de olhos fechados.”<footer><strong>Ana Carolina Macêdo</strong><span>Google</span></footer></blockquote></div></section>

        <section className="faq-section"><div className="section"><div className="section-title"><span className="eyebrow dark">DÚVIDAS FREQUENTES</span><h2>Informação clara<br /><em>quando você precisa.</em></h2></div><div className="faq-list">{faq.map(([q,a],i)=><button key={q} className={faqOpen===i ? "faq-row active" : "faq-row"} onClick={() => setFaqOpen(faqOpen===i ? -1 : i)}><span><strong>{q}</strong>{faqOpen===i && <small>{a}</small>}</span><ChevronDown /></button>)}</div></div></section>

        <section className="emergency-final"><div className="section emergency-inner"><div><span className="eyebrow light"><i /> PLANTÃO ATIVO · 24 HORAS</span><h2>Seu pet merece cuidado<br /><em>quando mais precisa.</em></h2><p>Estamos prontos para receber você e seu pet.</p></div><div className="final-actions"><a className="btn btn-accent" href={wa("Olá, preciso de atendimento veterinário para meu pet. Gostaria de saber como proceder.")} target="_blank" rel="noreferrer"><MessageCircle /> Falar no WhatsApp</a><a className="btn btn-light" href={site.maps} target="_blank" rel="noreferrer"><MapPin /> Como chegar</a><a className="btn btn-outline-light" href={site.phone}><Phone /> Ligar agora</a></div></div></section>

        <section className="section location-section" id="contato"><div><span className="eyebrow dark">LOCALIZAÇÃO E CONTATO</span><h2>Estamos no Centro<br /><em>de Boa Vista.</em></h2><address><MapPin /> <span>Av. Cap. Júlio Bezerra, 358<br />Centro — Boa Vista, RR<br />CEP 69305-294</span></address><div className="contact-actions"><a className="btn btn-dark" href={site.maps} target="_blank" rel="noreferrer" onClick={() => track("route_click")}><MapPin /> Como chegar</a><a className="btn btn-plain" href={site.phone} onClick={() => track("phone_click")}><Phone /> (95) 98119-5702</a></div></div><a className="map-card" href={site.maps} target="_blank" rel="noreferrer"><MapPin /><strong>Clínica Veterinária<br />Dr. Kleber 24h</strong><span>Abrir rota no Google Maps <ArrowRight /></span></a></section>
      </main>

      <footer className="footer"><div className="footer-main"><div className="brand"><span className="brand-symbol"><HeartPulse /></span><span><strong>DR. KLEBER</strong><small>CLÍNICA VETERINÁRIA · 24H</small></span></div><p>Atendimento veterinário completo para cães e gatos em Boa Vista — RR.</p><nav><a href="#clinica">A clínica</a><a href="#servicos">Serviços</a><a href="#exames">Exames</a><a href="#cirurgia">Cirurgias</a><a href="#estrutura">Estrutura</a><a href="#equipe">Equipe</a><a href="#avaliacoes">Avaliações</a><a href="#contato">Contato</a></nav><div className="footer-contact"><a href={site.phone}><Phone /> (95) 98119-5702</a><a href={site.instagram} target="_blank" rel="noreferrer"><Instagram /> Instagram</a><a href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a></div></div><div className="footer-bottom"><span>Atendimento veterinário 24 horas</span><span>© {new Date().getFullYear()} Clínica Veterinária Dr. Kleber</span></div></footer>

      <div className="mobile-bar"><a href={site.phone} onClick={() => track("phone_click")}><Phone /><span>Ligar</span></a><a className="mobile-emergency" href={wa("Olá, preciso de atendimento veterinário para meu pet. Gostaria de saber como proceder.")} target="_blank" rel="noreferrer" onClick={() => track("emergency_click")}><Zap /><span>Emergência</span></a><a href={site.whatsapp} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click")}><MessageCircle /><span>WhatsApp</span></a></div>

      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeria de imagens"><button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Fechar"><X /></button><button className="lightbox-prev" onClick={() => goLightbox(-1)} aria-label="Imagem anterior"><ChevronLeft /></button><figure><img src={img(photos[lightbox][0])} alt={photos[lightbox][1]} /><figcaption>{photos[lightbox][1]} · {lightbox + 1}/{photos.length}</figcaption></figure><button className="lightbox-next" onClick={() => goLightbox(1)} aria-label="Próxima imagem"><ChevronRight /></button></div>}
    </div>
  );
}
