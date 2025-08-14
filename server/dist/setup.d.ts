declare class Setup {
    private oauth2Client;
    run(): Promise<void>;
    setupDatabase(): Promise<void>;
    checkCredentials(): Promise<void>;
    authenticate(): Promise<void>;
    createConfigFiles(): Promise<void>;
}
export default Setup;
//# sourceMappingURL=setup.d.ts.map