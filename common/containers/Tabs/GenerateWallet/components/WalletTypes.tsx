import React from 'react';
import { Link } from 'react-router-dom';
import translate, { translateRaw } from 'translations';
import { WalletType } from '../GenerateWallet';
import { NewTabLink } from 'components/ui';
import { trezorReferralURL } from 'config';
import Template from './Template';
import MetamaskIcon from 'assets/images/wallets/metamask.svg';
import HardwareWalletIcon from 'assets/images/wallets/hardware.svg';
import FileIcon from 'assets/images/wallets/file.svg';
import './WalletTypes.scss';

interface State {
  isShowingGenerate: boolean;
}

export default class WalletTypes extends React.Component<{}, State> {
  public state: State = {
    isShowingGenerate: false
  };

  public render() {
    const { isShowingGenerate } = this.state;
    return (
      <Template hideBack={!isShowingGenerate} onBack={this.handleBack}>
        {isShowingGenerate ? (
          <GenerateOptions />
        ) : (
          <WalletSuggestions showGenerate={this.showGenerate} />
        )}
      </Template>
    );
  }

  private showGenerate = () => {
    this.setState({ isShowingGenerate: true });
  };

  private handleBack = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    this.setState({ isShowingGenerate: false });
  };
}

interface WalletSuggestionsProps {
  showGenerate(): void;
}

interface WalletSuggestion {
  name: React.ReactElement<string>;
  description?: string;
  type: string;
  icon: string;
  bullets: React.ReactElement<string>[];
  links: {
    text: React.ReactElement<string>;
    href?: string;
    onClick?(): void;
  }[];
}

