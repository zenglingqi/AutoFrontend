/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // 💡 这一行是关键，必须是 'class'
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        // 确保包含了 components 目录
    ],
    theme: {
        extend: {
            // 方案三配色映射
            colors: {
                'fashion-beige': '#FDFBF7',
                'fashion-black': '#121110',
                'fashion-gold': '#C5A059',
            }
        },
    },
    plugins: [],
}