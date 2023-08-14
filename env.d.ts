declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * @example
     * ```
    process.env.POSTGRES_USER
    ```
     */
    POSTGRES_USER: string;
    /**
     * @example
     * ```
    process.env.POSTGRES_PASSWORD
    ```
     */
    POSTGRES_PASSWORD: string;
    /**
     * @example
     * ```
    process.env.POSTGRES_DB
    ```
     */
    POSTGRES_DB: string;
    /**
     * @example
     * ```
    process.env.POSTGRES_APP_USER
    ```
     */
    POSTGRES_APP_USER: string;
    /**
     * @example
     * ```
    process.env.POSTGRES_APP_PASSWORD
    ```
     */
    POSTGRES_APP_PASSWORD: string;
    /**
     * @example
     * ```
    process.env.POSTGRES_APP_DB
    ```
     */
    POSTGRES_APP_DB: string;
    /**
     * @example
     * ```
    process.env.POSTGRES_HOST
    ```
     */
    POSTGRES_HOST: string;
    /**
     * @example
     * ```
    process.env.SUPERTOKENS_CONNECTION_URI
    ```
     */
    SUPERTOKENS_CONNECTION_URI: string;
    /**
     * @example
     * ```
    process.env.APP_URL
    ```
     */
    NEXT_PUBLIC_APP_URL: string;
    /**
     * @example
     * ```
    process.env.API_KEY
    ```
     */
    API_KEY: string;
    /**
     * @example
     * ```
    process.env.DATABASE_URL
    ```
     */
    DATABASE_URL: string;
    /**
     * @example
     * ```
    process.env.SMTP_HOST
    ```
     */
    SMTP_HOST: string;
    /**
     * @example
     * ```
    process.env.SMTP_AUTH_NAME
    ```
     */
    SMTP_AUTH_NAME: string;
    /**
     * @example
     * ```
    process.env.SMTP_PASSWORD
    ```
     */
    SMTP_PASSWORD: string;
    /**
     * @example
     * ```
    process.env.SMTP_PORT
    ```
     */
    SMTP_PORT: string;
    /**
     * @example
     * ```
    process.env.SMTP_FROM_NAME
    ```
     */
    SMTP_FROM_NAME: string;
    /**
     * @example
     * ```
    process.env.SMTP_FROM_EMAIL
    ```
     */
    SMTP_FROM_EMAIL: string;
  }
}
