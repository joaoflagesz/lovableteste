import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, BadgeCheck, CalendarDays, ChevronDown, Clock3, Cross,
  HeartPulse, Instagram, MapPin, Menu, MessageCircle, Microscope,
  Phone, Play, Scissors, ShieldCheck, Stethoscope, Syringe, TestTube2,
  UserRound, X, Zap
} from "lucide-react";

const site = {
  whatsapp: "https://wa.me/5595981195702",
  phone: "tel:+5595981195702",
  maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Veterin%C3%A1ria+Dr+Kleber%2C+Av.+Cap.+J%C3%BAlio+Bezerra%2C+358%2C+Boa+Vista+-+RR",
  instagram: "https://www.instagram.com/clinicaveterinariadrkleber/",
  media: "https://clinicadrkleber.netlify.app/assets/uploads/",
};

const photos = [
  ["fachada-ampla.jpg","Fachada ampla da clínica"],
  ["entrada.jpg","Entrada da Clínica Veterinária Dr. Kleber"],
  ["recepcao.jpg","Recepção da clínica"],
  ["fachada-pet.jpg","Fachada da clínica com pet"],
  ["dr-kleber-filhote.jpg","Dr. Kleber com filhote"],
  ["dr-kleber-atendendo-cachorro.jpg","Dr. Kleber atendendo cachorro"],
  ["dr-kleber-consultorio.jpg","Dr. Kleber em consulta veterinária"],
  ["atendimento-gato-1.jpg","Atendimento veterinário com gato"],
  ["equipe-fachada.jpg","Equipe da Clínica Veterinária Dr. Kleber"],
  ["veterinaria-gato.jpg","Veterinária cuidando de gato"],
  ["gato-recuperacao.jpg","Gato em recuperação"],
  ["eletrocardiograma.jpg","Eletrocardiograma veterinário"],
  ["laboratorio-idexx.jpg","Laboratório veterinário com equipamento IDEXX"],
  ["ultrassom.jpg","Ultrassom veterinário"],
  ["centro-cirurgico.jpg","Centro cirúrgico veterinário"],
  ["equipe-procedimento.jpg","Equipe em procedimento cirúrgico"],
  ["equipe-centro-cirurgico.jpg","Equipe no centro cirúrgico"],
  ["procedimento-centro-cirurgico.jpg","Procedimento no centro cirúrgico"],
  ["dr-kleber.jpg","Dr. Kleber, médico veterinário"],
];

const img = (name: string) => site.media + name;

const services = [
  [Zap, "Emergência 24h", "Suporte para situações urgentes, todos os dias, a qualquer horário.", true],
  [Stethoscope, "Consultas veterinárias", "Avaliação clínica cuidadosa para entender as necessidades do seu pet.", false],
  [Syringe, "Vacinas essenciais", "Proteção para cães e gatos com acompanhamento profissional.", false],
  [TestTube2, "Exames laboratoriais", "Resultados para auxiliar no diagnóstico e tratamento com agilidade.", false],
  [HeartPulse, "Eletrocardiograma", "Avaliação cardíaca, check-up e apoio no pré-cirúrgico.", false],
  [Microscope, "Ultrassom", "Diagnóstico, acompanhamento gestacional e investigação clínica.", false],
  [Cross, "Internação", "Acompanhamento contínuo para pets que precisam de cuidados especiais.", false],
  [Scissors, "Cirurgias", "Procedimentos com atenção, responsabilidade e estrutura adequada.", false],
  [ShieldCheck, "Farmácia veterinária", "Suporte para continuidade do tratamento prescrito.", false],
] as const;

