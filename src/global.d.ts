declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: 'prod' | 'prodbeta' | 'dev1' | 'dev2' | 'localhost';
            APP_BASE_PATH: string;
            APP_ORIGIN: string;
            DECORATOR_LOCAL_URL: string;
            XP_ORIGIN: string;
            NODE_ENV: 'development' | 'production';
        }
    }
}

export {};
