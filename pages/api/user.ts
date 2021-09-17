import withSession from "/lib/session";

export default withSession(async (req, res) => {
  const user = req.session.get("user");

  if (user) {
    res.json({
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
});