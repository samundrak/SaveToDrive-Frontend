export default function toast(message = '', type = 'success') {
  return alertify.notify(message, type);
}
