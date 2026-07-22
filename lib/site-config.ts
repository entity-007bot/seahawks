export interface PublicSiteConfig {
  brandName: string;
  tagline: string;
  motto: string;
  corePhilosophy: string;
  aboutText: string;
  aboutDetailed: string;
  vision: string;
  missions: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  missionPhotos: { id: string; url: string; title: string; description: string }[];
  eventPhotos: { id: string; url: string; title: string; description: string }[];
}

export const DEFAULT_PUBLIC_SITE_CONFIG: PublicSiteConfig = {
  brandName: "National Association of Privateers",
  tagline: "SAEAHAWKS FLEET",
  motto: "Commissioned for Service. Bound by Honor.",
  corePhilosophy: "One Ship. One Compass. One Course.",
  aboutText: "A modern, maritime-inspired fellowship built around the core principles of leadership, service, discipline, knowledge, entrepreneurship, and community development. Our identity is rooted strictly in lawful maritime tradition.",
  aboutDetailed: "Our identity is rooted strictly in lawful maritime tradition. Unlike historical actors who operated outside the law, our privateers sail under recognized commissions (Letters of Marque) and civic responsibilities to protect, serve, and explore.",
  vision: "To develop a generation of disciplined leaders, entrepreneurs, innovators, and community builders who navigate society with wisdom, integrity, and purpose.",
  missions: [
    "Promote leadership development among young professionals",
    "Encourage entrepreneurship and economic empowerment",
    "Preserve maritime heritage and environmental responsibility",
    "Support community service initiatives and welfare",
    "Build networks of ambitious, disciplined individuals",
    "Develop strategic thinkers prepared for modern challenges"
  ],
  contactEmail: "scribe@corsairs-fellowship.org",
  contactPhone: "+234 803 111 2222",
  contactAddress: "14 Escravos Way, Warri, Delta State",
  missionPhotos: [
    {
      id: "m_1",
      url: "https://picsum.photos/seed/delta_vessel/800/600",
      title: "Delta Port Operations",
      description: "Fleet officers coordinating maritime safety training and navigation courses for young coastal pilots."
    },
    {
      id: "m_2",
      url: "https://picsum.photos/seed/coastal_conservation/800/600",
      title: "Coastal Conservation Run",
      description: "Active crew members conducting quarterly environmental water clearance and waste containment."
    }
  ],
  eventPhotos: [
    {
      id: "e_1",
      url: "https://picsum.photos/seed/conclave_hall/800/600",
      title: "Mid-Year Conclave Assembly",
      description: "Our formal physical assembly of provincial captains conducting audited cargo and welfare distributions."
    },
    {
      id: "e_2",
      url: "https://picsum.photos/seed/induction_ceremony/800/600",
      title: "Induction and Pledge Session",
      description: "Newly verified candidates taking their solemn Oath of Character and receiving active MQE Commissions."
    }
  ]
};

export function getPublicSiteConfig(): PublicSiteConfig {
  if (typeof window === "undefined") return DEFAULT_PUBLIC_SITE_CONFIG;
  const config = localStorage.getItem("privateers_public_site_config");
  if (!config) {
    localStorage.setItem("privateers_public_site_config", JSON.stringify(DEFAULT_PUBLIC_SITE_CONFIG));
    return DEFAULT_PUBLIC_SITE_CONFIG;
  }
  try {
    return JSON.parse(config);
  } catch (e) {
    return DEFAULT_PUBLIC_SITE_CONFIG;
  }
}

export function savePublicSiteConfig(config: PublicSiteConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem("privateers_public_site_config", JSON.stringify(config));
  window.dispatchEvent(new Event("privateers_public_config_updated"));
}
