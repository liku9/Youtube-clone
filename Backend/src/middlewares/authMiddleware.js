import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Retrieve the 'Authorization' header from the incoming HTTP request, which is expected to contain the JWT token
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  // Verify the JWT token and decode the user information
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user information to the request object for use in subsequent middleware
    req.user = decoded;   // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;