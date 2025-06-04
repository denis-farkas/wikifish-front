module.exports = {
  apps: [
    {
      name: "wikifish", // Name of your app
      script: "node_modules/.bin/serve", // Use 'serve' to serve the built files
      args: "-s dist -l 3012", // Serve the 'dist' folder on port 3000
      cwd: "/var/www/wikifish.horizonduweb.fr", // Absolute path to your app
      watch: false, // No need to watch files in production
      env: {
        NODE_ENV: "production",
        VITE_API_URL: "http://localhost:3013",
        API_KEY: "148282553687442",
        API_SECRET: "bzm64S_3FrVrYEg2PIoKM9uLRMM",
        CLOUDINARY_URL:
          "cloudinary://148282553687442:bzm64S_3FrVrYEg2PIoKM9uLRMM@dfmbhkfao",
        VITE_LOG_LEVEL: "WARN",
      },
    },
  ],
};
