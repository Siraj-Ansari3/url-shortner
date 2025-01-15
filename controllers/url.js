const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required." })

    const shortID = shortid.generate();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        createdBy: req.user._id,
        visitHistory: []
    })

    return res.render('home', { id: shortID })
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        TotalClicks: result.visitHistory.length,
        visitHistory: result.visitHistory
    });
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics};