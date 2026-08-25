export const networks = [
  {
    id: "tiktok",
    label: "TikTok",
    loginFile: "/login/tiktok.html",
  },
  {
    id: "instagram",
    label: "Instagram",
    loginFile: "/login/instagram.html",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    loginFile: "/login/snapchat.html",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    loginFile: "/login/microsoft.html",
  },
];

export function getNetwork(id) {
  return networks.find((n) => n.id === id);
}
