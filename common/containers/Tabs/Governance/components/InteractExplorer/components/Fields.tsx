import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyTransaction } from './CopyTransaction';
import { SendButton, TXMetaDataPanel } from 'components';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { FullWalletOnly } from 'components/renderCbs';
import translate, { translateRaw } from 'translations';
import { walletSelectors } from 'features/wallet';
import { AppState } from 'features/reducers';
import { addHexPrefix } from 'ethereumjs-util';

import * as derivedSelectors from 'features/selectors';

import { CodeBlock } from 'components/ui';
import { getTransactionFields, makeTransaction } from 'libs/transaction';

interface StateProps {
  serializedTransaction: AppState['transaction']['sign']['local']['signedTransaction'];
  walletType: walletSelectors.IWalletType;
}
interface OwnProps {
  button: React.ReactElement<any>;
  onClick?: any;
  confirmTransaction: boolean;
}

type Props = OwnProps & StateProps;

export class FieldsClass extends Component<Props> {
  public render() {
    const { serializedTransaction, walletType } = this.props;
    let body;
    const getStringifiedTx = (serializedTx: Buffer) =>
      JSON.stringify(getTransactionFields(makeTransaction(serializedTx)), null, 2);
    const makeContent = () => {
      if (this.props.confirmTransaction) {
        body = (
          <React.Fragment>
            <h2 className="FormInput-title">{translate('ConfirmTransaction')}</h2>
            <p className="FormInput-subtitle">{translate('ConfirmTransactionDescription')}</p>
            {/* shows the json representation of the transaction */}
            <div className="col-xs-12">
              <label>
                {walletType.isWeb3Wallet ? 'Transaction Parameters' : translate('SEND_RAW')}
                <CopyTransaction text={getStringifiedTx(serializedTransaction as Buffer)} />
              </label>
              <CodeBlock className="RawTransaction">
                {getStringifiedTx(serializedTransaction as Buffer)}
              </CodeBlock>
            </div>
            {serializedTransaction && (
              <div className="col-xs-12">
                <label>
                  {walletType.isWeb3Wallet
                    ? 'Serialized Transaction Parameters'
                    : translate('SEND_SIGNED')}
                  <CopyTransaction text={addHexPrefix(serializedTransaction.toString('hex'))} />
                </label>
                <CodeBlock className="SignedTransaction">
                  {addHexPrefix(serializedTransaction.toString('hex'))}
                </CodeBlock>
              </div>
            )}
            <SendButton />
          </React.Fragment>
        );
      } else {
        body = (
          <React.Fragment>
            <h2 className="FormInput-title">{translate('GovernanceTransactionFee')}</h2>
            <p className="FormInput-subtitle">{translate('GovernanceTransactionFeeDescription')}</p>
            <TXMetaDataPanel
              className="form-group"
              initialState="simple"
              advancedGasOptions={{ dataField: true }}
              shouldTransactionReset={false}
              autoGenGasLimit={false}
            />
            {this.props.button}
            <SendButton />
          </React.Fragment>
        );
      }
      return (
        <React.Fragment>
          <div className="GovernanceSection-form-write">{body}</div>
        </React.Fragment>
      );
    };

    const makeDecrypt = () => (
      <React.Fragment>
        <div className="GovernanceSection-form-write">
          <h2 className="FormInput-title">{translate('UnlockWallet')}</h2>
          <p className="FormInput-subtitle">{translate('UnlockWalletDescription')}</p>
        </div>
        <WalletDecrypt disabledWallets={DISABLE_WALLETS.READ_ONLY} shouldTransactionReset={false} />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <FullWalletOnly withFullWallet={makeContent} withoutFullWallet={makeDecrypt} />
      </React.Fragment>
    );
  }
}

export const Fields = connect((state: AppState) => ({
  serializedTransaction: derivedSelectors.getSerializedTransaction(state),
  walletType: walletSelectors.getWalletType(state)
}))(FieldsClass);
