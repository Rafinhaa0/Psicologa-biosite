// Keep repeated contact links on one editable demo number until the real contact is supplied.
const whatsappNumber = "5511999999999";
document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  const currentMessage = new URL(link.href).searchParams.get("text") || "Olá, Lívia!";
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(currentMessage)}`;
});

// Use native scrolling on touch/small screens; keep Lenis for desktop wheel scrolling.
const useNativeTouchScroll = window.matchMedia("(pointer: coarse), (max-width: 640px)").matches;
if (!useNativeTouchScroll && typeof window.Lenis === "function") {
  new window.Lenis({
    autoRaf: true,
    anchors: true,
  });
}

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

