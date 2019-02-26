import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Account, Identification, METHOD_TYPES, Request} from '../../common/dappApi';
import {EosService} from '../../services/eos.service';
import {AccountService} from '../../services/account.service';
import {CHAINID, endpoints, VERSION} from '../../common/config';
import {WalletService} from '../../services/wallet.service';
import {PermissionService} from '../../services/permission.service';
import Error from '../../common/Error';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';
import {Action} from '../../../classes';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import * as moment from 'moment';


@Component({
  selector: 'app-dapp-container',
  templateUrl: './dapp-container.page.html',
  styleUrls: ['./dapp-container.page.scss'],
})
export class DappContainerPage implements OnInit, OnDestroy {

  iframe: any;
  url: string;
  loading = false;
  dappName: string;

  listenFunc: EventListenerOrEventListenerObject;

  constructor(
    private el: ElementRef,
    private accService: AccountService,
    private eosService: EosService,
    private walletService: WalletService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer
  ) {
  }

  async ngOnInit() {
    this.loading = true;
    // const url = 'http://localhost:8080';
    // const url = 'http://localhost:8081';
    // @ts-ignore
    const url = this.route.params.value.url;
    // console.log(url);
    // @ts-ignore
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(decodeURIComponent(url));
    // @ts-ignore
    this.dappName = this.route.queryParams.value.name;
    this.iframe = this.el.nativeElement.querySelector('.browser');
    // console.log(this.iframe);
    this.listenFunc = ev => this.handleMsg(ev);
    window.addEventListener('message', this.listenFunc);
    this.iframe.addEventListener('load', () => {
      this.loading = false;
    });
  }

  async ngOnDestroy() {
    window.removeEventListener('message', this.listenFunc);
  }

  async handleMsg(ev) {
    const {protocol, type} = ev.data;

    if (!protocol || protocol.indexOf('scatter') < 0) {
      return;
    }
    // console.log(ev.data);

    if (type === 'pair') {
      const contentWindow = this.iframe.contentWindow;
      return contentWindow && contentWindow.postMessage({
        protocol: '42/scatters',
        type: 'paired',
        data: true
      }, '*');
    }

    // notice: data includes the `resolve` and `reject` func of promise from dapp api call.
    const request = ev.data.data.data;
    if (!request) {
      return;
    }

    const api = new ApiService(
      request,
      this.iframe.contentWindow,
      this.eosService,
      this.accService,
      this.walletService,
      this.modalCtrl
    );

    const handler = api[METHOD_TYPES[request.type]];
    if (typeof handler === 'function') {
      handler.call(api);
    } else {
      const toast = await this.toastCtrl.create({
        message: '暂不支持api类型:' + request.type,
        position: 'middle',
        color: 'dark',
        duration: 3000
      });

      await toast.present();
    }
  }
}

class ApiService {
  id: string;
  type: string;
  payload: any;

  constructor(
    request: Request,
    private channel: any,
    private eosService: EosService,
    private accService: AccountService,
    private walletService: WalletService,
    private modalCtrl: ModalController
  ) {
    this.id = request.id;
    this.payload = request.payload;
    this.type = request.type;
  }

  response(resp?: any) {
    this.channel.postMessage({
      protocol: '42/scatter',
      type: 'api',
      data: {
        id: this.id,
        result: resp
      }
    }, '*');
  }

  getVersion() {
    this.response(VERSION);
  }

  async getIdentity() {
    const {origin} = this.payload;
    const currName = await this.accService.current();
    const account = await this.eosService.getAccount(currName);
    const perm = account.permissions.find(item => item.perm_name === 'active');
    if (!perm) {
      return this.response();
    }

    const saveAccount: Account = {
      authority: 'active',
      blockchain: 'eos',
      chainId: CHAINID,
      isHardware: false,
      name: currName,
      publicKey: perm.required_auth.keys[0]
    };
    PermissionService.setPermission(origin, saveAccount);
    // always return account with auth 'active'
    this.response(this.constructIdentity([saveAccount]));
  }

  async getIdentityFromPermissions() {
    const {origin} = this.payload;
    const currName = await this.accService.current();
    const account = PermissionService.getPermission(origin);
    let result = null;
    if (account && currName === account.name) {
      result = {
        hash: '',
        kyc: false,
        name: 'eos',
        publicKey: '',
        accounts: [account]
      };
    }
    this.response(result);
  }

