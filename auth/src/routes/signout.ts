import express from "express";


const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null; // delete all session data include jwt token - so user no considerd signed anymore
  res.send({});
});

export { router as signoutRouter };