const faq = [
  ["A clínica funciona 24 horas?", "Sim. A Clínica Veterinária Dr. Kleber informa atendimento 24 horas todos os dias, inclusive para emergências."],
  ["Quais animais são atendidos?", "O atendimento é voltado para cães e gatos, incluindo consultas, prevenção, diagnóstico, internação e procedimentos cirúrgicos."],
  ["Quais formas de pagamento são aceitas?", "Débito, crédito, Pix e dinheiro."],
  ["Onde fica a clínica?", "Av. Cap. Júlio Bezerra, 358 - Centro, Boa Vista - RR, 69305-294."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clínica Veterinária Dr. Kleber 24h | Boa Vista - RR" },
      { name: "description", content: "Atendimento veterinário completo, 24 horas por dia, para cães e gatos em Boa Vista - RR." },
    ],
  }),
  component: ClinicHome,
});

function ClinicHome() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const closeMenu = () => setMobileOpen(false);

  return (
    <div className="pro-clinic">
      <div className="emergency-strip">
        <div><span className="live-dot" /> Emergência veterinária 24h em Boa Vista - RR</div>
        <a href={site.phone}><Phone size={13}/> (95) 98119-5702</a>
      </div>

      <header className="pro-header">
        <a href="#inicio" className="pro-logo" onClick={closeMenu}>
          <span className="logo-symbol"><HeartPulse size={21}/></span>
          <span><strong>Dr. Kleber</strong><small>CLÍNICA VETERINÁRIA <b>24H</b></small></span>
        </a>

        <nav className={mobileOpen ? "pro-nav open" : "pro-nav"}>
          <a href="#servicos" onClick={closeMenu}>Serviços</a>
          <a href="#estrutura" onClick={closeMenu}>Estrutura</a>
          <a href="#exames" onClick={closeMenu}>Exames</a>
          <a href="#cirurgia" onClick={closeMenu}>Cirurgia</a>
          <a href="#avaliacoes" onClick={closeMenu}>Avaliações</a>
          <a href="#video" onClick={closeMenu}>Vídeo</a>
          <a href="#localizacao" onClick={closeMenu}>Localização</a>
          <a href={site.instagram} target="_blank" rel="noreferrer" onClick={closeMenu}><Instagram size={14}/> Instagram</a>
        </nav>

        <a className="header-whatsapp" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? <X/> : <Menu/>}</button>
      </header>

      <main id="inicio">
        <section className="pro-hero">
          <div className="hero-content">
            <div className="status-pill"><span><Clock3 size={14}/> ABERTO 24 HORAS</span><i/> Clínica médica e cirúrgica</div>
            <h1>Atendimento veterinário completo, <em>24 horas por dia.</em></h1>
            <p>Consultas, vacinas, cirurgias, internação, exames laboratoriais, ultrassom, eletrocardiograma e emergência veterinária para cães e gatos em Boa Vista - RR.</p>
            <div className="hero-buttons">
              <a className="pro-btn primary" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Chamar no WhatsApp <ArrowRight size={16}/></a>
              <a className="pro-btn secondary" href={site.maps} target="_blank" rel="noreferrer"><MapPin size={17}/> Ver rota</a>
            </div>
            <div className="hero-proof">
              <div className="rating"><strong>4,7</strong><span>★★★★★</span><small>no Google · 233 avaliações</small></div>
              <div className="proof-divider"/>
              <div className="proof-item"><BadgeCheck/> <span><b>24h todos os dias</b><small>Cuidado quando você precisar</small></span></div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <div className="hero-image-frame"><img src={img("fachada-ampla.jpg")} alt="Fachada da Clínica Veterinária Dr. Kleber"/></div>
            <div className="hero-card emergency"><span><Zap/></span><div><b>Emergência agora?</b><small>Fale com a equipe pelo WhatsApp</small></div><ArrowRight size={15}/></div>
            <div className="hero-card trust"><div className="tiny-avatars"><img src={img("corpo-tecnico-1.jpeg")} /><img src={img("corpo-tecnico-2.jpeg")} /><img src={img("corpo-tecnico-3.jpeg")} /></div><div><b>Equipe preparada</b><small>Profissionais que cuidam do seu pet</small></div></div>
          </div>
        </section>

        <section className="trust-bar">
          <div><Clock3/><span><b>24h</b><small>todos os dias</small></span></div>
          <div><Stethoscope/><span><b>Cães & gatos</b><small>atendimento completo</small></span></div>
          <div><Microscope/><span><b>Diagnóstico</b><small>laboratório + imagem</small></span></div>
          <div><ShieldCheck/><span><b>Estrutura</b><small>médica e cirúrgica</small></span></div>
        </section>

        <section className="pro-section intro-section" id="estrutura">
          <div className="eyebrow">SOBRE A CLÍNICA</div>
          <div className="section-intro"><h2>Estrutura preparada para cuidar com <em>carinho, segurança e profissionalismo.</em></h2><p>A Clínica Veterinária Dr. Kleber 24h oferece atendimento médico e cirúrgico para cães e gatos, com suporte para consultas, prevenção, diagnóstico, internação e emergências.</p></div>
          <div className="intro-grid">
            <div className="photo-card large"><img src={img("recepcao.jpg")} alt="Recepção da clínica"/><span>Recepção acolhedora</span></div>
            <div className="intro-features">
              <div><span><UserRound/></span><div><b>Atendimento próximo</b><p>Uma recepção organizada e acolhedora para receber você e seu pet com tranquilidade.</p></div></div>
              <div><span><HeartPulse/></span><div><b>Cuidado médico e cirúrgico</b><p>Suporte para consultas, tratamentos, internação e procedimentos.</p></div></div>
              <div><span><Microscope/></span><div><b>Diagnóstico com tecnologia</b><p>Ultrassom, eletrocardiograma e laboratório para apoiar decisões clínicas.</p></div></div>
              <a className="inline-link" href="#servicos">Conheça todos os serviços <ArrowRight size={15}/></a>
            </div>
            <div className="photo-card"><img src={img("dr-kleber-consultorio.jpg")} alt="Dr. Kleber em consulta veterinária"/><span>Atendimento veterinário</span></div>
          </div>
        </section>

        <section className="services-wrap" id="servicos">
          <div className="pro-section">
            <div className="eyebrow">SERVIÇOS OFERECIDOS</div>
            <div className="section-intro centered"><h2>Cuidado completo <em>em um só lugar.</em></h2><p>Serviços focados em saúde, diagnóstico, tratamento e acompanhamento veterinário.</p></div>
            <div className="services-grid">{services.map(([Icon,title,text,urgent]) =>
              <article className={urgent ? "service-card urgent" : "service-card"} key={title}>
                <div className="service-top"><span><Icon/></span>{urgent && <small>PRIORIDADE 24H</small>}</div>
                <h3>{title}</h3><p>{text}</p>
                <a href={urgent ? site.whatsapp : "#localizacao"} target={urgent ? "_blank" : undefined} rel={urgent ? "noreferrer" : undefined}>Saiba mais <ArrowRight size={14}/></a>
              </article>
            )}</div>
          </div>
        </section>

        <section className="diagnostic-section" id="exames">
          <div className="diagnostic-copy">
            <div className="eyebrow light">DIAGNÓSTICO E ACOMPANHAMENTO</div>
            <h2>Exames que ajudam a <em>cuidar melhor.</em></h2>
            <p>Recursos de apoio para investigar, acompanhar e tomar decisões com mais segurança.</p>
            <div className="diagnostic-list">
              <div><TestTube2/><span><b>Laboratório próprio</b><small>Exames laboratoriais com agilidade; o site informa resultados em até 15 minutos.</small></span></div>
              <div><HeartPulse/><span><b>Eletrocardiograma</b><small>Check-up, avaliação cardíaca e exames pré-cirúrgicos.</small></span></div>
              <div><Microscope/><span><b>Ultrassonografia</b><small>Investigação, prevenção e acompanhamento clínico e gestacional.</small></span></div>
            </div>
            <div className="exam-tags"><span>Hemograma completo</span><span>Bioquímicos</span><span>Ultrassonografia</span><span>Eletrocardiograma</span><span>Pré-cirúrgicos</span></div>
          </div>
          <div className="diagnostic-image"><img src={img("ultrassom.jpg")} alt="Ultrassom veterinário"/><div><img src={img("eletrocardiograma.jpg")} alt="Eletrocardiograma veterinário"/><b>Tecnologia para diagnóstico</b></div></div>
        </section>

        <section className="pro-section surgery-section" id="cirurgia">
          <div className="surgery-image"><img src={img("centro-cirurgico.jpg")} alt="Centro cirúrgico veterinário"/><div><Scissors/><span><b>Centro cirúrgico</b><small>Estrutura dedicada</small></span></div></div>
          <div className="surgery-copy"><div className="eyebrow">CENTRO CIRÚRGICO</div><h2>Procedimentos com técnica, <em>monitoramento e segurança.</em></h2><p>Área dedicada para momentos delicados, com equipe preparada e suporte no pré e pós-operatório.</p><ul><li><BadgeCheck/> Procedimentos cirúrgicos veterinários</li><li><BadgeCheck/> Equipe preparada para momentos delicados</li><li><BadgeCheck/> Suporte para pré e pós-operatório</li><li><BadgeCheck/> Atendimento com responsabilidade e dedicação</li></ul><a className="pro-btn primary" href={site.whatsapp} target="_blank" rel="noreferrer">Falar com a equipe <ArrowRight size={16}/></a></div>
        </section>

        <section className="gallery-area">
          <div className="pro-section gallery-head"><div><div className="eyebrow">CONHEÇA A CLÍNICA</div><h2>Estrutura, ambiente e <em>momentos reais de cuidado.</em></h2></div><p>Fachada, recepção, equipe, atendimentos e diagnóstico em uma seleção visual da clínica.</p></div>
          <div className="gallery-grid">{photos.slice(0,12).map(([file,alt],i)=><figure className={`gallery-photo photo-${i+1}`} key={file}><img src={img(file)} alt={alt}/><figcaption>{alt}</figcaption></figure>)}</div>
        </section>

        <section className="pro-section team-section">
          <div className="team-main-photo"><img src={img("dr-kleber.jpg")} alt="Dr. Kleber, médico veterinário"/></div>
          <div className="team-content"><div className="eyebrow">NOSSOS HERÓIS · CORPO TÉCNICO</div><h2>Profissionais que cuidam do seu pet <em>todos os dias.</em></h2><p>Atendimento veterinário 24 horas para cães e gatos, com suporte em consultas, emergências, exames, internação e procedimentos cirúrgicos.</p><div className="team-avatars"><img src={img("corpo-tecnico-1.jpeg")}/><img src={img("corpo-tecnico-2.jpeg")}/><img src={img("corpo-tecnico-3.jpeg")}/><img src={img("corpo-tecnico-4.jpeg")}/><span>Equipe Dr. Kleber</span></div><div className="doctor-sign"><b>Dr. Kleber</b><small>Médico veterinário</small></div></div>
        </section>

        <section className="video-area" id="video">
          <div className="pro-section video-inner">
            <div className="video-preview"><img src={img("equipe-fachada.jpg")} alt="Equipe da clínica"/><div className="video-center"><a href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer"><Play fill="currentColor"/></a><b>Vídeo institucional</b><small>Conheça de perto a rotina da clínica</small></div></div>
            <div className="video-copy"><div className="eyebrow">VÍDEO DA CLÍNICA</div><h2>Veja de perto a rotina da <em>Clínica Dr. Kleber 24h.</em></h2><p>Conheça o atendimento, a estrutura e o cuidado diário com os pets. O vídeo institucional original continua disponível.</p><a className="pro-btn primary" href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer"><Play size={16}/> Assistir vídeo</a></div>
          </div>
        </section>

        <section className="reviews-area" id="avaliacoes">
          <div className="pro-section"><div className="reviews-head"><div className="eyebrow">CONFIANÇA DE TUTORES</div><h2>4,7 estrelas no Google <em>com 233 avaliações.</em></h2><div className="big-rating"><strong>4,7</strong><span>★★★★★</span><small>Google</small></div></div><div className="reviews-grid">
            <blockquote>“Sempre que levei meus pets quando dodóis, eles ficaram sarados. Eu confio nessa equipe.”<footer><b>Guiomar Vilela</b><span>★★★★★</span></footer></blockquote>
            <blockquote>“Profissionais de primeira, atenção com meu pet desde o primeiro momento. Excelente atendimento.”<footer><b>Yrlian Gamboa</b><span>★★★★★</span></footer></blockquote>
            <blockquote>“Meus pets sempre foram atendidos na clínica, eu confio e indico de olhos fechados.”<footer><b>Ana Carolina Macêdo</b><span>★★★★★</span></footer></blockquote>
          </div></div>
        </section>

        <section className="emergency-cta"><div><span><Zap/> ATENDIMENTO 24 HORAS</span><h2>Emergências não têm hora para acontecer.</h2><p>A clínica funciona 24 horas para acolher seu pet em momentos de urgência, com estrutura, atenção e cuidado profissional.</p></div><div className="cta-buttons"><a className="pro-btn light" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp 24h</a><a className="pro-btn outline-light" href={site.phone}><Phone/> (95) 98119-5702</a></div></section>

        <section className="pro-section faq-section"><div><div className="eyebrow">DÚVIDAS FREQUENTES</div><h2>Informações <em>importantes.</em></h2><p>Algumas respostas rápidas antes da sua visita.</p></div><div className="faq-list">{faq.map(([q,a],i)=><button className={faqOpen===i ? "faq-row active":"faq-row"} key={q} onClick={()=>setFaqOpen(faqOpen===i?null:i)}><span><b>{q}</b>{faqOpen===i && <small>{a}</small>}</span><ChevronDown/></button>)}</div></section>

        <section className="location-area" id="localizacao"><div className="pro-section location-inner"><div><div className="eyebrow">LOCALIZAÇÃO</div><h2>Estamos no Centro de <em>Boa Vista - RR.</em></h2><p><MapPin/> Av. Cap. Júlio Bezerra, 358 - Centro<br/>Boa Vista - RR, 69305-294</p><div className="location-buttons"><a className="pro-btn primary" href={site.maps} target="_blank" rel="noreferrer"><MapPin/> Abrir no Google Maps</a><a className="pro-btn secondary" href={site.phone}><Phone/> Ligar agora</a></div></div><div className="map-card"><MapPin size={38}/><b>Clínica Veterinária Dr. Kleber</b><small>Av. Cap. Júlio Bezerra, 358 · Centro</small><a href={site.maps} target="_blank" rel="noreferrer">Traçar rota →</a></div></div></section>
      </main>

      <footer className="pro-footer"><div className="pro-section footer-inner"><div className="footer-brand"><span className="logo-symbol"><HeartPulse size={20}/></span><div><b>Clínica Veterinária Dr. Kleber 24h</b><small>Cuidado profissional para o seu melhor amigo.</small></div></div><div className="footer-links"><a href={site.instagram} target="_blank" rel="noreferrer"><Instagram/> @clinicaveterinariadrkleber</a><a href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a><a href={site.phone}><Phone/> (95) 98119-5702</a></div><div className="footer-copy">© {new Date().getFullYear()} Clínica Veterinária Dr. Kleber 24h · Boa Vista - RR</div></div></footer>
      <a className="floating-wa" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle/><span>WhatsApp</span></a>
    </div>
  );
}
