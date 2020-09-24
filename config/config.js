const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb+srv://yuhan:18500@cluster0.qiv5v.mongodb.net/cluster0?retryWrites=true&w=majority"
  }

export default config
