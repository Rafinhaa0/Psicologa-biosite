// Keep repeated contact links on one editable demo number until the real contact is supplied.
const whatsappNumber = "5511999999999";
document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  const currentMessage = new URL(link.href).searchParams.get("text") || "Olá, Lívia!";
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(currentMessage)}`;
});

// Replay the reveal each time content enters the viewport, including on scroll-back.
const revealTargets = document.querySelectorAll("[data-scroll-reveal]");

if (revealTargets.length && "IntersectionObserver" in window) {
  document.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    [...group.children]
      .filter((element) => element.hasAttribute("data-scroll-reveal"))
      .forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${index * 75}ms`);
      });
  });

  document.documentElement.classList.add("has-scroll-reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.toggleAttribute("data-revealed", entry.isIntersecting);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
  });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

// Native story-scroll: pin desktop panels and tilt incoming sections without smooth scrolling.
const storyPanels = [...document.querySelectorAll("[data-story-stage] > .scroll-panel")];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const supportsViewTimeline = window.CSS?.supports?.("animation-timeline: view()") ?? false;

if (storyPanels.length > 1 && !reducedMotionQuery.matches && (supportsViewTimeline || "IntersectionObserver" in window)) {
  storyPanels.forEach((panel, index) => {
    panel.style.zIndex = String(index + 1);
  });
  document.documentElement.classList.add("has-story-scroll");

  // Older browsers (including older iPhones) get a lightweight enter/exit transition.
  if (!supportsViewTimeline && "IntersectionObserver" in window) {
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.toggleAttribute("data-story-visible", entry.isIntersecting);
      });
    }, { threshold: 0, rootMargin: "0px 0px -18% 0px" });

    storyPanels.slice(1).forEach((panel) => storyObserver.observe(panel));
  }
}

