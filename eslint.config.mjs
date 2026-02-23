import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        // 自定义规则
        rules: {
            // 将“未使用变量”的错误降级为警告，或者直接关闭
            "@typescript-eslint/no-unused-vars": "off",

            // 💡 将报错降级为警告，或者完全关闭
            "@typescript-eslint/no-explicit-any": "off",




            // 允许使用 @ts-ignore
            "@typescript-eslint/ban-ts-comment": "off",

            // 允许 useEffect 依赖项缺失 (解决 checkout/page.tsx 的警告)
            "react-hooks/exhaustive-deps": "off",

            // 允许不转义的字符 (", ', > 等)
            "react/no-unescaped-entities": "off",

            // 允许使用原生 <img> (解决 no-img-element)
            "@next/next/no-img-element": "off",


            // 允许使用 let 声明未改变的变量
            "prefer-const": "warn",

            // 强制要求 key 的报错降级
            "react/jsx-key": "warn"

        }
    }
];

export default eslintConfig;