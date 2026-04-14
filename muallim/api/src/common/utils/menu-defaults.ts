import { MENU_OPTIONS, type MenuKey } from '../constants/menu-options';
import { UserType } from '../enums/user-type.enum';

const allMenus = MENU_OPTIONS.map((item) => item.key);

export function getDefaultMenusForUserType(userType: UserType): MenuKey[] {
  switch (userType) {
    case UserType.SUPERADMIN:
      return [...allMenus];
    case UserType.OFFICE_ADMIN:
    case UserType.CENTRAL_ADMIN:
      return ['dashboard', 'vacancies', 'colleges', 'registrations'];
    case UserType.MEKHALA_ADMIN:
      return ['dashboard', 'registrations'];
    case UserType.MUALLIM:
      return ['dashboard'];
    default:
      return ['dashboard'];
  }
}
