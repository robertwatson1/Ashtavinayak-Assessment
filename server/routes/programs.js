const express = require('express');
const router = express.Router();
const { Joi, validate } = require('express-validation');
const Program = require('../models/program');
const Exercise = require('../models/exercise');


/**
 * API: /program/get-data
 */
router.get("/get-data", async function (req, res, next) {
    try {
        const programs = await Program.find();
        if(!programs) {
            return res.json({
                status: false,
                message: "No program exist!"
            })
        }

        res.json({
            status: true,
            data: programs,
            message: "Successfully Created!",
        });
    }
    catch(err) {
        res.json({
            status: false,
            message: "Getting Programs Error - " + err.string()
        });
    }
});


/**
 * API: /program/create
 */
router.post("/create", validate({
    body: Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        // exercise: Joi.string().required()
    })
}, {}, {}), async function (req, res, next) {
    try {
        const {
            id,
            name,
            // exercise
        } = req.body;

        const existOne = await Program.findOne({
            id: id
        });

        if(existOne) {
            return res.json({
                status: false,
                message: "Program already exist!"
            })
        }

        const program = new Program();
        program.id = id;
        program.name = name;
        // program.exercise = exercise;

        await program.save();

        const allData = await Program.find();

        res.json({
            status: true,
            data: allData,
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
 * API: /program/edit
 */
router.post("/edit", validate({
    body: Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        exercise: Joi.string().required()
    })
}, {}, {}), async function (req, res, next) {
    try {
        const {
            id,
            name,
            exercise
        } = req.body;

        const program = await Program.findOne({
            id: id
        });
        if(!program) {
            return res.json({
                status: false,
                message: "Program not exist!"
            })
        }

        program.id = id;
        program.name = name;
        program.exercise = exercise;

        await program.save();

        const allData = await Program.find();

        res.json({
            status: true,
            data: allData,
            message: "Successfully Edited!"
        });
    }
    catch(err) {
        res.json({
            status: false,
            message: "Editing Error - " + err.string()
        });
    }
});


/**
 * API: /program/delete
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

        const program = await Program.findOne({
            id: id
        });

        if(!program) {
            return res.json({
                status: false,
                message: "Program not exist!"
            })
        }

        await program.deleteOne();

        const allData = await Program.find();

        res.json({
            status: true,
            data: allData,
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


/**
 * API: /program/add-exercise
 */
 router.post("/add-exercise", validate({
    body: Joi.object({
        programId: Joi.number().required(),
        exerciseId: Joi.number().required()
    })
}, {}, {}), async function (req, res, next) {
    try {
        const {
            programId,
            exerciseId
        } = req.body;

        const program = await Program.findOne({
            id: programId
        });

        if(!program) {
            return res.json({
                status: false,
                message: "Program not exist!"
            })
        }


        const exercise = await Exercise.findOne({id: exerciseId});

        const existEx = program.exercise.find(el=>el.id === Number(exerciseId));
        if(existEx) {
            return res.json({
                status: false,
                message: "Can't add because already exist in Program!"
            });
        }

        program.exercise.push({id: exercise.id,  name: exercise.name});

        await program.save();

        const allData = await Program.find();

        res.json({
            status: true,
            data: allData,
            message: "Successfully Added!"
        });
    }
    catch(err) {
        res.json({
            status: false,
            message: "Adding Exercise Error - " + err
        });
    }
});

module.exports = router;