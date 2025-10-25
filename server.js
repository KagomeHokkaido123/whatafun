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

let accessToken = null;

// 🔹 Funkcja do pobrania tokenu
async function getToken() {
  const response = await fetch(`${SN_INSTANCE}/oauth_token.do`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    })
  });

  const data = await response.json();
  if (data.access_token) {
    accessToken = data.access_token;
    console.log("Access token uzyskany!");
  } else {
    console.error("Błąd tokenu:", data);
  }
}

// 🔹 Endpoint do utworzenia zgłoszenia
app.post("/create-case", async (req, res) => {
  try {
    const data = {
      
      short_description: req.body.short_description
    };

    const response = await fetch(SN_URL, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${AUTH}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
