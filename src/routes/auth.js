import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  async (req, res) => {
    //res.redirect(`${process.env.FRONT_END_BASE_URL}/u/${req.user.google_id}`);

    try {
      const result = await pool.query(
        "SELECT name, email FROM users WHERE google_id = $1",
        [req.google_id]
      );
      if (result.rows.length === 0) {
        console.log("Usuário não encontrado. Inserindo novo usuário.");

        await pool.query(
          "INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3)",
          [req.google_id, req.user.name, req.user.email]
        );

        //return res.status(201).json({ name, email });
        return res.redirect(`${process.env.FRONT_END_BASE_URL}/u/${req.user.google_id}`);
      }
    }
    catch (e) {
      console.log(e + ' DEU ERRO!')
    }

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
