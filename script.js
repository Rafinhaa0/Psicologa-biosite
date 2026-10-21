// Keep repeated contact links on one editable demo number until the real contact is supplied.
const whatsappNumber = "5511999999999";
document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
  const currentMessage = new URL(link.href).searchParams.get("text") || "Olá, Lívia!";
  link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(currentMessage)}`;
});

// Keep the page in vanilla JavaScript while Lenis smooths wheel and anchor scrolling.
if (typeof window.Lenis === "function") {
  const syncTouchScroll = window.matchMedia("(pointer: coarse), (max-width: 640px)").matches;

  new window.Lenis({
    autoRaf: true,
    anchors: true,
    syncTouch: syncTouchScroll,
  });
}

