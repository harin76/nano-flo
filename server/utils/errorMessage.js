'use strict'
const VALIDATION_ERROR = 'Validtion error'

class ErrorMessage {
  static create (code, message) {
    return {
      code,
      message
    }
  }

  static createJoi (code, error) {
    // Todo format joi error to a specific format
    return {
      code,
      message: VALIDATION_ERROR,
      fields: error.details.map((e) => ({field: e.path, message: e.message}))
    }
  }
}

module.exports = ErrorMessage
