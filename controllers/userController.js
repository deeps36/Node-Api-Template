const jwt = require('jsonwebtoken');
const db = require("../models");
const myRes = require("../utils/responseHandler");


// Change according to use as it's configured not according to user table
exports.registerUser = (req, res) => {
    if (params.verifyParam(req, res) === true) {
        const tokenPayload = {
            id: 1,
        };
        const token = jwt.generateToken(tokenPayload);
        const refreshToken = jwt.generateRefreshToken(tokenPayload);


        db.user.create({
            username: req.body['user_token'],
            email: req.body['email'],
            phone: req.body['phone'],
            password: req.body['password'],
            // user_token: req.body['user_token'],  //for firebase
            // fcm_token: req.body['fcm_token'],    //for firebase
            // login_type: req.body['login_type'],  //for firebase
            // status: req.body['status'],
        }).then(user => {
            db.privacy.create({
                uid: user.user_id,
                pid: 0
            }).then(() => {
                myRes.successResponse(res, { msg: user, token: token, refreshToken: refreshToken });
            }).catch(error => {
                myRes.errorResponse(res, error.message);
            });

        }).catch(error => {
            console.log(error);
            myRes.errorResponse(res, error.message);
        });

    }
}


exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.user.findOne({
            where: { username, password },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        myRes.successResponse(res, {
            id: user.id,
            name: user.name,
            isMaster: user.isMaster,
            mobile: user.mobile,
            type_id: user.type_id,
            token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.insertPatient = async (req, res) => {
    const { name, mobile, city, country, pain, url, start_date, end_date, package, created_by, type_id } = req.body;

    const t = await db.sequelize.transaction();

    try {
        const newPatient = await db.patient.create({
            name,
            mobile,
            city,
            country,
            pain,
            url,
            start_date,
            end_date,
            package,
            created_by,
            type_id
        }, { transaction: t });

        await db.statusUpdate.create({
            patient_id: newPatient.id,
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ success: true, message: 'Patient inserted successfully.' });
    } catch (error) {
        await t.rollback();
        console.error('Error inserting patient:', error);
        res.status(500).json({ success: false, error: 'Failed to insert patient.' });
    }
};

exports.deletePatient = async (req, res) => {
    const { id } = req.body;

    const t = await db.sequelize.transaction();

    try {
        const patient = await db.patient.findByPk(id, { transaction: t });

        if (!patient) {
            await t.rollback();
            return res.status(404).json({ success: false, error: 'Patient not found.' });
        }

        await db.statusUpdate.destroy({
            where: { patient_id: id },
            transaction: t
        });

        await patient.destroy({ transaction: t });

        await t.commit();

        res.status(200).json({ success: true, message: 'Patient deleted successfully.' });
    } catch (error) {
        await t.rollback();
        console.error('Error deleting patient:', error);
        res.status(500).json({ success: false, error: 'Failed to delete patient.' });
    }
};
