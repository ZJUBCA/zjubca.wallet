import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CreateWalletComponent} from '../../components/create-wallet/create-wallet.component';
import {ImportWalletComponent} from '../../components/import-wallet/import-wallet.component';
import {LoginPage} from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
    children: [
      {
        path: 'create',
        component: CreateWalletComponent
      },
      {
        path: 'import',
        component: ImportWalletComponent
      },
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRouterModule {
}
