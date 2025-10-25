import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // serwuje frontend

const SN_INSTANCE = "https://pepcodev.service-now.com"
const SN_URL = "https://pepcodev.service-now.com/api/sn_customerservice/portal_case_api";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SN_USER = process.env.SN_USER;
const SN_PASS = process.env.SN_PASS;

let accessToken = null;

// 🔹 Funkcja do pobrania tokenu
async function getToken() {
  const response = await fetch(`${SN_INSTANCE}/oauth_token.do`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "password_credentials",
      code: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: SN_USER,
      password: SN_PASS
      
    })
  });

  const data = await response.json();
  if (data.access_token) {
    accessToken = data.access_token;
    console.log("Access token uzyskany !" + accessToken);
  } else {
    console.error("Błąd tokenu:", data);
  }
}
// 🔹 Endpoint do utworzenia zgłoszenia
app.post("/create-case", async (req, res) => {
  if (!accessToken) await getToken();

  const response = await fetch(`${SN_INSTANCE}/api/sn_customerservice/portal_case_api`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      priority: req.body.priority,
      short_description: req.body.short_description,
      opened_by: req.body.opened_by
    })
  });

  const result = await response.json();
  res.status(response.status).json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
