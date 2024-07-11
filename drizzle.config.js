/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://prepgenie_owner:BofWHKCkUr23@ep-morning-term-a5uy41d9.us-east-2.aws.neon.tech/prepgenie?sslmode=require'
    }
  };