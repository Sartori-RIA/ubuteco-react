import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {
  faBeer,
  faBoxesStacked,
  faBuilding,
  faCartShopping,
  faChair,
  faGear,
  faGlassMartini,
  faHamburger,
  faHouse,
  faIndustry,
  faUtensils,
  faUsers,
  faWineBottle,
} from "@fortawesome/free-solid-svg-icons";
import type {TranslationKey} from "@/app/_lib/i18n";
import {User} from "@/app/_types";
import {
  canAccessDashboard,
  canAccessInventory,
  canAccessKitchen,
  canAccessOrganizations,
  canManageUsers,
  isKitchenStaff,
  isSuperAdmin,
} from "@/app/_lib/auth-roles";

export type NavItem = {
  labelKey: TranslationKey;
  icon: IconDefinition;
  link: string;
  kitchen?: boolean;
  superAdminOnly?: boolean;
  adminOnly?: boolean;
  organizationAccess?: boolean;
  dashboardAccess?: boolean;
  inventoryAccess?: boolean;
};

export type NavGroup = {
  labelKey: TranslationKey;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: "nav.groups.operations",
    items: [
      {labelKey: "nav.dashboard", icon: faHouse, link: "/", dashboardAccess: true},
      {labelKey: "nav.orders", icon: faCartShopping, link: "/orders"},
      {labelKey: "nav.kitchen", icon: faUtensils, link: "/kitchen", kitchen: true},
      {labelKey: "nav.tables", icon: faChair, link: "/tables"},
      {labelKey: "nav.inventory", icon: faBoxesStacked, link: "/inventory", inventoryAccess: true},
    ],
  },
  {
    labelKey: "nav.groups.menuCatalog",
    items: [
      {labelKey: "nav.beers", icon: faBeer, link: "/beers"},
      {labelKey: "nav.beerStyles", icon: faBeer, link: "/beer-styles"},
      {labelKey: "nav.drinks", icon: faGlassMartini, link: "/drinks"},
      {labelKey: "nav.wines", icon: faWineBottle, link: "/wines"},
      {labelKey: "nav.wineStyles", icon: faWineBottle, link: "/wine-styles"},
      {labelKey: "nav.dishes", icon: faHamburger, link: "/dishes"},
      {labelKey: "nav.foods", icon: faHamburger, link: "/foods"},
      {labelKey: "nav.makers", icon: faIndustry, link: "/makers"},
    ],
  },
  {
    labelKey: "nav.groups.administration",
    items: [
      {labelKey: "nav.users", icon: faUsers, link: "/users", adminOnly: true},
      {labelKey: "nav.organizations", icon: faBuilding, link: "/organizations", organizationAccess: true},
      {labelKey: "nav.settings", icon: faGear, link: "/settings"},
    ],
  },
];

function isItemVisible(item: NavItem, user: User | null | undefined): boolean {
  if (item.superAdminOnly && !isSuperAdmin(user)) return false;
  if (item.adminOnly && !canManageUsers(user)) return false;
  if (item.organizationAccess && !canAccessOrganizations(user)) return false;
  if (item.dashboardAccess && !canAccessDashboard(user) && !isSuperAdmin(user)) return false;
  if (item.inventoryAccess && !canAccessInventory(user)) return false;
  if (item.kitchen && !canAccessKitchen(user)) return false;
  return true;
}

export function getVisibleNavGroups(user: User | null | undefined): NavGroup[] {
  if (isKitchenStaff(user)) {
    const kitchenItems = NAV_GROUPS.flatMap((group) => group.items).filter(
      (item) => item.link === "/kitchen" || item.link === "/settings"
    );
    return kitchenItems.length > 0 ? [{labelKey: "nav.groups.operations", items: kitchenItems}] : [];
  }

  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isItemVisible(item, user)),
  })).filter((group) => group.items.length > 0);
}
