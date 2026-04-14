export declare const MENU_OPTIONS: readonly [{
    readonly key: "dashboard";
    readonly label: "Dashboard";
    readonly route: "/dashboard";
}, {
    readonly key: "content";
    readonly label: "Content";
    readonly route: "/content";
}, {
    readonly key: "settings";
    readonly label: "Settings";
    readonly route: "/settings";
}, {
    readonly key: "users";
    readonly label: "User Management";
    readonly route: "/users";
}, {
    readonly key: "colleges";
    readonly label: "Colleges";
    readonly route: "/colleges";
}, {
    readonly key: "vacancies";
    readonly label: "Vacancies";
    readonly route: "/vacancies";
}, {
    readonly key: "registrations";
    readonly label: "Muallim Registrations";
    readonly route: "/registrations";
}];
export type MenuKey = (typeof MENU_OPTIONS)[number]['key'];
