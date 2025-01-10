import { validateDocumentAction } from './validate-document.action';
import { validatePasswordAction } from './validate-password.actions';
import { createExternalUserAction } from './create-external-user.action';
import { loginAction } from './login.action';
import { moreInfoAction } from './more-info.action';
import { resetPasswordAction } from './reset-password.action';
import { forgotPasswordAction } from './forgot-password.action';
import { subscribeAction } from './subscribe.action';
import { validateCertificateAction } from './validate-certificate.action';
import { getIzipayPaymentDataAction } from './get-izipay-payment-data.action';
import { updateBillingAddressAction } from './update-billing-address.action';
import { processPaymentAction } from './process-payment.action';
import { validateEnrollAction } from './validate-enroll.action';
import { cancelOrderAction } from './cancel-order.action';

export const server = {
  validateDocument: validateDocumentAction,
  validatePassword: validatePasswordAction,
  createExternalUser: createExternalUserAction,
  login: loginAction,
  moreInfo: moreInfoAction,
  resetPassword: resetPasswordAction,
  forgotPassword: forgotPasswordAction,
  subscribe: subscribeAction,
  validateCertificate: validateCertificateAction,
  getIzipayPaymentData: getIzipayPaymentDataAction,
  updateBillingAddress: updateBillingAddressAction,
  processPayment: processPaymentAction,
  validateEnroll: validateEnrollAction,
  cancelOrder: cancelOrderAction,
};
