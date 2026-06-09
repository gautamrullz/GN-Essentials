import { navigation } from "@/lib/navigation";

import { Role } from "@/types/role";

export function getAllowedRoles(pathname: string): Role[] | null {
  for (const section of navigation) {
    const item = section.items.find(
      (navItem) => navItem.href === pathname,
    );

    if (item) {
      return item.roles;
    }
  }

  return null;
}