  async forgetIdentity() {
    const {origin} = this.payload;
    const account = PermissionService.getPermission(origin);
    if (account) {
      PermissionService.rmPermission(origin);
      this.walletService.rmFromWhitelist(origin, account.publicKey.key);
    }
    this.response(true);
  }

  updateIdentity() {
    const {origin, name, kyc} = this.payload;

    const account = PermissionService.getPermission(origin);
    if (!account) {
      return this.response(Error.identityMissing());
    }

    this.response(this.constructIdentity([account]));
  }

  async authenticate() {
    const ecc = window.eosjs_ecc;
    const {origin, nonce, publicKey, data} = this.payload;
    const account = PermissionService.getPermission(this.payload.origin);
    if (!account) {
      return this.response(Error.identityMissing());
    }

    const nonceError = new Error('invalid_nonce', 'You must provide a 12 character nonce for authentication');
    if (!nonce) {
      return this.response(nonceError);
    }
    if (nonce.length !== 12) {
      return this.response(nonceError);
    }

    const pubKey = publicKey && publicKey.length ? publicKey : account.publicKey.key;
    const isHash = data && data.length;
    const toSign = isHash ? data : origin;

    let privKey = this.walletService.getFromWhitelist(pubKey, origin);
    if (!privKey) {
      const result = await this.popTransactModal();
      if (result.data && result.data.password !== '') {
        try {
          privKey = await this.walletService.retrieveKey(pubKey, result.data.password, origin, result.data.whitelist);
        } catch (e) {
        }

        if (privKey === '') {
          return this.wrongPassword();
        }
      } else {
        return this.rejectSignature();
      }
    }
    const hashData = ecc.sha256(ecc.sha256(toSign) + ecc.sha256(nonce));
    const signed = await this.eosService.sign({data: hashData}, privKey, true, !!isHash);
    this.response(signed);
  }

  /**
   * getPublicKey returns the public key of the current account with 'active' permission in wallet.
   */
  async getPublicKey() {
    if (Object.keys(this.payload).length !== 2) {
      return this.badResult();
    }

    const {blockchain} = this.payload;
    if (!blockchain && typeof blockchain !== 'string') {
      return this.badResult();
    }
    if (blockchain !== 'eos') {
      return this.badResult('zjubca.wallet only supports EOS blockchain');
    }

    // only give the public key of current account with 'active' permission
    const currName = await this.accService.current();
    const account = await this.accService.getAccount(currName);
    for (const perm of account.permissions) {
      if (perm.permission === 'active') {
        return this.response(perm.publicKey);
      }
    }
  }

  linkAccount() {
    return this.response(Error.notSupportApi());
  }

  hasAccountFor() {
    if (Object.keys(this.payload).length !== 2) {
      return this.badResult();
    }
    if (!this.payload.hasOwnProperty('network')) {
      return this.badResult();
    }

    let {network} = this.payload;
    if (network.chainId === CHAINID) {
      return this.response(Error.notKylinChain());
    }
    network = endpoints.normal.find(x => x.endpoint === `${network.prototype}://${network.host}`);
    if (network) {
      return this.response(true);
    }
    network = endpoints.actions.find(x => x.endpoint === `${network.prototype}://${network.host}`);
    if (network) {
      return this.response(true);
    }
    this.response(Error.noNetwork());

  }

  suggestNetwork() {
    this.response(Error.notSupportApi());
  }

  async requestTransfer() {
    const {to, network, amount, origin, blockchain} = this.payload;
    let options = this.payload.options;
    if (!options) {
      options = {};
    }
    const symbol = options.symbol || 'EOS';
    const contract = options.contract;

    const memo = options.memo;

    this.payload.memo = memo;
    this.payload.symbol = symbol;
    this.payload.contract = contract;

    const account = PermissionService.getPermission(origin);
    if (!account) {
      return this.response(Error.identityMissing());
    }
    const action: Action = {
      account: contract,
      name: 'transfer',
      authorization: [{
        actor: account.name,
        permission: 'active',
      }],
      data: {
        from: account.name,
        to,
        quantity: (+amount).toFixed(4) + ` ${symbol}`,
        memo
      }
    };

    const {data} = await this.popTransactModal([action], false);
    if (data && data.password) {
      await this.eosService.init(account.name, data.password, ['active']);
      const sent = await this.eosService.sendTransaction([action]);
      return this.response(sent);
    } else {
      return this.rejectSignature();
    }

  }

  async requestSignature() {
    const {origin, network, requiredFields, blockchain, transaction} = this.payload;
    if (blockchain !== 'eos') {
      return this.badResult('zjubca.wallet only supports EOS blockchain');
    }

    const account = PermissionService.getPermission(origin);
    if (!account) {
      return this.response(Error.identityMissing());
    }

    if (network.chainId !== CHAINID) {
      return this.response(Error.notKylinChain());
    }
    this.payload.identityKey = account.publicKey;

    let privKey = this.walletService.getFromWhitelist(account.publicKey.key, origin);
    if (!privKey) {
      const {data} = await this.popTransactModal(transaction.actions);
      if (data && data.password !== '') {
        // produce signature
        // console.log(account.publicKey.key, data.password);
        try {
          privKey = await this.walletService.retrieveKey(account.publicKey.key, data.password, origin, data.whitelist);
        } catch (e) {
        }

        if (!privKey) {
          return this.wrongPassword();
        }
      } else {
        return this.rejectSignature();
      }
    }
    const signature = this.eosService.sign(this.payload, privKey);
    this.response({signatures: [signature], requiredFields});
  }

  async getArbitrarySignature() {
    const {origin, publicKey, data} = this.payload;
    if (data.split(' ').some(x => x.length > 12)) {
      return this.response(Error.malicious('You can not sign strings where any of the words are over 12 characters.'));
    }

    const account = PermissionService.getPermission(origin);
    if (!account) {
      return this.response(Error.identityMissing());
    }

    let privKey = this.walletService.getFromWhitelist(publicKey, origin);
    if (!privKey) {
      const result = await this.popTransactModal();
      if (result.data && result.data.password !== '') {
        const {password, whitelist} = result.data;
        try {
          privKey = await this.walletService.retrieveKey(publicKey, password, origin, whitelist);
        } catch (e) {
        }

        if (privKey === '') {
          return this.wrongPassword();
        }

      } else {
        return this.rejectSignature();
      }
    }
    const signature = this.eosService.sign(this.payload, privKey, true);
    this.response(signature);

  }

  createTransaction() {
    const {blockchain, actions, account, network} = this.payload;
    if (!blockchain) {
      return this.badResult();
    }
    if (blockchain !== 'eos') {
      return this.badResult('zjubca.wallet only supports EOS blockchain');
    }

    const chainId = network.chainId;
    if (chainId !== CHAINID) {
      return this.response(Error.notKylinChain());
    }

    const transaction = {
      actions: actions || [],
      expiration: moment().format(),
    };

    this.response(transaction);
  }

  addToken() {
    this.response(Error.notSupportApi());
  }

  async popTransactModal(actions?: Action[], sign: boolean = true) {
    let cssClass = '';
    switch (this.type) {
      case 'authenticate':
      case 'requestArbitrarySignature':
        cssClass = 'noActionTransactModal';
        break;
      default:
        cssClass = 'transactModal';
    }

    const modal = await this.modalCtrl.create(
      {
        component: TransactModalComponent,
        cssClass,
        componentProps: {
          actions,
          sign,
          type: this.type
        },
        backdropDismiss: true,
        showBackdrop: true
      }
    );

    await modal.present();

    return await modal.onDidDismiss();
  }

  // ======= response helper func ======= //
  rejectSignature() {
    this.response(Error.signatureError('signature_rejected', 'User rejected the signature request'));
  }

  wrongPassword() {
    this.response(Error.signatureError('wrong_password', 'User gives a wrong password and cannot get the corresponding private key'));
  }

  constructIdentity(accounts: Account[]): Identification {
    const result: Identification = {
      accounts,
      hash: '',
      kyc: false,
      name: 'eos',
      publicKey: ''
    };

    return result;
  }

  badResult(msg: string = 'Invalid format') {
    this.response(Error.malicious(msg));
  }
}
