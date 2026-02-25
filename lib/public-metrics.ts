export interface PublicMetricEvidence {
  id: string;
  label: string;
  value: string;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  owner: string;
}

const verifiedAt = "2026-02-25";
const owner = "Accessibility.build Team";

export const publicMetrics: Record<string, PublicMetricEvidence> = {
  standardsAlignment: {
    id: "standards-alignment",
    label: "Standards Alignment",
    value: "WCAG 2.2",
    sourceName: "W3C WCAG 2.2 Quick Reference",
    sourceUrl: "https://www.w3.org/WAI/WCAG22/quickref/",
    verifiedAt,
    owner,
  },
  methodology: {
    id: "methodology",
    label: "Methodology",
    value: "Human + AI Review",
    sourceName: "Accessibility.build methodology",
    sourceUrl: "https://accessibility.build/about",
    verifiedAt,
    owner,
  },
  servicesDelivery: {
    id: "services-delivery",
    label: "Delivery Model",
    value: "Remote, Global",
    sourceName: "Accessibility.build contact details",
    sourceUrl: "https://accessibility.build/contact",
    verifiedAt,
    owner,
  },
  supportCommitment: {
    id: "support-commitment",
    label: "Support Window",
    value: "Business-day response",
    sourceName: "Accessibility.build support policy",
    sourceUrl: "https://accessibility.build/contact",
    verifiedAt,
    owner,
  },
  resourcesCoverage: {
    id: "resources-coverage",
    label: "Coverage",
    value: "Tools, Guides, Services",
    sourceName: "Accessibility.build site navigation",
    sourceUrl: "https://accessibility.build/sitemap-page",
    verifiedAt,
    owner,
  },
  platformReliability: {
    id: "platform-reliability",
    label: "Platform Reliability",
    value: "Production monitored",
    sourceName: "Accessibility.build status page",
    sourceUrl: "https://accessibility.build/status",
    verifiedAt,
    owner,
  },
};

export const homepageMetricOrder = [
  publicMetrics.standardsAlignment,
  publicMetrics.methodology,
  publicMetrics.servicesDelivery,
  publicMetrics.resourcesCoverage,
];

export const toolsTrustSignals = [
  publicMetrics.methodology,
  publicMetrics.standardsAlignment,
  publicMetrics.supportCommitment,
];

export const footerTrustSignals = [
  publicMetrics.resourcesCoverage,
  publicMetrics.platformReliability,
];
