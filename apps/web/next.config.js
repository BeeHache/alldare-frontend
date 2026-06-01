const { withExpo } = require("@expo/next-adapter");

/** @type {import('next').NextConfig} */
const nextConfig = withExpo({
  transpilePackages: ["@alldare/ui", "react-native-web", "nativewind"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native": "react-native-web",
    };
    return config;
  },
});

module.exports = nextConfig;
