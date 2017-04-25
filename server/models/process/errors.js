const errors = {
  UNKNOWN: {code: 'PR0000', message: 'Unknown error'},
  INVALID_PROCESS_DEFINITION: {code: 'PR0001', message: 'Unable to create process, invalid process definition.'},
  PROCESS_NOT_FOUND: {code: 'PR0002', message: 'Process not found.'},
  PROCESS_ALREADY_EXISTS: {code: 'PR0003', message: 'Process already exists.'},
  INVALID_PROCESS_VERSION_DEFINITION: {code: 'PR0004', message: 'Unable to create process version, invalid process version definition.'},
  PROCESS_VERSION_NOT_FOUND: {code: 'PR0005', message: 'Unable to find the process version.'},
  INVALID_PROCESS_VERSION_NUMBER: {code: 'PR0006', message: 'Invalid process version number, version numbers are positive integers.'},
  PROCESS_VERSION_IS_SEALED: {code: 'PR0007', message: 'Process version is already sealed, cannot modify or delete.'},
  PROCESS_VERSION_NUMBER_EXIST: {code: 'PR0008', message: 'Process version number exists.'}
}

module.exports = errors
