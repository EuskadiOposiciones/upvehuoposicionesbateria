/* Configuración rápida antes de publicar */
const SITE_CONFIG = {
  appUrl: "",
  adminUrl: "",
  subalternoUrl: "",
  monthlyPrice: "Suscripción mensual"
};

function fallbackLink(category){
  if(category === "admin" && SITE_CONFIG.adminUrl) return SITE_CONFIG.adminUrl;
  if(category === "subalterno" && SITE_CONFIG.subalternoUrl) return SITE_CONFIG.subalternoUrl;
  if(SITE_CONFIG.appUrl) return SITE_CONFIG.appUrl;
  return "#suscripcion";
}

document.querySelectorAll("[data-app-link]").forEach(a => a.href = fallbackLink());
document.querySelectorAll("[data-admin-link]").forEach(a => a.href = fallbackLink("admin"));
document.querySelectorAll("[data-subalterno-link]").forEach(a => a.href = fallbackLink("subalterno"));
document.querySelectorAll("[data-price]").forEach(el => el.textContent = SITE_CONFIG.monthlyPrice);

/* Mantiene actualizada la etiqueta del plazo sin reescribir el contenido SEO principal */
(function deadlineStatus(){
  const now = new Date();
  const start = new Date("2026-09-01T00:00:00+02:00");
  const end = new Date("2026-09-21T23:59:59+02:00");
  let text = "Solicitudes: 1–21 septiembre 2026";
  if(now < start) text = "Solicitudes desde el 1 de septiembre";
  else if(now <= end) text = "Plazo de solicitudes abierto hasta el 21 de septiembre";
  else text = "Plazo de solicitudes finalizado";
  document.querySelectorAll("[data-deadline-status]").forEach(el => el.textContent = text);
})();
