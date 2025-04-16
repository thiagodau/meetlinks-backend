import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect(`${process.env.FRONT_END_BASE_URL}/u/${req.user.google_id}`);
  }
);

router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Falha na autenticação." });
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONT_END_BASE_URL}`);
  });
});

export default router;
