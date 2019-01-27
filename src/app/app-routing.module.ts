import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './tabs/tabs.module#TabsPageModule'},
  {path: 'account-add', loadChildren: './pages/account-add/account-add.module#AccountAddPageModule'},
  {path: 'login', loadChildren: './pages/login/login.module#LoginPageModule'},
  {path: 'transfer', loadChildren: './pages/transfer/transfer.module#TransferPageModule'},
  {path: 'bill', loadChildren: './pages/bill/bill.module#BillPageModule'},
  {path: 'nft', loadChildren: './pages/nft/nft.module#NftPageModule'},
  {path: 'tokens', loadChildren: './pages/tokens/tokens.module#TokensPageModule'},
  {path: 'token-detail/:symbol', loadChildren: './pages/token-detail/token-detail.module#TokenDetailPageModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
