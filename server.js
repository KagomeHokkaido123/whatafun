import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // serwuje frontend

const SN_URL = "https://pepcodev.service-now.com/api/sn_customerservice/portal_case_api";
const SN_USER = process.env.SN_USER;
const SN_PASS = process.env.SN_PASS;
const AUTH = Buffer.from(`${SN_USER}:${SN_PASS}`).toString("base64");

app.post("/create-case", async (req, res) => {
  try {
    const data = {
      priority: req.body.priority,
      short_description: req.body.short_description,
      opened_by: req.body.opened_by
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
