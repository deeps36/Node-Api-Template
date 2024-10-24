import express from 'express';
import * as gernal from '../controllers/gernalController.js'; // Import all controller functions

const router = express.Router();

// Define routes
router.post('/insertData', gernal.insertData);
router.post('/updateData', gernal.updateData);
router.post('/getData', gernal.getData);
router.post('/deleteData', gernal.deleteData);

// Export the router function
export default (app) => {
    app.use('/', router);
};
