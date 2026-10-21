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

