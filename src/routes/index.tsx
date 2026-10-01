import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, BadgeCheck, ChevronDown, Clock3, Cross, HeartPulse,
  Instagram, MapPin, Menu, MessageCircle, Microscope, Phone, Play,
  Scissors, ShieldCheck, Stethoscope, Syringe, TestTube2, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const site = {
  whatsapp: "https://wa.me/5595981195702",
  phone: "tel:+5595981195702",
  maps: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Veterin%C3%A1ria+Dr+Kleber%2C+Av.+Cap.+J%C3%BAlio+Bezerra%2C+358%2C+Boa+Vista+-+RR",
  instagram: "https://www.instagram.com/clinicaveterinariadrkleber/",
  media: "https://clinicadrkleber.netlify.app/assets/uploads/",
};

const photos: ReadonlyArray<readonly [string, string]> = [
  ["fachada-ampla.jpg", "Fachada ampla da clínica"],
  ["entrada.jpg", "Entrada da Clínica Veterinária Dr. Kleber"],
  ["recepcao.jpg", "Recepção da clínica"],
  ["fachada-pet.jpg", "Fachada da clínica com pet"],
  ["dr-kleber-filhote.jpg", "Dr. Kleber com filhote"],
  ["dr-kleber-atendendo-cachorro.jpg", "Dr. Kleber atendendo cachorro"],
  ["dr-kleber-consultorio.jpg", "Dr. Kleber em consulta veterinária"],
  ["atendimento-gato-1.jpg", "Atendimento veterinário com gato"],
  ["equipe-fachada.jpg", "Equipe da Clínica Veterinária Dr. Kleber"],
  ["veterinaria-gato.jpg", "Veterinária cuidando de gato"],
  ["gato-recuperacao.jpg", "Gato em recuperação"],
  ["eletrocardiograma.jpg", "Eletrocardiograma veterinário"],
  ["laboratorio-idexx.jpg", "Laboratório veterinário IDEXX"],
  ["ultrassom.jpg", "Ultrassom veterinário"],
  ["centro-cirurgico.jpg", "Centro cirúrgico veterinário"],
  ["equipe-procedimento.jpg", "Equipe em procedimento cirúrgico"],
  ["equipe-centro-cirurgico.jpg", "Equipe no centro cirúrgico"],
  ["procedimento-centro-cirurgico.jpg", "Procedimento no centro cirúrgico"],
  ["dr-kleber.jpg", "Dr. Kleber, médico veterinário"],
];

const teamPhotos = ["corpo-tecnico-1.jpeg", "corpo-tecnico-2.jpeg", "corpo-tecnico-3.jpeg", "corpo-tecnico-4.jpeg"];
const img = (name: string) => `${site.media}${name}`;

const services = [
  [Zap, "Emergência 24h", "Acolhimento para situações urgentes, todos os dias e em qualquer horário."],
  [Stethoscope, "Consultas", "Avaliação clínica cuidadosa para cães e gatos."],
  [Syringe, "Vacinação", "Proteção e prevenção com acompanhamento profissional."],
  [TestTube2, "Laboratório", "Exames para apoiar diagnósticos com agilidade."],
  [HeartPulse, "Eletrocardiograma", "Avaliação cardíaca, check-up e pré-cirúrgico."],
  [Microscope, "Ultrassom", "Investigação e acompanhamento clínico e gestacional."],
  [Cross, "Internação", "Acompanhamento contínuo para cuidados especiais."],
  [Scissors, "Cirurgias", "Procedimentos com estrutura e equipe preparada."],
  [ShieldCheck, "Farmácia", "Apoio para a continuidade do tratamento prescrito."],
] as const;

const faqs = [
  ["A clínica funciona 24 horas?", "Sim. O atendimento funciona 24 horas todos os dias, inclusive para emergências."],
  ["Quais animais são atendidos?", "A clínica atende cães e gatos em consultas, prevenção, diagnóstico, internação e cirurgias."],
  ["Quais formas de pagamento são aceitas?", "Débito, crédito, Pix e dinheiro."],
  ["Onde fica a clínica?", "Av. Cap. Júlio Bezerra, 358 — Centro, Boa Vista — RR, 69305-294."],
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clínica Veterinária Dr. Kleber 24h | Boa Vista - RR" },
      { name: "description", content: "Clínica veterinária 24 horas em Boa Vista para cães e gatos. Emergência, consultas, vacinas, exames, internação e cirurgias." },
      { property: "og:title", content: "Clínica Veterinária Dr. Kleber 24h | Boa Vista - RR" },
      { property: "og:description", content: "Atendimento veterinário completo 24 horas, todos os dias, em Boa Vista - RR." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClinicHome,
});

