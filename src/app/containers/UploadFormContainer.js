import React from 'react';
// import { reduxForm } from 'redux-form';
import UploadForm from 'components/UploadForm';

const uploadUrlSelected = function uploadUrlSelected(upload) {
  if (!upload.isNewFileName) {
    delete upload.file_name; // eslint-disable-line
  }
};

// Decorate the form component
export default UploadForm;
//  reduxForm({
//   form: 'UploadForm', // a unique name for this form
//   fields: ['file_url', 'file_name', 'shouldSendEmail', 'isNewFileName'],
//   validate: (data) => {
//     const errors = {};
//     ['File_url', 'File_name', 'IsNewFileName'].forEach((field) => {
//       const lowerCaseField = field.toLowerCase();

//       if (lowerCaseField === 'file_url' && !data[lowerCaseField]) {
//         errors[lowerCaseField] = 'This field is required';
//       }
//       if (lowerCaseField === 'isnewfilename' && data.isNewFileName && !data.file_name) {
//         errors.file_name = 'Please enter file name.';
//       }
//     });
//     return errors;
//   },
//   onSubmit: uploadUrlSelected,
// })(UploadForm);
