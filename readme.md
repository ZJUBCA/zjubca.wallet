# zjubca.wallet
A necessary wallet for a new world.

本仓库为协会钱包移动端代码仓库。协会钱包基于EOS麒麟测试网，旨在为协会开发者提供Dapp运行容器，为高校用户打造门槛更低的区块链入口。

## Scatter支持

本钱包完全兼容Scatter的接口，Dapp开发者只须使用同一套[ScatterJS](https://github.com/Blockchain-zju/zjubca-scatter-js)(协会二次开发版本)即可实现同时与桌面端Scatter钱包及协会钱包进行交互。

**注: 已测试eosjs@16.0.9的兼容性，建议开发者选用该版本的plugin与sdk!!!**

### Scatter API (兼容ScatterJS)
- [x] getVersion
- [x] getIdentity
- [x] getIdentityFromPermission
- [x] forgetIdentity
- [x] updateIdentity
- [x] authenticate
- [x] getPublicKey
- [ ] linkAccount - 不支持
- [x] hasAccountFor
- [ ] suggestNetwork - 不支持
- [x] requestTransfer
- [x] requestSignature
- [x] getArbitrarySignatures
- [x] createTransaction
- [ ] addToken - 不支持

## Simple Wallet协议

本钱包接入[SimpleWallet](https://github.com/southex/SimpleWallet)协议。

已实现:
- [x] 扫码支付
- [ ] 扫码登录
- [ ] Dapp移动端应用拉起钱包App。

## Dapp开发指南
请移步[Dapp开发指南](https://github.com/Blockchain-zju/dapp-dev-guide)。

## 开发计划
- [x] 钱包基本功能
- [x] 钱包内Dapp与钱包App组件交互功能
- [ ] 原生App与钱包App交互功能

## 开发中遇到的坑
- qr-scanner与camera-preview插件存在冲突。

### Android
- 请先下载Android Studio并成功运行一个项目(此过程会安装必要依赖)后再编译ionic项目。

## How to build and deploy
1. `git clone`本仓库
2. `yarn`

### Android
3. `mkdir android-deploy` and put `zjubca_wallet.keystore`(stored in secure storage) in the dir. 
4. `npm run build-android`. ps:you need to input a key when compilation, and please ask admin for key。
5. You'll find the `zjubca_wallet.apk` in dir `android-deploy`.

### IOS
3. `npm run build-ios`
4. Open `XCode` to sign the project, and get `ipa` binary file.
