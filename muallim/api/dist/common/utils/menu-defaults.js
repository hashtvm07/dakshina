"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultMenusForUserType = getDefaultMenusForUserType;
const menu_options_1 = require("../constants/menu-options");
const user_type_enum_1 = require("../enums/user-type.enum");
const allMenus = menu_options_1.MENU_OPTIONS.map((item) => item.key);
function getDefaultMenusForUserType(userType) {
    switch (userType) {
        case user_type_enum_1.UserType.SUPERADMIN:
            return [...allMenus];
        case user_type_enum_1.UserType.OFFICE_ADMIN:
        case user_type_enum_1.UserType.CENTRAL_ADMIN:
            return ['dashboard', 'vacancies', 'colleges', 'registrations'];
        case user_type_enum_1.UserType.MEKHALA_ADMIN:
            return ['dashboard', 'registrations'];
        case user_type_enum_1.UserType.MUALLIM:
            return ['dashboard'];
        default:
            return ['dashboard'];
    }
}
//# sourceMappingURL=menu-defaults.js.map