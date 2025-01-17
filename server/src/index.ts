import fastify, { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import cors from "@fastify/cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Type definitions for Fastify
interface User {
  realm_access: {
    roles: string[];
  };
}

interface RequestWithUser extends FastifyRequest {
  user?: User;
}

const server = fastify({ logger: true });

// Retrieve the public key from the environment variable
let publicKey: string | undefined = process.env.PUBLIC_KEY;

// Add PEM header and footer if not present
if (publicKey) {
  // Remove any literal "\n" sequences and trim spaces
  publicKey = publicKey.replace(/\\n/g, "").trim();

  // Wrap the key with header and footer if missing
  if (!publicKey.includes("-----BEGIN PUBLIC KEY-----")) {
    publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
  }
}

console.log("Using public key:", publicKey); // Debug output to verify formatting

// Register CORS plugin
server.register(cors, {
  origin: true,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Middleware to verify JWT and attach user info
async function verifyJWT(request: RequestWithUser, reply: FastifyReply): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error("No Authorization header");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token not provided");
    }
    const decoded = jwt.verify(token, publicKey as string, { algorithms: ["RS256"] });
    console.log("Decoded token:", decoded); // Debug output to verify token
    request.user = decoded as User;
  } catch (err) {
    server.log.error(err);
    reply.code(401).send({ error: "Unauthorized" });
    throw err; // propagate error to stop further processing
  }
}

// Role-checking preValidation hooks
function requireRole(...roles: string[]) {
  return async (request: RequestWithUser, reply: FastifyReply): Promise<void> => {
    try {
      await verifyJWT(request, reply);
    } catch (err) {
      // Verification failed and response is already sent
      return;
    }
    const userRoles = request.user?.realm_access?.roles || [];
    if (!roles.some((role) => userRoles.includes(role))) {
      return reply.code(403).send({ error: "Forbidden: Insufficient role" });
    }
  };
}

// Define routes with role-based preValidation
server.get(
  "/cardone",
  { preValidation: requireRole("admin") },
  async (request: RequestWithUser, reply: FastifyReply) => {
    return { message: "Hello cardone, admin access confirmed!" };
  }
);

server.get(
  "/cardtwo",
  { preValidation: requireRole("admin", "user") },
  async (request: RequestWithUser, reply: FastifyReply) => {
    return { message: "Hello cardtwo, admin or user access confirmed!" };
  }
);

server.get(
  "/cardthree",
  { preValidation: requireRole("user") },
  async (request: RequestWithUser, reply: FastifyReply) => {
    return { message: "Hello cardthree, user access confirmed!" };
  }
);

server.get(
  "/cardfour",
  { preValidation: requireRole("user") },
  async (request: RequestWithUser, reply: FastifyReply) => {
    return { message: "Hello cardfour, user access confirmed!" };
  }
);

// Start server
const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log(`Server listening at ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
