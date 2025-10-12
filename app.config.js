export default {
  expo: {
    name: "JP Hacks",
    slug: "jp-hacks",
    scheme: "jp-hacks",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    orientation: "portrait",
    android: {
      package: "com.yourorg.jphacks"
    },
    ios: {
      bundleIdentifier: "com.yourorg.jphacks"
    },
    assetBundlePatterns: ["**/*"],
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY 
    }
  }
};
