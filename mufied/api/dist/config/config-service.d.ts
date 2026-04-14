export declare class ConfigService {
    private readonly cfg;
    readonly firebase: any;
    readonly server: any;
    readonly cors: any;
    constructor();
    get<T = any>(lookupPath: string, fallback?: T): T;
    private resolveCorsOrigins;
}
