declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: 'prod' | 'dev1' | 'dev2' | 'localhost';
            APP_BASE_PATH: string;
            APP_ORIGIN: string;
            DECORATOR_LOCAL_URL: string;
            SEARCH_URL: string;
            NODE_ENV: 'development' | 'production';
        }
    }
}

export {};
