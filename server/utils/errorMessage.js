'use strict'

class ErrorMessage {
  static createFromJoi (error, joiError) {
    // Todo format joi error to a specific format
    return {
      code: error.code,
      message: error.message,
      fields: joiError.details.map((e) => ({field: e.path, message: e.message}))
    }
  }
}

module.exports = ErrorMessage
