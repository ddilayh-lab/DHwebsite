import type { LocationEntity, OrganizationEntity, ResumeEntity } from "./types";

/**
 * ENTITY NORMALIZER OUTPUT — every resume item as one consistent typed
 * entity. Summaries are the EDITORIAL REWRITE ENGINE's output: facts,
 * metrics, dates and organization names preserved; resume-bullet tone,
 * filler and cliché removed; each sentence interface-sized. `sourceRef`
 * traces every entity to verbatim resume text in source.ts.
 */

// -------------------------------------------------------------- locations
export const locationEntities: LocationEntity[] = [
  { id: "chicago", label: "Chicago", country: "United States", lat: 41.8781, lng: -87.6298, kind: "home" },
  { id: "new-york", label: "New York", country: "United States", lat: 40.7128, lng: -74.006, kind: "work" },
  { id: "cambridge", label: "Cambridge", country: "United Kingdom", lat: 52.2053, lng: 0.1218, kind: "study" },
  { id: "istanbul", label: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784, kind: "work" },
  { id: "dubai", label: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708, kind: "work" },
  { id: "bali", label: "Bali", country: "Indonesia", lat: -8.6705, lng: 115.2126, kind: "work" },
  { id: "cape-town", label: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, kind: "impact" },
];

// ----------------------------------------------------------- organizations
export const organizationEntities: OrganizationEntity[] = [
  { id: "org-uic", name: "University of Illinois Chicago", kind: "university" },
  { id: "org-cambridge", name: "University of Cambridge", kind: "university" },
  { id: "org-flowcode", name: "Flowcode", kind: "company" },
  { id: "org-exventure", name: "EX Venture Inc.", kind: "company" },
  { id: "org-zerox", name: "ZERO-X", kind: "company" },
  { id: "org-almak", name: "Al Mak Allamea", kind: "company" },
  { id: "org-mytrip", name: "MyTripTurkey", kind: "company" },
  { id: "org-usg", name: "UIC Undergraduate Student Government", kind: "studentOrg" },
  { id: "org-flamesforce", name: "Flames Force", kind: "studentOrg" },
  { id: "org-osqf", name: "Open Source Quantitative Finance", kind: "conference" },
  { id: "org-pmt", name: "Portfolio Management Team", kind: "studentOrg" },
  { id: "org-uicradio", name: "UIC Radio", kind: "studentOrg" },
  { id: "org-leaf", name: "LEAF Project", kind: "initiative" },
];

