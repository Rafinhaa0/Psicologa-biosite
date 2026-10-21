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

// Story scroll follows native scroll position: pin the previous panel and scrub the next one in.
const storyStages = [...document.querySelectorAll("[data-story-stage]")];
const storyPanels = storyStages.map((stage) => stage.querySelector(".scroll-panel")).filter(Boolean);
const storyMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const storyMaxAngle = storyMotionReduced ? 8 : 30;

if (storyPanels.length > 1) {
  storyPanels.forEach((panel, index) => {
    panel.style.zIndex = String(index + 1);
  });
  document.documentElement.classList.add("has-story-scroll");

  const lastAngles = new WeakMap();
  let storyFrame = 0;

  const syncStoryLayout = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    document.documentElement.style.setProperty("--story-pin-distance", `${viewportHeight}px`);
    const pinnedPanels = storyPanels.slice(0, -1);
    const panelOffsets = pinnedPanels.map((panel) => Math.min(0, viewportHeight - panel.offsetHeight));
    pinnedPanels.forEach((panel, index) => {
      panel.style.top = `${panelOffsets[index]}px`;
    });
  };

  const updateStoryScroll = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const animationDistance = viewportHeight * 0.75;
    const updates = storyStages.slice(1).map((stage, index) => {
      const progress = Math.max(0, Math.min(1, (viewportHeight - stage.getBoundingClientRect().top) / animationDistance));
      return { panel: storyPanels[index + 1], angle: (1 - progress) * storyMaxAngle };
    });

    updates.forEach(({ panel, angle }) => {
      const previousAngle = lastAngles.get(panel);
      if (previousAngle === undefined || Math.abs(previousAngle - angle) >= 0.1) {
        panel.style.transform = `rotate(${angle.toFixed(2)}deg)`;
        lastAngles.set(panel, angle);
      }
    });
  };

  const scheduleStoryUpdate = () => {
    if (storyFrame) return;
    storyFrame = window.requestAnimationFrame(() => {
      storyFrame = 0;
      updateStoryScroll();
    });
  };

  window.addEventListener("scroll", scheduleStoryUpdate, { passive: true });
  const handleStoryResize = () => {
    syncStoryLayout();
    scheduleStoryUpdate();
  };

  window.addEventListener("resize", handleStoryResize, { passive: true });
  window.addEventListener("orientationchange", handleStoryResize, { passive: true });
  syncStoryLayout();
  scheduleStoryUpdate();
}

