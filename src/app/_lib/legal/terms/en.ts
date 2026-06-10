import type {LegalDocument} from "@/app/_lib/legal/types";

const terms: LegalDocument = {
  title: "Terms of Use",
  lastUpdated: "June 10, 2026",
  intro:
    "These Terms of Use govern access to and use of uButeco, a bar and restaurant management platform offered as software as a service (SaaS). By creating an account or using the service, you agree to these terms.",
  sections: [
    {
      title: "1. Service scope",
      paragraphs: [
        "uButeco is a multi-tenant system that helps establishments manage menus, orders, kitchen queues, staff users, and organization settings.",
        "The service is provided as currently available (including demo or production environments) and may change, be suspended, or discontinued with reasonable notice when possible.",
      ],
    },
    {
      title: "2. Eligibility and accounts",
      paragraphs: [
        "You must have legal authority to bind the business you represent. You agree to provide accurate registration data and keep it up to date.",
        "Access credentials are personal. You are responsible for activity under your account and must report unauthorized use promptly.",
      ],
    },
    {
      title: "3. Organizations and roles",
      paragraphs: [
        "Each establishment operates in an isolated organization. Roles (admin, kitchen, waiter, cashier, etc.) control what each user can access within that organization.",
        "Organization administrators are responsible for team access and appropriate use of the system.",
      ],
    },
    {
      title: "4. Acceptable use",
      paragraphs: [
        "You may not use uButeco for unlawful purposes, to access other organizations' data, to disrupt security or availability, or to upload malicious content.",
        "You retain ownership of operational data you enter. You grant uButeco a limited license to host, process, and display that data solely to provide the service.",
      ],
    },
    {
      title: "5. Availability and changes",
      paragraphs: [
        "We use reasonable efforts to keep the service available but do not guarantee uninterrupted or error-free operation. Maintenance may occur.",
        "Features may be added, changed, or removed as the product evolves.",
      ],
    },
    {
      title: "6. Plans and billing",
      paragraphs: [
        "When paid plans are offered, commercial terms will be presented at purchase. Free or beta access may change with prior notice.",
        "Non-payment or violation of these terms may result in suspension or termination.",
      ],
    },
    {
      title: "7. Intellectual property",
      paragraphs: [
        "Software, branding, and documentation remain the property of uButeco and its licensors. Open-source components are used under their respective licenses.",
        "Feedback may be used to improve the product without obligation to compensate you.",
      ],
    },
    {
      title: "8. Limitation of liability",
      paragraphs: [
        "To the extent permitted by law, uButeco is not liable for lost profits, data loss caused by misuse or third-party failures, or operational decisions based on information shown in the app.",
        "The service is provided \"as is.\" Maintain your own backup and verification procedures for critical operations.",
      ],
    },
    {
      title: "9. Termination",
      paragraphs: [
        "You may close your account using in-app features where available. We may suspend or terminate accounts that violate these terms or pose a security risk.",
        "After termination, data may be retained as required by law or backup policy, then deleted per the Privacy Policy.",
      ],
    },
    {
      title: "10. Updates and governing law",
      paragraphs: [
        "These terms may be updated; the revision date appears at the top of this page. Continued use after changes constitutes acceptance.",
        "Brazilian law applies unless otherwise required by mandatory local rules for your jurisdiction.",
      ],
    },
  ],
};

export default terms;