const WalletSuggestions: React.SFC<WalletSuggestionsProps> = ({ showGenerate }) => {
  const suggestions: WalletSuggestion[] = [
    {
      name: translate('TREZOR_REFERAL'),
      description: translate('ADD_HARDWAREDESC'),
      type: 'hardware',
      // icon: HardwareWalletIcon,
      bullets: [
        // translate('WALLET_SUGGESTION_HARDWARE_1'),
        // translate('WALLET_SUGGESTION_HARDWARE_2'),
        // translate('WALLET_SUGGESTION_HARDWARE_3'),
        // translate('WALLET_SUGGESTION_HARDWARE_4')
      ],
      links: [
        {
          text: translate('TREZOR_REFERAL'),
          href: trezorReferralURL
        }
      ]
    }
    // {
    //   name: translate('X_METAMASK'),
    //   description: translate('X_METAMASKDESC'),
    //   type: 'metamask',
    //   icon: MetamaskIcon,
    //   bullets: [
    //     translate('WALLET_SUGGESTION_METAMASK_1'),
    //     translate('WALLET_SUGGESTION_METAMASK_2'),
    //     translate('WALLET_SUGGESTION_METAMASK_3'),
    //     translate('WALLET_SUGGESTION_METAMASK_4'),
    //     translate('WALLET_SUGGESTION_METAMASK_5')
    //   ],
    //   links: [
    //     {
    //       text: translate('ACTION_13', {
    //         $thing: translateRaw('X_METAMASK')
    //       }),
    //       href: 'https://metamask.io/'
    //     }
    //   ]
    // }
    // {
    //   name: translate('X_PARITYSIGNER'),
    //   description: translate('ADD_PARITY_DESC'),
    //   type: 'parity',
    //   icon: ParitySignerIcon,
    //   bullets: [
    //     // translate('WALLET_SUGGESTION_PARITYSIGNER_1'),
    //     translate('WALLET_SUGGESTION_PARITYSIGNER_2'),
    //     translate('WALLET_SUGGESTION_PARITYSIGNER_3')
    //     // translate('WALLET_SUGGESTION_PARITYSIGNER_4')
    //   ],
    //   links: [
    //     {
    //       text: translate('DOWNLOAD_PHONE_APP', { $os: 'iOS' }),
    //       href: 'https://itunes.apple.com/us/app/parity-signer/id1218174838'
    //     },
    //     {
    //       text: translate('DOWNLOAD_PHONE_APP', { $os: 'Android' }),
    //       href: 'https://play.google.com/store/apps/details?id=com.nativesigner'
    //     }
    //   ]
    // }
  ];

  if (process.env.BUILD_DOWNLOADABLE) {
    suggestions[1] = {
      name: translate('NAV_GENERATEWALLET'),
      description: translate('NAV_GENERATEWALLETDESC'),
      type: 'generate',
      // icon: FileIcon,
      bullets: [
        // translate('WALLET_SUGGESTION_GENERATE_1'),
        // translate('WALLET_SUGGESTION_GENERATE_2'),
        // translate('WALLET_SUGGESTION_GENERATE_3'),
        // translate('WALLET_SUGGESTION_GENERATE_4'),
        // <span key="warning">
        //   <i className="fa fa-exclamation-circle is-warning" />
        //   {translate('WALLET_SUGGESTION_GENERATE_5')}
        // </span>
      ],
      links: [
        {
          text: translate('Generate a wallet'),
          onClick: showGenerate
        }
      ]
    };
  }

  return (
    <React.Fragment>
      <div className="WalletTypes-topsection">
        <h2 className="WalletTypes-topsection-title">{translate('GENERATE_WALLET_TITLE')}</h2>
      </div>
      <div className="WalletTypes-suggestions">
        <h2 className="WalletTypes-topsection-subtitle">
          {translate('GENERATE_WALLET_SUGGESTIONS')}
        </h2>
        {suggestions.map(sug => (
          <div className={`WalletSuggestion is-${sug.type}`}>
            <h3 className="WalletSuggestion-name">
              <img className="WalletSuggestion-name-icon" src={sug.icon} />
              {sug.name}
            </h3>
            <p className="WalletSuggestion-description">{sug.description}</p>

            <ul className="WalletSuggestion-features">
              {sug.bullets.map((b, idx) => (
                <li key={idx} className="WalletSuggestion-features-feature">
                  {b}
                </li>
              ))}
            </ul>

            <div className="WalletSuggestion-buttons">
              {sug.links.map(link => {
                if (link.onClick) {
                  return (
                    <button
                      onClick={link.onClick}
                      className="WalletSuggestion-buttons-button btn btn-default"
                    >
                      {link.text}
                    </button>
                  );
                }
                if (link.href) {
                  return (
                    <NewTabLink
                      href={link.href}
                      className="WalletSuggestion-buttons-button btn btn-default"
                    >
                      {link.text}
                    </NewTabLink>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {!process.env.BUILD_DOWNLOADABLE && (
        <React.Fragment>
          <div className="WalletTypes-divider">{translate('OR')}</div>

          <div className="WalletTypes-download">
            <NewTabLink
              href="https://github.com/Eximchain/EximchainWallet"
              className="WalletTypes-download-button btn btn-primary "
            >
              {translate('WALLET_SUGGESTION_DESKTOP_APP')}
            </NewTabLink>
            <p className="WalletTypes-download-desc">
              {translate('WALLET_SUGGESTION_DESKTOP_APP_DESC')}
            </p>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const GenerateOptions: React.SFC<{}> = () => {
  const walletTypes = [
    {
      type: WalletType.Keystore,
      name: translateRaw('X_KEYSTORE2'),
      bullets: [
        translate('GENERATE_WALLET_KEYSTORE_1'),
        translate('GENERATE_WALLET_KEYSTORE_2'),
        translate('GENERATE_WALLET_KEYSTORE_3'),
        // translate('GENERATE_WALLET_KEYSTORE_4'),
        translate('GENERATE_WALLET_KEYSTORE_5')
      ]
    },
    {
      type: WalletType.Mnemonic,
      name: translateRaw('X_MNEMONIC'),
      bullets: [
        translate('GENERATE_WALLET_MNEMONIC_1'),
        translate('GENERATE_WALLET_MNEMONIC_2'),
        translate('GENERATE_WALLET_MNEMONIC_3'),
        // translate('GENERATE_WALLET_MNEMONIC_4'),
        translate('GENERATE_WALLET_MNEMONIC_5')
      ]
    }
  ];

  return (
    <React.Fragment>
      <h1 className="WalletTypes-title">{translate('NAV_GENERATEWALLET')}</h1>

      <div className="WalletTypes-types">
        {walletTypes.map(wallet => (
          <div key={wallet.type} className="WalletType">
            <h3 className="WalletType-title">{wallet.name}</h3>
            <ul className="WalletType-features">
              {wallet.bullets.map((bullet, idx) => (
                <li key={idx} className="WalletType-features-feature">
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="WalletType-select">
              <Link
                className="WalletType-select-btn btn btn-primary btn-block"
                to={`/generate/${wallet.type}`}
              >
                {translate('GENERATE_THING', { $thing: wallet.name })}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};