// ---------------------------------------------------------------- entities
export const entities: ResumeEntity[] = [
  {
    id: "person-dilay",
    type: "person",
    title: "Dilay Heybeli",
    locationId: "chicago",
    status: "current",
    summary:
      "Engineering Management student at the University of Illinois " +
      "Chicago and Student Body Vice President, with professional " +
      "experience across the United States, Indonesia, the UAE and Türkiye.",
    sourceRef: "edu.uic",
    metricIds: ["m-students", "m-orgs", "m-countries", "m-boards"],
    skills: [],
    themes: ["leadership", "engineering", "ai", "finance", "globalExecution"],
    priority: 1,
    displayWeight: 1,
    interactionProfile: "hero",
    globeEligible: false,
    seoLabel: "Dilay Heybeli — Engineering, Leadership & Global Execution",
  },

  // ------------------------------------------------------------ education
  {
    id: "edu-uic",
    type: "education",
    title: "B.S. Engineering Management",
    organizationId: "org-uic",
    role: "Minor in Professional Sales & Relationship Management",
    locationId: "chicago",
    startDate: "2023-08",
    endDate: "2027-05",
    status: "current",
    summary:
      "Engineering Management at the UIC College of Engineering, with a " +
      "sales and relationship management minor — honored with the " +
      "Chancellor's Student Service Award, Academic Excellence Scholarship, " +
      "Activities Honorary Society and Order of Omega.",
    sourceRef: "edu.uic",
    metricIds: [],
    skills: ["engineering management", "professional sales"],
    themes: ["education", "engineering", "sales"],
    priority: 1,
    displayWeight: 0.8,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "edu-cambridge",
    type: "education",
    title: "Ethics of Big Data & Artificial Intelligence",
    organizationId: "org-cambridge",
    locationId: "cambridge",
    startDate: "2026-06",
    endDate: "2026-08",
    status: "current",
    summary:
      "Summer study at the University of Cambridge on the ethics of big " +
      "data and artificial intelligence.",
    sourceRef: "edu.cambridge",
    metricIds: [],
    skills: ["ai ethics", "data governance"],
    themes: ["education", "ai", "technology"],
    priority: 2,
    displayWeight: 0.7,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },

  // ----------------------------------------------------------- experience
  {
    id: "exp-flowcode",
    type: "professionalExperience",
    title: "Strategic Partnerships & Solutions",
    organizationId: "org-flowcode",
    locationId: "new-york",
    startDate: "2025-05",
    endDate: "2025-08",
    status: "completed",
    summary:
      "Turned enterprise SaaS and CRM usage data into go-to-market " +
      "strategy — running projects on AI workflow implementation and lead " +
      "evaluation, and consulting with S&P 500 companies on partnerships.",
    sourceRef: "exp.flowcode",
    metricIds: [],
    skills: ["SaaS", "CRM", "go-to-market", "AI workflows", "tech sales"],
    themes: ["partnerships", "sales", "ai", "technology", "strategy"],
    priority: 1,
    displayWeight: 0.9,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "exp-exventure",
    type: "professionalExperience",
    title: "Project Management",
    organizationId: "org-exventure",
    locationId: "bali",
    startDate: "2024-12",
    endDate: "2025-01",
    status: "completed",
    summary:
      "Led client-acquisition launches and presentations, translating " +
      "technical concepts into commercial value — coordinating engineering " +
      "teams across Malaysia, India and Germany from headquarters.",
    sourceRef: "exp.exventure",
    metricIds: [],
    skills: ["project management", "product launch", "cross-cultural teams"],
    themes: ["entrepreneurship", "technology", "globalExecution", "strategy"],
    priority: 2,
    displayWeight: 0.8,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "exp-zerox",
    type: "professionalExperience",
    title: "Venture Strategy",
    organizationId: "org-zerox",
    locationId: "bali",
    startDate: "2024-12",
    endDate: "2025-01",
    status: "completed",
    summary:
      "Developed a Horizon Europe project proposal aligned with EU " +
      "innovation frameworks, and applied AI tooling to startup " +
      "positioning, business-model strategy and early-stage investment.",
    sourceRef: "exp.zerox",
    metricIds: [],
    skills: ["EU funding", "AI tooling", "market analysis"],
    themes: ["ai", "strategy", "entrepreneurship", "finance"],
    priority: 3,
    displayWeight: 0.7,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "exp-almak",
    type: "professionalExperience",
    title: "Construction Management",
    organizationId: "org-almak",
    locationId: "dubai",
    startDate: "2024-07",
    endDate: "2024-09",
    status: "completed",
    summary:
      "Optimized operations with Dubai's two main telecom providers, Du " +
      "and Etisalat — nine major sites visited, working directly with the " +
      "CEO on execution priorities and stakeholder alignment.",
    sourceRef: "exp.almak",
    metricIds: ["m-sites"],
    skills: ["operations", "infrastructure", "stakeholder management"],
    themes: ["engineering", "globalExecution", "strategy"],
    priority: 4,
    displayWeight: 0.7,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "exp-mytrip",
    type: "professionalExperience",
    title: "International Business Consultant",
    organizationId: "org-mytrip",
    locationId: "istanbul",
    startDate: "2024-05",
    endDate: "2024-07",
    status: "completed",
    summary:
      "Maximized revenue across 2,000+ Istanbul tourism agencies, advised " +
      "international clients, and represented the company at events to " +
      "secure B2B partnerships.",
    sourceRef: "exp.mytrip",
    metricIds: ["m-agencies"],
    skills: ["consulting", "B2B sales", "market entry"],
    themes: ["consulting", "partnerships", "sales", "globalExecution"],
    priority: 5,
    displayWeight: 0.7,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },

  // ----------------------------------------------------------- leadership
  {
    id: "lead-usg",
    type: "leadershipRole",
    title: "Student Body Vice President",
    organizationId: "org-usg",
    locationId: "chicago",
    startDate: "2024-05",
    status: "current",
    summary:
      "Reelected by the campus to represent 36,000+ students, leading " +
      "engagement across 460+ organizations and student government " +
      "operations, events and initiatives.",
    sourceRef: "lead.usg",
    metricIds: ["m-students", "m-orgs", "m-policy", "m-members"],
    skills: ["governance", "policy", "public representation"],
    themes: ["leadership", "governance", "publicSpeaking"],
    priority: 1,
    displayWeight: 1,
    interactionProfile: "metricHighlight",
    globeEligible: true,
  },
  {
    id: "lead-flamesforce",
    type: "leadershipRole",
    title: "Co-Founder & Executive Officer",
    organizationId: "org-flamesforce",
    locationId: "chicago",
    startDate: "2025-09",
    status: "current",
    summary:
      "Launched the official partnership strengthening UIC's NCAA " +
      "Division I teams and fan experience — participation grew 100%+ " +
      "through sports marketing and management.",
    sourceRef: "lead.flamesforce",
    metricIds: ["m-growth"],
    skills: ["sports marketing", "partnership building"],
    themes: ["leadership", "sportsBusiness", "entrepreneurship"],
    priority: 2,
    displayWeight: 0.8,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "lead-pmt",
    type: "leadershipRole",
    title: "Chief People Officer",
    organizationId: "org-pmt",
    locationId: "chicago",
    startDate: "2023-09",
    status: "current",
    summary:
      "Shapes people strategy and culture across a 500+ member investment " +
      "organization of students, alumni and corporate partners.",
    sourceRef: "lead.pmt",
    metricIds: ["m-pmt"],
    skills: ["people strategy", "culture building"],
    themes: ["leadership", "finance"],
    priority: 3,
    displayWeight: 0.7,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "lead-radio",
    type: "leadershipRole",
    title: "Founder & Host, Business Hours",
    organizationId: "org-uicradio",
    locationId: "chicago",
    startDate: "2023-09",
    status: "current",
    summary:
      "Founded and hosts a podcast with business experts, turning " +
      "conversations into mentorship and entrepreneurship programs.",
    sourceRef: "lead.radio",
    metricIds: [],
    skills: ["broadcasting", "interviewing", "program building"],
    themes: ["entrepreneurship", "publicSpeaking", "communityImpact"],
    priority: 4,
    displayWeight: 0.6,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "gov-boards",
    type: "governanceRole",
    title: "University Boards & Committees",
    organizationId: "org-uic",
    locationId: "chicago",
    status: "current",
    summary:
      "Serves on seven university bodies — from the Student Fee and " +
      "Sustainability Fund advisory boards to the Vice Chancellor Search " +
      "Committee and Chancellor's Athletics Advisory Board.",
    sourceRef: "gov.boards",
    metricIds: ["m-boards"],
    skills: ["governance", "advisory"],
    themes: ["governance", "leadership"],
    priority: 5,
    displayWeight: 0.5,
    interactionProfile: "secondaryDetail",
    globeEligible: false,
  },

  // ----------------------------------------------------------- conference
  {
    id: "conf-osqf",
    type: "conference",
    title: "Organizing Committee Member",
    organizationId: "org-osqf",
    locationId: "chicago",
    startDate: "2024-01",
    status: "current",
    summary:
      "Coordinates 25 speakers and 100+ guests for the quantitative " +
      "finance conference — its sole student committee member.",
    sourceRef: "lead.osqf",
    metricIds: ["m-speakers", "m-guests"],
    skills: ["event production", "industry relations"],
    themes: ["finance", "partnerships", "publicSpeaking"],
    priority: 1,
    displayWeight: 0.7,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },

  // ------------------------------------------------------------- projects
  {
    id: "proj-teaching",
    type: "project",
    title: "Cape Town & Bali Teaching Projects",
    locationId: "cape-town",
    startDate: "2023-01",
    status: "current",
    summary:
      "Delivers education to schools in need across Cape Town (2023) and " +
      "Bali (2024, 2026), supporting more than 100 students.",
    sourceRef: "proj.teaching",
    metricIds: ["m-students-taught"],
    skills: ["teaching", "program delivery"],
    themes: ["communityImpact", "education", "globalExecution"],
    priority: 1,
    displayWeight: 0.8,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
  {
    id: "proj-leaf",
    type: "project",
    title: "LEAF Project",
    organizationId: "org-leaf",
    locationId: "chicago",
    status: "current",
    summary:
      "Builds partnerships that open STEM and finance careers to more " +
      "women.",
    sourceRef: "proj.leaf",
    metricIds: [],
    skills: ["partnership building", "advocacy"],
    themes: ["womenInSTEM", "communityImpact", "partnerships", "finance"],
    priority: 2,
    displayWeight: 0.7,
    interactionProfile: "expandableCard",
    globeEligible: true,
  },
];

export const entityById = new Map(entities.map((e) => [e.id, e]));
export const locationEntityById = new Map(locationEntities.map((l) => [l.id, l]));
export const organizationById = new Map(organizationEntities.map((o) => [o.id, o]));
