interface AppConfig {
    BACKEND_BASE_URL: string,
    BACKEND_API_URL: string;
}

const config: AppConfig = {
    BACKEND_BASE_URL: "http://localhost:8090",
    BACKEND_API_URL:"http://localhost:8000"
}

export default config;