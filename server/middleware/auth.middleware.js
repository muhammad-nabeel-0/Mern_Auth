import jwt from 'jsonwebtoken';

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  // ✅ 1. Token must exist
  if (!token) {
    return res.status(401).json({
      success: false,  // ❌ Was incorrectly set to true
      message: "Not authorized. Please log in again.",
    });
  }

  try {
    // ✅ 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 3. Attach user ID to req.user
    if (decoded?.id) {
      req.user = decoded.id;
      next(); // ✅ Proceed to next middleware/controller
    } else {
      return res.status(401).json({
        success: false,
        message: "Token is invalid.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed: " + error.message,
    });
  }
};
