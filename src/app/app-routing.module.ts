import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
