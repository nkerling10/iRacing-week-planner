import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { acknowledgeAuthError, ERROR_RESET, forgottenPassword } from '../../actions/auth';
import Modal from './Modal';

function ForgottenPasswordModal({ isOpen, onClose, error, loading, forgottenPassword, acknowledgeAuthError }) {
  const { t } = useTranslation();
  const [ email, setEmail ] = useState('');
  const [ thanksModal, setThanksModal ] = useState(false);

  const submitClick = async () => {
    const output = await forgottenPassword(email);
    if (output.type !== ERROR_RESET) {
      setEmail('');
      setThanksModal(true);
    }
  };

  const closeThanks = () => {
    setThanksModal(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('Reset Password')} doneAction={onClose} showFooter={false}>
      <div className='container-fluid'>
        <p>{t('Enter your email address to reset your password.')}</p>
        {loading ? (
          <div>Loading…</div>
        ): (
          <form onSubmit={(e) => {
            e.preventDefault();
            submitClick();
          }}>
            {error && (
              <div className="alert alert-warning alert-dismissible" role="alert">
                <button type="button" aria-label="Close" onClick={acknowledgeAuthError}><span
                  aria-hidden="true">&times;</span></button>
                {t(error)}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="loginEmail">{t('Email address')}</label>
              <input type="email" className="form-control" id="loginEmail" placeholder={t('Email address')}
                     onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <button type="submit" className="btn btn-default">Submit</button>
          </form>
        )}
      </div>
      <Modal
        isOpen={thanksModal}
        onClose={closeThanks}
        title={t('Reset Password')}
        doneAction={closeThanks}
      >
        <div className='container-fluid'>
          <p>{t('Thanks, please check your email for further details.')}</p>
        </div>
      </Modal>
    </Modal>
  );
}

ForgottenPasswordModal.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  forgottenPassword: PropTypes.func.isRequired,
  acknowledgeAuthError: PropTypes.func.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired
};

ForgottenPasswordModal.defaultProps = {
  onClose: () => {},
  isOpen: false,
  error: null,
};

const mapStateToProps = (state) => ({
  error: state.auth.errorReset,
  loading: state.auth.loadingReset,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  forgottenPassword,
  acknowledgeAuthError,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenPasswordModal)
