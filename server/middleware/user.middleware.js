import jwt from 'jsonwebtoken'
export const userDataAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login Again"
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    const demo = req.body.userId
        console.log(demo)

    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id }; // ✅ Don't use req.body
      next();
    } else {
      return res.status(401).json({ success: false, message: "API error" });
    }

  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}
