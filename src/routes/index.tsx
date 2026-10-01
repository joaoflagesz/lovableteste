import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, BadgeCheck, CalendarCheck, ChevronDown, Clock3, Cross, HeartPulse,
  Instagram, MapPin, Menu, MessageCircle, Microscope, Phone, Play, Scissors,
  ShieldCheck, Stethoscope, Syringe, TestTube2, UserRound, X, Zap
} from "lucide-react";
import { useState } from "react";

const MEDIA = [
  ["fachada-ampla.jpg","Fachada da clínica"],
  ["fachada-entrada.jpg","Entrada da clínica"],
  ["recepcao.jpg","Recepção"],
  ["fachada-pet.jpg","Fachada com pet"],
  ["dr-kleber-filhote.jpg","Dr. Kleber com filhote"],
  ["dr-kleber-consulta-cachorro.jpg","Dr. Kleber atendendo cachorro"],
  ["dr-kleber-consultorio.jpg","Consulta veterinária"],
  ["atendimento-gato-1.jpg","Atendimento com gato"],
  ["equipe-fachada.jpg","Equipe da clínica"],
  ["atendimento-gato-2.jpg","Veterinária cuidando de gato"],
  ["gato-recuperacao.jpg","Gato em recuperação"],
  ["laboratorio-idexx.jpg","Laboratório IDEXX"],
  ["centro-cirurgico-procedimento.jpg","Centro cirúrgico"],
  ["centro-cirurgico-equipe.jpg","Equipe no centro cirúrgico"],
  ["equipe-centro-cirurgico.jpg","Procedimento cirúrgico"],
  ["dr-kleber.jpg","Dr. Kleber"],
];

const IMG = (file: string) => `https://clinicadrkleber.netlify.app/assets/uploads/${file}`;
const CROPPED = (file: string) => `https://clinicadrkleber.netlify.app/assets/cropped/${file}`;
const WHATSAPP = "https://wa.me/5595981195702";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Veterin%C3%A1ria+Dr+Kleber%2C+Av.+Cap.+J%C3%BAlio+Bezerra%2C+358%2C+Boa+Vista+-+RR";
const INSTAGRAM = "https://www.instagram.com/clinicaveterinariadrkleber/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clínica Veterinária Dr. Kleber 24h | Boa Vista - RR" },
      { name: "description", content: "Atendimento veterinário 24 horas em Boa Vista - RR para cães e gatos. Consultas, emergência, vacinas, exames, internação e cirurgias." },
      { property: "og:title", content: "Clínica Veterinária Dr. Kleber 24h" },
      { property: "og:description", content: "Cuidado veterinário completo, 24 horas por dia, em Boa Vista - RR." },
    ],
  }),
  component: ClinicHome,
});

