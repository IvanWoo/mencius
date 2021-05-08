module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
    theme: {
        extend: {},
    },
    variants: {
        opacity: ["responsive", "hover", "focus", "disabled"],
    },
    plugins: [],
};
