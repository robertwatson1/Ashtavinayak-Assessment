const express = require('express');
const router = express.Router();
const { Joi, validate } = require('express-validation');
const Exercise = require('../models/exercise');


/**
 * API: /exercise/get-data
 */
 router.get("/get-data", async function (req, res, next) {
    try {
        const data = await Exercise.find();
        if(!data) {
            return res.json({
                status: false,
                message: "No program exist!"
            })
        }

        res.json({
            status: true,
            data: data,
            message: "Successfully Created!",
        });
    }
    catch(err) {
        res.json({
            status: false,
            message: "Getting Exercise Error - " + err.string()
        });
    }
});


/**
 * API: /exercise/create
 */
router.post("/create", validate({
    body: Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        length: Joi.number().required(),
        // photo: 
    })
}, {}, {}), async function (req, res, next) {
    try {
        const {
            id,
            name,
            length
        } = req.body;

        const existOne = await Exercise.findOne({
            id: id
        });
        if(existOne) {
            return res.json({
                status: false,
                message: "Exercise already exist!"
            })
        }

        const data = new Exercise();
        data.id = id;
        data.name = name;
        data.length = length;

        await data.save();

        res.json({
            status: true,
            message: "Successfully Created!"
        });
    }
    catch(err) {
        res.json({
            status: false,
            message: "Creating Error - " + err.string()
        });
    }
});


/**
 * API: /exercise/delete
 */
 router.post("/delete", validate({
    body: Joi.object({
        id: Joi.number().required(),
    })
}, {}, {}), async function (req, res, next) {
    try {
        const {
            id,
        } = req.body;

        const data = await Exercise.findOne({
            id: id
        });

        if(!data) {
            return res.json({
                status: false,
                message: "Exercise not exist!"
            })
        }

        await data.deleteOne();

        res.json({
            status: true,
            message: "Successfully Deleted!"
        });
    }
    catch(err) {
        res.json({
            status: false,
            message: "Deleting Error - " + err.string()
        });
    }
});

module.exports = router;