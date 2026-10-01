import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, MessageCircle, Phone, Zap } from "lucide-react";

const whatsapp = "https://wa.me/5595981195702?text=" + encodeURIComponent("Olá, preciso de atendimento veterinário para meu pet. Gostaria de saber como proceder.");
const phone = "tel:+5595981195702";
const maps = "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica+Veterin%C3%A1ria+Dr+Kleber%2C+Av.+Cap.+J%C3%BAlio+Bezerra%2C+358%2C+Boa+Vista+-+RR";

export const Route = createFileRoute("/emergencia")({
  head: () => ({
    meta: [
      { title: "Emergência Veterinária 24h | Clínica Dr. Kleber — Boa Vista" },
      { name: "description", content: "Página de contato rápido da Clínica Veterinária Dr. Kleber 24h em Boa Vista - RR." },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://clinicadrkleber.netlify.app/emergencia" }],
  }),
  component: EmergencyPage,
});

function EmergencyPage() {
  return <main className="emergency-page">
    <div className="emergency-page-top"><Link to="/"><ArrowLeft /> Voltar ao site</Link><span><i /> ATENDIMENTO 24 HORAS</span></div>
    <section className="emergency-page-hero">
      <div className="emergency-page-copy">
        <span className="eyebrow light"><i /> CLÍNICA DR. KLEBER · BOA VISTA — RR</span>
        <h1>Seu pet precisa de<br /><em>atendimento agora?</em></h1>
        <p>Entre em contato com a clínica para receber orientações sobre como proceder e chegar ao atendimento.</p>
        <div className="emergency-page-actions">
          <a className="btn btn-accent" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> Falar com a clínica agora</a>
          <a className="btn btn-light" href={phone}><Phone /> Ligar</a>
          <a className="btn btn-outline-light" href={maps} target="_blank" rel="noreferrer"><MapPin /> Como chegar</a>
        </div>
      </div>
      <div className="emergency-info"><strong>ATENDIMENTO 24 HORAS</strong><span>Todos os dias</span><hr /><b>Av. Cap. Júlio Bezerra, 358</b><small>Centro — Boa Vista, RR · 69305-294</small></div>
    </section>
    <section className="emergency-guidance"><div><span className="eyebrow dark">CONTATO RÁPIDO</span><h2>Se precisar falar com a equipe, <em>comece por aqui.</em></h2></div><div><p>WhatsApp e telefone estão disponíveis nos botões acima. Para localização, use o link de rota e confirme o melhor caminho até a clínica.</p><p className="note">Esta página não substitui avaliação veterinária nem oferece diagnóstico ou instruções médicas de emergência.</p></div></section>
    <footer className="emergency-footer"><strong>Clínica Veterinária Dr. Kleber 24h</strong><span>Boa Vista — RR</span><Link to="/">Voltar para a página inicial</Link></footer>
  </main>;
}
