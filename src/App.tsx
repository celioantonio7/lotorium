import { ArcBridge, CurveBridge } from "./components/animations/StoryBridges";
import NavigationTransition from "./components/animations/NavigationTransition";
import { useCallback, useEffect, useState } from "react";
import Preloader from "./components/animations/Preloader";
import { site } from "./data";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Solutions from "./components/sections/Solutions";
import Products from "./components/sections/Products";
import Automation from "./components/sections/Automation";
import WebDesign from "./components/sections/WebDesign";
import Process from "./components/sections/Process";
import Differences from "./components/sections/Differences";
import Contact from "./components/sections/Contact";
import { useAnimations } from "./hooks/useAnimations";
export default function App() {
  const [ready, setReady] = useState(!site.effects.preloader.enabled);
  const [intro, setIntro] = useState(site.effects.preloader.enabled);
  const reveal = useCallback(() => setReady(true), []);
  const finish = useCallback(() => setIntro(false), []);
  useAnimations(ready);
  useEffect(() => {
    document.title = site.seo.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", site.seo.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", site.seo.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", site.seo.description);
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute(
        "content",
        site.seo.siteUrl
          ? new URL(site.seo.socialImage, site.seo.siteUrl).href
          : site.seo.socialImage,
      );
    if (site.seo.siteUrl) {
      const existing = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );
      const canonical = existing ?? document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = site.seo.siteUrl;
      document.head.append(canonical);
      return () => {
        if (!existing) canonical.remove();
      };
    }
  }, []);
  return (
    <>
      {intro && <Preloader onReveal={reveal} onFinish={finish} />}
      <div className="site-shell" inert={!ready}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <NavigationTransition />
        <Header />
        <main id="conteudo">
          <Hero />
          <About />
          <Solutions />
          <div className="story-chapter">
            <ArcBridge />
            <Products />
          </div>
          <Automation />
          <WebDesign />
          <Process />
          <Differences />
          <CurveBridge />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