function ClinicHome() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const closeMenu = () => setMobileOpen(false);

  return (
    <div className="clinic-site">
      <div className="clinic-alert">
        <span><i /> Plantão veterinário 24 horas</span>
        <a href={site.phone}><Phone /> (95) 98119-5702</a>
      </div>

      <header className="clinic-header">
        <a className="clinic-brand" href="#inicio" onClick={closeMenu} aria-label="Clínica Veterinária Dr. Kleber">
          <span className="brand-mark"><HeartPulse /></span>
          <span><strong>Dr. Kleber</strong><small>CLÍNICA VETERINÁRIA · 24H</small></span>
        </a>
        <nav className={mobileOpen ? "clinic-nav is-open" : "clinic-nav"} aria-label="Navegação principal">
          <a href="#estrutura" onClick={closeMenu}>A clínica</a>
          <a href="#servicos" onClick={closeMenu}>Serviços</a>
          <a href="#diagnostico" onClick={closeMenu}>Diagnóstico</a>
          <a href="#galeria" onClick={closeMenu}>Galeria</a>
          <a href="#avaliacoes" onClick={closeMenu}>Avaliações</a>
          <a href="#localizacao" onClick={closeMenu}>Localização</a>
        </nav>
        <a className="header-action" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
        <Button variant="ghost" size="icon" className="clinic-menu" onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </header>

      <main id="inicio">
        <section className="clinic-hero">
          <img src={img("fachada-ampla.jpg")} alt="Fachada da Clínica Veterinária Dr. Kleber em Boa Vista" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <span className="availability"><i /> ABERTO 24 HORAS · TODOS OS DIAS</span>
            <h1>Clínica Veterinária<br /><em>Dr. Kleber 24h</em></h1>
            <p>Cuidado completo para cães e gatos em Boa Vista, da prevenção à emergência.</p>
            <div className="hero-actions">
              <a className="clinic-button primary" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> Emergência no WhatsApp <ArrowRight /></a>
              <a className="clinic-button glass" href={site.maps} target="_blank" rel="noreferrer"><MapPin /> Como chegar</a>
            </div>
          </div>
          <div className="hero-rating"><strong>4,7</strong><span>★★★★★</span><small>233 avaliações no Google</small></div>
          <a className="hero-phone" href={site.phone}><Phone /><span><small>PLANTÃO 24H</small><strong>(95) 98119-5702</strong></span></a>
        </section>

        <section className="quick-actions" aria-label="Ações rápidas">
          <a href={site.phone}><span className="quick-icon urgent"><Phone /></span><span><small>EMERGÊNCIA</small><strong>Ligar agora</strong></span><ArrowRight /></a>
          <a href={site.maps} target="_blank" rel="noreferrer"><span className="quick-icon"><MapPin /></span><span><small>LOCALIZAÇÃO</small><strong>Ver rota</strong></span><ArrowRight /></a>
          <a href="#servicos"><span className="quick-icon"><Stethoscope /></span><span><small>CUIDADO COMPLETO</small><strong>Ver serviços</strong></span><ArrowRight /></a>
        </section>

        <section className="clinic-section about" id="estrutura">
          <div className="section-heading">
            <span className="kicker">ESTRUTURA E ACOLHIMENTO</span>
            <h2>Precisão no cuidado.<br /><em>Presença em cada momento.</em></h2>
            <p>Atendimento médico e cirúrgico para cães e gatos, com suporte para prevenção, diagnóstico, internação e emergências.</p>
          </div>
          <div className="about-grid">
            <figure className="image-panel main"><img src={img("recepcao.jpg")} alt="Recepção da clínica" /><figcaption>Recepção acolhedora</figcaption></figure>
            <div className="about-points">
              <article><span>01</span><div><h3>Atendimento próximo</h3><p>Escuta, orientação e tranquilidade para você e seu pet.</p></div></article>
              <article><span>02</span><div><h3>Estrutura completa</h3><p>Consultas, exames, internação e centro cirúrgico em um só lugar.</p></div></article>
              <article><span>03</span><div><h3>Equipe preparada</h3><p>Profissionais presentes todos os dias, a qualquer horário.</p></div></article>
            </div>
            <figure className="image-panel detail"><img src={img("dr-kleber-consultorio.jpg")} alt="Dr. Kleber em atendimento" /><figcaption>Atendimento veterinário</figcaption></figure>
          </div>
        </section>

        <section className="services-band" id="servicos">
          <div className="clinic-section">
            <div className="section-heading compact"><span className="kicker">NOSSOS SERVIÇOS</span><h2>Cuidado completo,<br /><em>em um só lugar.</em></h2><p>Uma estrutura preparada para acompanhar a saúde do seu pet em cada fase.</p></div>
            <div className="services-list">
              {services.map(([Icon, title, description], index) => (
                <a href={index === 0 ? site.whatsapp : "#localizacao"} className={index === 0 ? "service-row priority" : "service-row"} key={title} target={index === 0 ? "_blank" : undefined} rel={index === 0 ? "noreferrer" : undefined}>
                  <span className="service-number">{String(index + 1).padStart(2, "0")}</span><span className="service-icon"><Icon /></span><span className="service-copy"><strong>{title}</strong><small>{description}</small></span>{index === 0 && <b>24H</b>}<ArrowRight />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="diagnostics" id="diagnostico">
          <div className="diagnostics-copy"><span className="kicker light">DIAGNÓSTICO E ACOMPANHAMENTO</span><h2>Respostas que ajudam a <em>cuidar melhor.</em></h2><p>Recursos de apoio para investigar, acompanhar e tomar decisões clínicas com segurança.</p>
            <div className="diagnostics-items">
              <div><TestTube2 /><span><strong>Laboratório próprio</strong><small>Exames laboratoriais com agilidade.</small></span></div>
              <div><HeartPulse /><span><strong>Eletrocardiograma</strong><small>Check-up, avaliação cardíaca e pré-cirúrgico.</small></span></div>
              <div><Microscope /><span><strong>Ultrassonografia</strong><small>Investigação e acompanhamento clínico.</small></span></div>
            </div>
          </div>
          <div className="diagnostics-visual"><img src={img("ultrassom.jpg")} alt="Exame de ultrassom veterinário" /><div><img src={img("laboratorio-idexx.jpg")} alt="Laboratório veterinário" /><span>Diagnóstico no mesmo lugar</span></div></div>
        </section>

        <section className="clinic-section surgery">
          <div className="surgery-visual"><img src={img("centro-cirurgico.jpg")} alt="Centro cirúrgico da clínica" /><span><Scissors /> Centro cirúrgico</span></div>
          <div className="surgery-copy"><span className="kicker">CUIDADO CIRÚRGICO</span><h2>Técnica, monitoramento e <em>segurança.</em></h2><p>Uma área dedicada aos momentos delicados, com suporte no pré e pós-operatório.</p><ul><li><BadgeCheck /> Procedimentos cirúrgicos veterinários</li><li><BadgeCheck /> Equipe preparada</li><li><BadgeCheck /> Suporte antes e depois da cirurgia</li><li><BadgeCheck /> Atendimento responsável e dedicado</li></ul><a className="clinic-button primary" href={site.whatsapp} target="_blank" rel="noreferrer">Falar com a equipe <ArrowRight /></a></div>
        </section>

        <section className="gallery-band" id="galeria">
          <div className="clinic-section gallery-heading"><span className="kicker">A CLÍNICA POR DENTRO</span><h2>Ambientes e momentos<br /><em>reais de cuidado.</em></h2><p>Todas as imagens da clínica, da equipe e dos atendimentos reunidas em uma galeria completa.</p></div>
          <div className="gallery-grid">{photos.map(([file, alt], index) => <figure className={`gallery-item gallery-${index + 1}`} key={file}><img src={img(file)} alt={alt} loading={index > 5 ? "lazy" : undefined} /><figcaption>{alt}</figcaption></figure>)}</div>
        </section>

        <section className="clinic-section team">
          <div className="team-photo"><img src={img("dr-kleber.jpg")} alt="Dr. Kleber, médico veterinário" /></div>
          <div className="team-copy"><span className="kicker">CORPO TÉCNICO</span><h2>Profissionais que cuidam do seu pet <em>todos os dias.</em></h2><p>Uma equipe presente em consultas, emergências, exames, internação e procedimentos cirúrgicos.</p><div className="team-faces">{teamPhotos.map((file, index) => <img src={img(file)} alt={`Profissional da equipe Dr. Kleber ${index + 1}`} key={file} />)}<span>Equipe<br /><strong>Dr. Kleber</strong></span></div></div>
        </section>

        <section className="video-band" id="video">
          <div className="video-image"><img src={img("equipe-fachada.jpg")} alt="Equipe da Clínica Veterinária Dr. Kleber" /><div><a href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer" aria-label="Assistir vídeo institucional"><Play /></a><span>ASSISTA AO VÍDEO</span></div></div>
          <div className="video-copy"><span className="kicker light">NOSSA ROTINA</span><h2>Conheça quem está pronto para <em>cuidar.</em></h2><p>Veja de perto a estrutura, o atendimento e o cuidado diário da Clínica Dr. Kleber 24h.</p><a className="clinic-button light" href="https://clinicadrkleber.netlify.app/#video" target="_blank" rel="noreferrer"><Play /> Assistir ao vídeo</a></div>
        </section>

        <section className="reviews" id="avaliacoes">
          <div className="clinic-section"><div className="reviews-heading"><span className="kicker">CONFIANÇA DE TUTORES</span><h2>Quem cuida, <em>recomenda.</em></h2><div className="score"><strong>4,7</strong><span>★★★★★</span><small>233 avaliações no Google</small></div></div>
            <div className="review-list"><blockquote>“Sempre que levei meus pets quando dodóis, eles ficaram sarados. Eu confio nessa equipe.”<footer><strong>Guiomar Vilela</strong><span>★★★★★</span></footer></blockquote><blockquote>“Profissionais de primeira, atenção com meu pet desde o primeiro momento. Excelente atendimento.”<footer><strong>Yrlian Gamboa</strong><span>★★★★★</span></footer></blockquote><blockquote>“Meus pets sempre foram atendidos na clínica, eu confio e indico de olhos fechados.”<footer><strong>Ana Carolina Macêdo</strong><span>★★★★★</span></footer></blockquote></div>
          </div>
        </section>

        <section className="emergency-callout"><div><span><i /> PLANTÃO ATIVO · 24 HORAS</span><h2>Emergências não têm hora para acontecer.</h2><p>Quando seu pet precisar, a Clínica Dr. Kleber estará pronta para acolher.</p></div><div><a className="clinic-button light" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp 24h</a><a className="clinic-button outline" href={site.phone}><Phone /> Ligar agora</a></div></section>

        <section className="clinic-section faq"><div className="faq-heading"><span className="kicker">DÚVIDAS FREQUENTES</span><h2>Informações <em>importantes.</em></h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <Button variant="ghost" className={faqOpen === index ? "faq-button is-open" : "faq-button"} onClick={() => setFaqOpen(faqOpen === index ? null : index)} key={question}><span><strong>{question}</strong>{faqOpen === index && <small>{answer}</small>}</span><ChevronDown /></Button>)}</div></section>

        <section className="location" id="localizacao"><div className="clinic-section location-inner"><div><span className="kicker">LOCALIZAÇÃO</span><h2>No Centro de <em>Boa Vista.</em></h2><p><MapPin /> Av. Cap. Júlio Bezerra, 358<br />Centro · Boa Vista — RR · 69305-294</p><div><a className="clinic-button primary" href={site.maps} target="_blank" rel="noreferrer"><MapPin /> Abrir no Google Maps</a><a className="clinic-button secondary" href={site.phone}><Phone /> (95) 98119-5702</a></div></div><a className="map-visual" href={site.maps} target="_blank" rel="noreferrer"><MapPin /><strong>Clínica Veterinária<br />Dr. Kleber 24h</strong><small>Toque para traçar a rota</small><ArrowRight /></a></div></section>
      </main>

      <footer className="clinic-footer"><div className="clinic-section footer-inner"><div className="clinic-brand inverse"><span className="brand-mark"><HeartPulse /></span><span><strong>Dr. Kleber</strong><small>CLÍNICA VETERINÁRIA · 24H</small></span></div><p>Cuidado profissional para o seu melhor amigo, todos os dias e a qualquer hora.</p><div className="footer-links"><a href={site.instagram} target="_blank" rel="noreferrer"><Instagram /> Instagram</a><a href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a><a href={site.phone}><Phone /> Telefone</a></div><small>© {new Date().getFullYear()} Clínica Veterinária Dr. Kleber 24h · Boa Vista — RR</small></div></footer>

      <a className="floating-contact" href={site.whatsapp} target="_blank" rel="noreferrer"><span><i /> PLANTÃO 24H</span><strong><MessageCircle /> Chamar agora</strong></a>
    </div>
  );
}
