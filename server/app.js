const express = require("express");
const axios = require("axios");
const qs = require("qs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3005;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: "GET, POST",
    credentials: true,
  })
);

app.use(
  session({
    secret: "sghsjgsjkgsejgkb",
    resave: false,
    saveUninitialized: true,
  })
);

const apiTokenUrl = "https://accounts.spotify.com/api/token";

const authHead = qs.stringify({ grant_type: "client_credentials" });

//Environmental variables

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const scope = "user-read-private user-read-email";

const authToken = Buffer.from(
  `${client_id}:${client_secret}`,
  "utf-8"
).toString("base64");

app.get("/login", (req, res) => {
  const state = "325236235w5235235235";
  res.cookie("spotify_state", state);

  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    qs.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
      state,
    });
  res.json(authUrl);
});

app.get("/callback/:code", async (req, res) => {
  const code = req.params["code"];

  try {
    const response = await axios.post(
      apiTokenUrl,
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
      {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    req.session.access_token = access_token;
    req.session.refresh_token = refresh_token;
    res.status(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/dashboard", async (req, res) => {
  try {
    const accessToken = req.session.access_token;
    if (!accessToken) return res.status(401).json({ message: "Unauthorized." });
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers,
    });
    req.session.userData = response.data;
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log("Spotify API fetch has started");
});
