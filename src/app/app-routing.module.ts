import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule'},
  {path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
  {path: 'transfer', loadChildren: './pages/transfer/transfer.module#TransferPageModule'},
  {path: 'bill', loadChildren: './pages/bill/bill.module#BillPageModule'},
  {path: 'nft', loadChildren: './pages/nft/nft.module#NftPageModule'},
  {path: 'tokens', loadChildren: './pages/tokens/tokens.module#TokensPageModule'},
  {path: 'token-detail/:symbol', loadChildren: './pages/token-detail/token-detail.module#TokenDetailPageModule'},
  {path: 'network', loadChildren: './pages/network/network.module#NetworkPageModule'},
  {path: 'wallet-manage', loadChildren: './pages/wallet-manage/wallet-manage.module#WalletManagePageModule'},
  {path: 'about', loadChildren: './pages/about/about.module#AboutPageModule'},
  {path: 'wallet-detail/:pubkey', loadChildren: './pages/wallet-detail/wallet-detail.module#WalletDetailPageModule'},
  {path: 'qrscan', loadChildren: './pages/qr-scan/qr-scan.module#QrScanPageModule'},
  {path: 'dapp/:url', loadChildren: './pages/dapp-container/dapp-container.module#DappContainerPageModule'},
  {path: 'export-key/:privkey', loadChildren: './pages/export-key/export-key.module#ExportKeyPageModule'},
  {path: 'dapp-list/:group', loadChildren: './pages/dapp-list/dapp-list.module#DappListPageModule'},
  {path: 'share', loadChildren: './pages/share/share.module#SharePageModule'},
  {path: 'news', loadChildren: './pages/news/news.module#NewsPageModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
