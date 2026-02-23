/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {

                background: "var(--background)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",
                gold: "rgb(var(--accent-main) / <alpha-value>)", // 变量名映射为 gold 保持兼容

                //容器类
                card: "var(--card)",
                border: "rgb(var(--card-border) / <alpha-value>)",
                muted: "rgb(var(--text-muted) / <alpha-value>)",

                // 容器类
                "card-soft": "rgb(var(--card-soft) / <alpha-value>)",
                "card-subtle": "rgb(var(--card-subtle) / <alpha-value>)",

                // 交互类
                "nav-hover": "rgb(var(--hover-bg) / <alpha-value>)",

                // 语义与装饰
                "line-light": "rgb(var(--border-light) / <alpha-value>)",
                "line-strong": "rgb(var(--border-strong) / <alpha-value>)",
                "success-bg": "rgb(var(--success-soft) / <alpha-value>)",
                "error-bg": "rgb(var(--error-soft) / <alpha-value>)",

                // 特定区域
                "footer-bg": "rgb(var(--footer-bg) / <alpha-value>)",
                "footer-content": "rgb(var(--footer-text) / <alpha-value>)",
                "avatar-muted": "rgb(var(--avatar-bg) / <alpha-value>)",

            },
        },
    },
    plugins: [],
};

console.log("Tailwind config loaded:", module.exports);