import LandscapeAtmosphere from "../animations/LandscapeAtmosphere";
import TerrainSides from "../ui/TerrainSides";
import { useRef, useState, useEffect } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, LoaderCircle, Mail, MessageCircle } from "lucide-react";
import { site } from "../../data";
import SectionTitle from "../ui/SectionTitle";
type Fields = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};
export default function Contact() {
  const d = site.contact;
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "unconfigured"
  >("idle");
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const next: Partial<Fields> = {};
    for (const k of Object.keys(values) as (keyof Fields)[])
      if (!values[k].trim()) next[k] = d.messages.required;
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = d.messages.email;
    if (
      values.phone &&
      (!/^[\d\s()+.-]+$/.test(values.phone) ||
        values.phone.replace(/\D/g, "").length < 10 ||
        values.phone.replace(/\D/g, "").length > 15)
    )
      next.phone = d.messages.phone;
    if (values.message.trim() && values.message.trim().length < 10)
      next.message = d.messages.message;
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    if (!d.endpoint) {
      setStatus("unconfigured");
      return;
    }
    setStatus("sending");
    abort.current = new AbortController();
    const timer = window.setTimeout(() => abort.current?.abort(), 15000);
    try {
      const res = await fetch(d.endpoint, {
        method: d.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: abort.current.signal,
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setValues({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
    }
  }
  function change(key: keyof Fields, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (status !== "sending") setStatus("idle");
  }
  return (
    <section id="contato" className="section contact">
      <img className="contact-landscape" src="./assets/lotorium/about-landscape.webp" width="1672" height="941" alt="" loading="lazy" decoding="async" aria-hidden="true" />
      <LandscapeAtmosphere />
      <TerrainSides />
      <div className="contact-swoop" aria-hidden="true" />
      <div className="container contact-layout">
        <div>
          <SectionTitle {...d} />
          <div className="contact-availability">
            <i className="status-dot" />
            <span className="mono">{d.availability}</span>
          </div>
          <div className="contact-links">
            {d.email && (
              <a href={`mailto:${d.email}`}>
                <Mail size={18} />
                {d.email}
                <ArrowUpRight size={16} />
              </a>
            )}
            {d.whatsapp && (
              <a
                href={`https://wa.me/${d.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                Conversar no WhatsApp
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <div className="contact-signature">
            <img src={site.brand.symbol} width="85" height="85" alt="" />
            <span>
              Boas perguntas.
              <br />
              <em>Novas possibilidades.</em>
            </span>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit} noValidate data-reveal>
          <div className="form-heading">
            <span className="mono">CONTE COM A GENTE</span>
            <ArrowUpRight size={22} />
          </div>
          <div className="form-grid">
            {(["name", "email", "phone"] as const).map((k) => (
              <div
                className={k === "name" ? "field field-full" : "field"}
                key={k}
              >
                <label htmlFor={`contact-${k}`}>
                  {d.fields[k]}
                  <span> *</span>
                </label>
                <input
                  id={`contact-${k}`}
                  name={k}
                  value={values[k]}
                  onChange={(e) => change(k, e.target.value)}
                  type={
                    k === "email" ? "email" : k === "phone" ? "tel" : "text"
                  }
                  autoComplete={k === "phone" ? "tel" : k}
                  maxLength={k === "name" ? 120 : k === "email" ? 254 : 25}
                  placeholder={
                    k === "name"
                      ? "Como podemos chamar você?"
                      : k === "email"
                        ? "voce@empresa.com.br"
                        : "(00) 00000-0000"
                  }
                  required
                  aria-invalid={!!errors[k]}
                  aria-describedby={errors[k] ? `error-${k}` : undefined}
                />
                {errors[k] && (
                  <span className="field-error" id={`error-${k}`}>
                    {errors[k]}
                  </span>
                )}
              </div>
            ))}
            <div className="field field-full">
              <label htmlFor="contact-service">
                {d.fields.service}
                <span> *</span>
              </label>
              <select
                id="contact-service"
                name="service"
                value={values.service}
                onChange={(e) => change("service", e.target.value)}
                required
                aria-invalid={!!errors.service}
                aria-describedby={errors.service ? "error-service" : undefined}
              >
                <option value="">Selecione uma opção</option>
                {d.services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {errors.service && (
                <span className="field-error" id="error-service">
                  {errors.service}
                </span>
              )}
            </div>
            <div className="field field-full">
              <label htmlFor="contact-message">
                Seu projeto<span> *</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={values.message}
                onChange={(e) => change("message", e.target.value)}
                placeholder={d.fields.message}
                rows={4}
                required
                maxLength={5000}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "error-message" : undefined}
              />
              {errors.message && (
                <span className="field-error" id="error-message">
                  {errors.message}
                </span>
              )}
            </div>
          </div>
          <button
            className="button submit-button"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? d.loadingLabel : d.submitLabel}
            {status === "sending" ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <ArrowUpRight size={18} />
            )}
          </button>
          <p className="privacy-note">{d.privacyNote}</p>
          <div role="status" aria-live="polite">
            {["success", "error", "unconfigured"].includes(status) && (
              <p className={`form-status status-${status}`}>
                {status === "success"
                  ? d.successMessage
                  : status === "error"
                    ? d.errorMessage
                    : d.unconfiguredMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
