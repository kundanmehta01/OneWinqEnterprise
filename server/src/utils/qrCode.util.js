import QRCode from 'qrcode';
import { logger } from '../config/logger.config.js';

export const generateQRCodeDataUrl = async (text, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300,
      ...options
    };
    return await QRCode.toDataURL(text, defaultOptions);
  } catch (error) {
    logger.error(`Failed to generate QR Code data URL: ${error.message}`, { error });
    throw error;
  }
};

export const generateQRCodeSvg = async (text, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'svg',
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      ...options
    };
    return await QRCode.toString(text, defaultOptions);
  } catch (error) {
    logger.error(`Failed to generate QR Code SVG: ${error.message}`, { error });
    throw error;
  }
};
