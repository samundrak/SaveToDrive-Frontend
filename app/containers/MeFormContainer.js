/* eslint-disable */
// import { reduxForm } from 'redux-form';
import MeForm from 'components/MeForm';
import { formRules } from 'utils/ValidationRules';
import { userProfileUpdate } from 'app/actions/MeActions';
import toast from 'utils/Toast';

const updateUser = function updateUser(user, dispatch) {
  dispatch(userProfileUpdate(user)).then(
    () => toast('Profile has been updated.'),
    err => toast(err, 'error')
  );
};

// Decorate the form component
export default MeForm;
// reduxForm({
//   form: 'MeForm', // a unique name for this form
//   fields: ['first_name', 'last_name'],
//   validate: formRules,
//   onSubmit: updateUser,
// })(MeForm);
