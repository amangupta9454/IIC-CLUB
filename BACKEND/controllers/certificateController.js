import Certificate from '../models/Certificate.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

export const getMyCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id }).sort({ issuedAt: -1 });
    res.json(certificates);
  } catch (error) {
    next(error);
  }
};

export const uploadCertificate = async (req, res, next) => {
  try {
    const { certificateTitle, eventName } = req.body;
    let certificateFile = '';
    if (req.file?.buffer) {
      certificateFile = await uploadBufferToCloudinary(req.file.buffer, 'iic-innovation/certificates', 'image');
    }
    if (!certificateFile && !certificateTitle) {
      res.status(400);
      throw new Error('Certificate file or title required');
    }
    const cert = await Certificate.create({
      studentId: req.user._id,
      certificateTitle: certificateTitle || '',
      eventName: eventName || '',
      certificateFile,
      imageUrl: certificateFile,
      title: certificateTitle || 'Certificate',
      status: 'pending',
    });
    res.status(201).json(cert);
  } catch (error) {
    next(error);
  }
};
