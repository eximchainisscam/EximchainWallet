import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { mnemonicToSeed, validateMnemonic } from 'bip39';

import { InsecureWalletName } from 'config';
import translate, { translateRaw } from 'translations';
import { formatMnemonic } from 'utils/formatters';
import { AppState } from 'features/reducers';
import { configSelectors, configNetworksStaticSelectors } from 'features/config';
import { TogglablePassword } from 'components';
import { Input } from 'components/ui';
import DeterministicWalletsModal from './DeterministicWalletsModal';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath;
  dPaths: DPath[];
}

type Props = OwnProps & StateProps;

interface State {
  phrase: string;
  formattedPhrase: string;
  pass: string;
  seed: string;
  dPath: DPath;
}

class MnemonicDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    phrase: '',
    formattedPhrase: '',
    pass: '',
    seed: '',
    dPath: this.props.dPath
  };

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.dPath !== nextProps.dPath) {
      this.setState({ dPath: nextProps.dPath });
    }
  }

  public render() {
    const { phrase, formattedPhrase, seed, dPath, pass } = this.state;
    const isValidMnemonic = validateMnemonic(formattedPhrase);

    return (
      <React.Fragment>
        <div id="selectedTypeKey">
          <div className="form-group">
            <TogglablePassword
              value={phrase}
              rows={4}
              placeholder={translateRaw('X_MNEMONIC')}
              isValid={isValidMnemonic}
              isTextareaWhenVisible={true}
              onChange={this.onMnemonicChange}
              onEnter={isValidMnemonic ? this.onDWModalOpen : undefined}
            />
          </div>
          <div className="form-group">
            <p>{translate('ADD_LABEL_8')}</p>
            <Input
              isValid={true}
              showValidAsPlain={true}
              value={pass}
              onChange={this.onPasswordChange}
              placeholder={translateRaw('INPUT_PASSWORD_LABEL')}
              type="password"
            />
          </div>
          <div className="form-group">
            <button
              style={{ width: '100%' }}
              onClick={this.onDWModalOpen}
              className="btn btn-primary "
              disabled={!isValidMnemonic}
            >
              {translate('MNEMONIC_CHOOSE_ADDR')}
            </button>
          </div>
        </div>

        <DeterministicWalletsModal
          isOpen={!!seed}
          seed={seed}
          dPath={dPath}
          dPaths={this.props.dPaths}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
        />
      </React.Fragment>
    );
  }

  public onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ pass: e.currentTarget.value });
  };

  public onMnemonicChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const phrase = e.currentTarget.value;
    const formattedPhrase = formatMnemonic(phrase);

    this.setState({
      phrase,
      formattedPhrase
    });
  };

  public onDWModalOpen = () => {
    const { formattedPhrase, pass } = this.state;

    if (!validateMnemonic(formattedPhrase)) {
      return;
    }

    try {
      const seed = mnemonicToSeed(formattedPhrase, pass).toString('hex');
      this.setState({ seed });
    } catch (err) {
      console.log(err);
    }
  };

  private handleCancel = () => {
    this.setState({ seed: '' });
  };

  private handlePathChange = (dPath: DPath) => {
    this.setState({ dPath });
  };

  private handleUnlock = (address: string, index: number) => {
    const { formattedPhrase, pass, dPath } = this.state;

    this.props.onUnlock({
      path: `${dPath.value}/${index}`,
      pass,
      phrase: formattedPhrase,
      address
    });

    this.setState({
      seed: '',
      pass: '',
      phrase: '',
      formattedPhrase: ''
    });
  };
}

function mapStateToProps(state: AppState): StateProps {
  return {
    // Mnemonic dPath is guaranteed to always be provided
    dPath: configSelectors.getSingleDPath(state, InsecureWalletName.MNEMONIC_PHRASE) as DPath,
    dPaths: configNetworksStaticSelectors.getPaths(state, InsecureWalletName.MNEMONIC_PHRASE)
  };
}

export const MnemonicDecrypt = connect(mapStateToProps)(MnemonicDecryptClass);
