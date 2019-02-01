import {Component, ElementRef, OnInit} from '@angular/core';
import {Account, Identification, METHOD_TYPEs, Request} from '../../common/dappApi';
import {EosService} from '../../services/eos.service';
import {AccountService} from '../../services/account.service';
import {CHAINID} from '../../common/config';
import {WalletService} from '../../services/wallet.service';
import {PermissionService} from '../../services/permission.service';
import Error from '../../common/Error';
import {ModalController} from '@ionic/angular';
import {TransactModalComponent} from '../../modals/transact-modal/transact-modal.component';


@Component({
  selector: 'app-dapp-container',
  templateUrl: './dapp-container.page.html',
  styleUrls: ['./dapp-container.page.scss'],
})
export class DappContainerPage implements OnInit {

  iframe: any;

  constructor(
    private el: ElementRef,
    private accService: AccountService,
    private eosService: EosService,
    private walletService: WalletService,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.iframe = this.el.nativeElement.querySelector('.browser');
    console.log(this.iframe);
    window.addEventListener('message', ev => this.handleMsg(ev));
  }

  handleMsg(ev) {
    const {protocol, type} = ev.data;
    if (!protocol || protocol.indexOf('scatter') < 0) {
      return;
    }
    console.log(ev.data);

    if (type === 'pair') {
      return this.iframe.contentWindow.postMessage({
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

    const handler = api[METHOD_TYPEs[request.type]];
    if (typeof handler === 'function') {
      handler.call(api);
    }
  }
}

class ApiService {
  id: string;
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
    const result: Identification = {
      accounts: [saveAccount],
      hash: '',
      kyc: false,
      name: 'eos',
      publicKey: ''
    };
    // always return account with auth 'active'
    this.response(result);
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

  }

  updateIdentity() {

  }

  authenticate() {

  }

  getArbitrarySignature() {

  }

  getPublicKey() {

  }

  linkAccount() {

  }

  hasAccountFor() {

  }

  suggestNetwork() {

  }

  requestTransfer() {

  }

  async requestSignature() {
    console.log(this.payload);
    const {origin, network, requiredFields, blockchain, transaction} = this.payload;

    const account = PermissionService.getPermission(origin);
    if (!account) {
      return this.response(Error.identityMissing());
    }

    if (network.chainId !== CHAINID) {
      return this.response(Error.notKylinChain());
    }
    this.payload.identityKey = account.publicKey;

    const modal = await this.modalCtrl.create(
      {
        component: TransactModalComponent,
        cssClass: 'transactModal',
        componentProps: {
          actions: transaction.actions,
          sign: true,
        },
        backdropDismiss: true,
        showBackdrop: true
      }
    );

    console.log(account);

    await modal.present();

    const {data} = await modal.onDidDismiss();
    if (data && data.password !== '') {
      // produce signature
      // console.log(account.publicKey.key, data.password);
      let privKey = '';
      try {
        privKey = await this.walletService.retrieveKey(account.publicKey.key, data.password);
      } catch (e) {
      }

      if (privKey === '') {
        return this.response(Error.signatureError('wrong_password', 'User gives a wrong password and cannot get the corresponding private key'));
      }
      try {
        const signature = this.eosService.sign(this.payload, privKey);
        this.response({signatures: [signature], requiredFields});
      } catch (e) {
        return this.response(Error.signatureError('invalid_signature', e.message));
      }
    } else {
      this.response(Error.signatureError('signature_rejected', 'User rejected the signature request'));
    }
  }

  createTransaction() {

  }

  addToken() {

  }

}
