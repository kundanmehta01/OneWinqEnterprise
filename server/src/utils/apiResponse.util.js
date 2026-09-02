export class ApiResponse {
  static success(res, { statusCode = 200, message = 'Operation successful', data = {}, meta } = {}) {
    const response = {
      success: true,
      message,
      data
    };
    if (meta) {
      response.meta = meta;
    }
    return res.status(statusCode).json(response);
  }

  static created(res, { message = 'Resource created successfully', data = {}, meta } = {}) {
    return ApiResponse.success(res, { statusCode: 201, message, data, meta });
  }

  static paginated(res, { data = [], pagination = {}, message = 'Data retrieved successfully' } = {}) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination
    });
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static error(res, { statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', message = 'Internal Server Error', details = null } = {}) {
    const response = {
      success: false,
      error: {
        code: errorCode,
        message
      }
    };
    if (details) {
      response.error.details = details;
    }
    return res.status(statusCode).json(response);
  }
}
