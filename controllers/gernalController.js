import db from '../models/index.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const insertData = async (req, res) => {
  try {
    const { table, ...fieldsToInsert } = req.body;

    if (!table) {
      return errorResponse(res, 'Table name not provided.');
    }

    const dynamicModel = db[table];
    if (!dynamicModel) {
      return errorResponse(res, 'Table not found.');
    }

    if (Object.keys(fieldsToInsert).length === 0) {
      return errorResponse(res, 'No valid fields provided for insert.');
    }

    const newRecord = dynamicModel.build(fieldsToInsert);
    const savedRecord = await newRecord.save();

    successResponse(res, {
      msg: `${table} data inserted successfully.`,
      id: savedRecord.id,
    });
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const updateData = async (req, res) => {
  try {
    const { table, id, ...fieldsToUpdate } = req.body;

    if (!table || !id) {
      return errorResponse(res, 'Table or ID not provided.');
    }

    const dynamicModel = db[table];
    if (!dynamicModel) {
      return errorResponse(res, 'Table not found.');
    }

    const existingData = await dynamicModel.findByPk(id);
    if (!existingData) {
      return errorResponse(res, 'Data not found.');
    }

    await existingData.update(fieldsToUpdate);
    const updatedData = await dynamicModel.findByPk(id);

    successResponse(res, updatedData);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const getData = async (req, res) => {
  try {
    const { table, filters } = req.body;

    if (!table) {
      return errorResponse(res, 'Table name not provided.');
    }

    const dynamicModel = db[table];
    if (!dynamicModel) {
      return errorResponse(res, 'Table not found.');
    }

    const queryOptions = filters ? { where: filters } : {};
    const records = await dynamicModel.findAll(queryOptions);

    successResponse(res, records);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

export const deleteData = async (req, res) => {
  try {
    const { table, id } = req.body;

    if (!table || !id) {
      return errorResponse(res, 'Table name or ID not provided.');
    }

    const dynamicModel = db[table];
    if (!dynamicModel) {
      return errorResponse(res, 'Table not found.');
    }

    const record = await dynamicModel.findByPk(id);
    if (!record) {
      return errorResponse(res, 'Record not found.');
    }

    await record.destroy();
    successResponse(res, { success: true, message: 'Record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting record:', error);
    errorResponse(res, error.message);
  }
};
