const url = require('url')
const express = require('express');
const router = express.Router();
const needle = require('needle');
const apiCache = require('apicache');

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

// Init cache
let cache = apiCache.middleware

// router.get('/', (req, res) => {
//     res.json({ success: true })
// });

router.get('/', cache('2 minutes'), async (req, res) => {
    try {
        const params = new URLSearchParams({
            ...url.parse(req.url, true).query,
            [API_KEY_NAME]: API_KEY_VALUE
        })
        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        const data = apiRes.body;

        //Log Request for the public API
        if (process.env.NODE_ENV !== 'production') {
            console.log(`REQUEST: ${API_BASE_URL}?${params}`);
        }

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
});

router.get('/greeting', cache('1 minutes'), async (req, res) => {
    try {
        const data = {
            greeting: "Hello World"
        };

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
});

module.exports = router