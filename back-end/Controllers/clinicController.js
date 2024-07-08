import Clinic from "../models/ClinicSchema.js";

export const createClinic = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const clinic = new Clinic({ name, location });
    await clinic.save();

    res.status(201).json({ success: true, message: "Clinic created successfully", data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.status(200).json({ success: true, message: "Clinics retrieved successfully", data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({ success: false, message: "Clinic not found" });
    }

    res.status(200).json({ success: true, message: "Clinic retrieved successfully", data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClinic = async (req, res) => {
  try {
    const { name, location } = req.body;

    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({ success: false, message: "Clinic not found" });
    }

    clinic.name = name || clinic.name;
    clinic.location = location || clinic.location;

    await clinic.save();

    res.status(200).json({ success: true, message: "Clinic updated successfully", data: clinic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);

    if (!clinic) {
      return res.status(404).json({ success: false, message: "Clinic not found" });
    }

    res.status(200).json({ success: true, message: "Clinic deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