function ClinicHome() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);

  const services = [
    [Zap, "Emergência 24h", "Suporte para situações urgentes, todos os dias, a qualquer horário."],
    [Stethoscope, "Consultas veterinárias", "Avaliação clínica cuidadosa para entender as necessidades do seu pet."],
    [Syringe, "Vacinas essenciais", "Proteção para cães e gatos com acompanhamento profissional."],
    [TestTube2, "Exames laboratoriais", "Resultados precisos para auxiliar no diagnóstico e tratamento, com agilidade."],
    [HeartPulse, "Eletrocardiograma", "Exame indolor para avaliação cardíaca e apoio no pré-cirúrgico."],
    [Microscope, "Ultrassom", "Tecnologia para diagnóstico, acompanhamento gestacional e check-up."],
    [Cross, "Internação", "Acompanhamento contínuo para pets que precisam de cuidados especiais."],
    [Scissors, "Cirurgias seguras", "Procedimentos com atenção, responsabilidade e estrutura adequada."],
    [ShieldCheck, "Farmácia veterinária", "Suporte com medicamentos veterinários para continuidade do tratamento."],
  ] as const;

  const faqs = [
    ["A clínica funciona 24 horas?", "Sim. A Clínica Veterinária Dr. Kleber informa atendimento 24 horas todos os dias, inclusive para emergências."],
    ["Quais animais são atendidos?", "O atendimento é voltado para cães e gatos, incluindo consultas, prevenção, diagnóstico, internação e procedimentos cirúrgicos."],
    ["Quais formas de pagamento são aceitas?", "O site informa pagamento em débito, crédito, Pix e dinheiro."],
    ["Onde fica a clínica?", "Av. Cap. Júlio Bezerra, 358 - Centro, Boa Vista - RR, 69305-294."],
  ];

  return (
    <div className="clinic-page">
      <div className="emergency-bar"><div><span className="pulse-dot" /> Emergência veterinária 24h em Boa Vista - RR</div><a href="tel:+5595981195702">Ligar agora: (95) 98119-5702</a></div>

      <header className="site-header">
        <a className="brand" href="#inicio" onClick={() => setMenu(false)}>
          <span className="brand-mark"><HeartPulse size={21} /></span>
          <span><b>Dr. Kleber</b><small>CLÍNICA VETERINÁRIA 24H</small></span>
        </a>
        <nav className={menu ? "nav-open" : ""}>
          {["servicos","estrutura","exames","cirurgia","avaliacoes","video","localizacao"].map((id, i) =>
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{["Serviços","Estrutura","Exames","Cirurgia","Avaliações","Vídeo","Localização"][i]}</a>
          )}
          <a className="nav-instagram" href={INSTAGRAM} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a>
        </nav>
        <a className="header-cta" href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>
        <button className="menu-button" aria-label="Abrir menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span><Clock3 size={14}/> ABERTO 24 HORAS</span><em>•</em> Clínica médica e cirúrgica</div>
            <h1>Seu pet merece cuidado <span>de verdade.</span><br/>A qualquer hora.</h1>
            <p>Atendimento veterinário completo para cães e gatos em Boa Vista. Emergência, consultas, exames, internação e cirurgia em um só lugar.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Falar com a clínica <ArrowRight size={17}/></a>
              <a className="button button-ghost" href={MAPS} target="_blank" rel="noreferrer"><MapPin size={17}/> Ver localização</a>
            </div>
            <div className="hero-trust"><div className="stars">★★★★★</div><div><b>4,7</b> no Google <span>·</span> <b>233</b> avaliações</div><i></i><div><BadgeCheck size={17}/> Atendimento 24h</div></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image"><img src={IMG("fachada-ampla.jpg")} alt="Fachada da Clínica Veterinária Dr. Kleber" /></div>
            <div className="floating-card floating-top"><span className="mini-icon"><Zap/></span><div><b>Emergência 24h</b><small>Estamos aqui quando você precisa</small></div></div>
            <div className="floating-card floating-bottom"><div className="avatar-stack"><img src={IMG("corpo-tecnico-1.jpeg")} /><img src={IMG("dr-kleber.jpg")} /><img src={IMG("corpo-tecnico-2.jpeg")} /></div><div><b>Equipe preparada</b><small>Cuidado profissional e humano</small></div></div>
          </div>
        </section>

        <section className="quick-stats">
          <div><Clock3/><span><b>24h</b><small>todos os dias</small></span></div>
          <div><Stethoscope/><span><b>Cães & gatos</b><small>atendimento completo</small></span></div>
          <div><Microscope/><span><b>Diagnóstico</b><small>laboratório + imagem</small></span></div>
          <div><ShieldCheck/><span><b>Estrutura</b><small>médica e cirúrgica</small></span></div>
        </section>

        <section className="section about" id="estrutura">
          <div className="section-label">SOBRE A CLÍNICA</div>
          <div className="section-heading"><h2>Uma estrutura preparada para <span>cuidar com carinho.</span></h2><p>A Clínica Veterinária Dr. Kleber 24h oferece atendimento médico e cirúrgico para cães e gatos, com suporte para prevenção, diagnóstico, internação e emergências.</p></div>
          <div className="about-grid">
            <div className="about-photo tall"><img src={IMG("recepcao.jpg")} alt="Recepção da clínica" /></div>
            <div className="about-copy"><div className="feature-line"><span><UserRound/></span><div><b>Atendimento próximo</b><p>Recepção organizada e acolhedora para receber você e seu pet com tranquilidade.</p></div></div><div className="feature-line"><span><HeartPulse/></span><div><b>Cuidado médico e cirúrgico</b><p>Equipe e estrutura para consultas, tratamentos, internação e procedimentos.</p></div></div><div className="feature-line"><span><Microscope/></span><div><b>Diagnóstico com tecnologia</b><p>Ultrassom, eletrocardiograma e laboratório para apoiar decisões clínicas.</p></div></div><a className="text-link" href="#servicos">Conheça todos os serviços <ArrowRight size={16}/></a></div>
            <div className="about-photo"><img src={IMG("dr-kleber-consulta-cachorro.jpg")} alt="Dr. Kleber atendendo cachorro" /></div>
          </div>
        </section>

        <section className="section services-section" id="servicos">
          <div className="section-label">CUIDADO COMPLETO</div>
          <div className="section-heading centered"><h2>Tudo que seu pet precisa, <span>em um só lugar.</span></h2><p>Serviços focados em saúde, diagnóstico, tratamento e acompanhamento veterinário.</p></div>
          <div className="service-grid">{services.map(([Icon,title,text]) => <article className="service-card" key={title}><div className="service-icon"><Icon size={21}/></div><h3>{title}</h3><p>{text}</p><a href={title === "Emergência 24h" ? WHATSAPP : "#localizacao"} target={title === "Emergência 24h" ? "_blank" : undefined} rel={title === "Emergência 24h" ? "noreferrer" : undefined}>Saiba mais <ArrowRight size={14}/></a></article>)}</div>
        </section>

        <section className="split-band" id="exames">
          <div className="split-content"><div className="section-label">DIAGNÓSTICO</div><h2>Exames que ajudam a <span>cuidar melhor.</span></h2><p>Recursos de apoio para investigar, acompanhar e tomar decisões com mais segurança.</p><div className="exam-list"><div><TestTube2/><span><b>Laboratório próprio</b><small>Exames laboratoriais com agilidade; o site informa resultados em até 15 minutos.</small></span></div><div><HeartPulse/><span><b>Eletrocardiograma</b><small>Check-up, avaliação cardíaca e exames pré-cirúrgicos.</small></span></div><div><Microscope/><span><b>Ultrassonografia</b><small>Investigação, prevenção e acompanhamento clínico e gestacional.</small></span></div></div><div className="tags"><span>Hemograma completo</span><span>Bioquímicos</span><span>Ultrassonografia</span><span>Eletrocardiograma</span><span>Pré-cirúrgicos</span></div></div>
          <div className="diagnostic-visual"><img src={CROPPED("ultrassom.jpg")} alt="Ultrassom veterinário" /><div className="diagnostic-inset"><img src={CROPPED("eletrocardiograma.jpg")} alt="Eletrocardiograma veterinário" /><span>tecnologia para diagnóstico</span></div></div>
        </section>

        <section className="section surgery" id="cirurgia">
          <div className="surgery-media"><img src={IMG("centro-cirurgico-procedimento.jpg")} alt="Centro cirúrgico veterinário" /><div className="media-badge"><Scissors/><span><b>Centro cirúrgico</b><small>Estrutura dedicada</small></span></div></div>
          <div className="surgery-copy"><div className="section-label">CENTRO CIRÚRGICO</div><h2>Procedimentos com técnica, <span>monitoramento e segurança.</span></h2><p>Uma área dedicada para momentos delicados, com equipe preparada e suporte no pré e pós-operatório.</p><ul><li><BadgeCheck/> Procedimentos cirúrgicos veterinários</li><li><BadgeCheck/> Equipe preparada para momentos delicados</li><li><BadgeCheck/> Suporte para pré e pós-operatório</li><li><BadgeCheck/> Atendimento com responsabilidade e dedicação</li></ul><a className="button button-primary" href={WHATSAPP} target="_blank" rel="noreferrer">Falar com a equipe <ArrowRight size={17}/></a></div>
        </section>

        <section className="gallery-section">
          <div className="section gallery-heading"><div><div className="section-label">POR DENTRO</div><h2>Conheça a clínica <span>de perto.</span></h2></div><p>Fachada, recepção, equipe, atendimentos e estrutura real da Clínica Veterinária Dr. Kleber.</p></div>
          <div className="gallery-grid">{MEDIA.map(([file,alt],i)=><div className={`gallery-item g${i+1}`} key={file}><img src={IMG(file)} alt={alt}/><span>{alt}</span></div>)}</div>
        </section>

        <section className="section team-section">
          <div className="team-photo"><img src={IMG("dr-kleber.jpg")} alt="Dr. Kleber, médico veterinário" /></div>
          <div className="team-copy"><div className="section-label">CORPO TÉCNICO</div><h2>Quem cuida do seu pet <span>quando você mais precisa.</span></h2><p>Atendimento veterinário 24 horas para cães e gatos, com suporte em consultas, emergências, exames, internação e procedimentos cirúrgicos.</p><div className="team-mini"><img src={IMG("corpo-tecnico-1.jpeg")}/><img src={IMG("corpo-tecnico-2.jpeg")}/><img src={IMG("corpo-tecnico-3.jpeg")}/><span>+ equipe</span></div><b className="signature">Dr. Kleber <small>Médico veterinário</small></b></div>
        </section>

        <section className="video-section" id="video">
          <div className="video-card">
            <img src={IMG("equipe-fachada.jpg")} alt="Equipe da Clínica Veterinária Dr. Kleber" />
            <div className="video-overlay"><a href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer" className="play-button"><Play fill="currentColor"/></a><span>Vídeo institucional</span><small>Conheça de perto a rotina da clínica</small></div>
          </div>
          <div className="video-copy"><div className="section-label">VÍDEO INSTITUCIONAL</div><h2>Veja de perto a rotina da <span>Clínica Dr. Kleber 24h.</span></h2><p>Conheça o atendimento, a estrutura e o cuidado diário com os pets. O vídeo institucional está disponível na versão original da clínica.</p><a className="button button-primary" href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer"><Play size={17}/> Assistir vídeo <ArrowRight size={17}/></a></div>
        </section>

        <section className="reviews" id="avaliacoes">
          <div className="section-label">CONFIANÇA DE TUTORES</div><h2>4,7 estrelas no Google <span>com 233 avaliações.</span></h2>
          <div className="review-grid"><blockquote>“Sempre que levei meus pets quando dodóis, eles ficaram sarados. Eu confio nessa equipe.”<footer><b>Guiomar Vilela</b><span>★★★★★</span></footer></blockquote><blockquote>“Profissionais de primeira, atenção com meu pet desde o primeiro momento. Excelente atendimento.”<footer><b>Yrlian Gamboa</b><span>★★★★★</span></footer></blockquote><blockquote>“Meus pets sempre foram atendidos na clínica, eu confio e indico de olhos fechados.”<footer><b>Ana Carolina Macêdo</b><span>★★★★★</span></footer></blockquote></div>
        </section>

        <section className="emergency-cta"><div><span className="eyebrow-light"><Zap size={14}/> ATENDIMENTO 24 HORAS</span><h2>Emergência não espera.<br/><span>Conte com a gente.</span></h2><p>Se o seu pet precisa de atendimento agora, fale diretamente com a clínica.</p></div><div className="cta-actions"><a className="button button-light" href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp 24h</a><a className="button button-outline-light" href="tel:+5595981195702"><Phone/> (95) 98119-5702</a></div></section>

        <section className="section faq-section"><div><div className="section-label">DÚVIDAS</div><h2>Informações <span>importantes.</span></h2><p>Algumas respostas rápidas antes da sua visita.</p></div><div className="faq-list">{faqs.map(([q,a],i)=><button className={openFaq===i ? "faq active":"faq"} key={q} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span><b>{q}</b>{openFaq===i && <small>{a}</small>}</span><ChevronDown/></button>)}</div></section>

        <section className="location" id="localizacao"><div className="location-card"><div><div className="section-label">LOCALIZAÇÃO</div><h2>Estamos no Centro<br/><span>de Boa Vista - RR.</span></h2><p><MapPin/> Av. Cap. Júlio Bezerra, 358 - Centro<br/>Boa Vista - RR, 69305-294</p><div className="location-actions"><a className="button button-primary" href={MAPS} target="_blank" rel="noreferrer"><MapPin/> Abrir no Google Maps</a><a className="button button-ghost" href="tel:+5595981195702"><Phone/> Ligar agora</a></div></div><div className="map-placeholder"><MapPin size={42}/><b>Clínica Veterinária Dr. Kleber</b><small>Av. Cap. Júlio Bezerra, 358</small><a href={MAPS} target="_blank" rel="noreferrer">Ver rota →</a></div></div></section>
      </main>

      <footer className="footer"><div className="footer-brand"><span className="brand-mark"><HeartPulse size={20}/></span><div><b>Clínica Veterinária Dr. Kleber 24h</b><small>Cuidado profissional para o seu melhor amigo.</small></div></div><div className="footer-links"><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Instagram/> @clinicaveterinariadrkleber</a><a href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp</a><a href="tel:+5595981195702"><Phone/> (95) 98119-5702</a></div><div className="footer-bottom">© {new Date().getFullYear()} Clínica Veterinária Dr. Kleber 24h · Boa Vista - RR</div></footer>
      <a className="floating-whatsapp" href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle/><span>WhatsApp</span></a>
    </div>
  );
}
