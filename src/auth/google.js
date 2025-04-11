import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "../db/index.js";

passport.serializeUser((user, done) => {
  done(null, user.google_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // Aqui você pode salvar o token no banco, ou na sessão
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE google_id = $1",
    [profile.id]
  );

  if (existingUser.rows.length > 0) {
    // Atualiza o token no banco se quiser
    await pool.query(
      "UPDATE users SET access_token = $1 WHERE google_id = $2",
      [accessToken, profile.id]
    );
    return done(null, { ...existingUser.rows[0], accessToken });
  } else {
    const newUser = await pool.query(
      "INSERT INTO users (google_id, name, email, access_token) VALUES ($1, $2, $3, $4) RETURNING *",
      [profile.id, profile.displayName, profile.emails[0].value, accessToken]
    );
    return done(null, { ...newUser.rows[0], accessToken });
  }
}));
