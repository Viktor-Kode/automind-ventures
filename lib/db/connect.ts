import mongoose from "mongoose";

/** Trim and strip accidental wrapping quotes from env (common in Vercel UI). */
export function getMongoUri(): string {
  let raw = process.env.MONGODB_URI || "";
  raw = raw.trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1).trim();
  }
  return raw;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalCache = global as unknown as { _mongooseCached?: MongooseCache };
let cached: MongooseCache = globalCache._mongooseCached ?? {
  conn: null,
  promise: null
};
if (!globalCache._mongooseCached) {
  globalCache._mongooseCached = cached;
}

const serverlessOpts = {
  bufferCommands: false,
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 20_000,
  socketTimeoutMS: 45_000,
  family: 4 as const
};

export async function connectDB() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const isReady = () =>
    (mongoose.connection.readyState as number) === 1;

  if (isReady()) {
    return mongoose;
  }

  if (cached.promise) {
    try {
      await cached.promise;
      if (isReady()) {
        return mongoose;
      }
    } catch {
      cached.promise = null;
      cached.conn = null;
    }
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, serverlessOpts)
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
