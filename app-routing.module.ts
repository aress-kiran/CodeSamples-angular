import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrganizationComponent } from './organization/organization.component';
import { HideComponent } from './hide/hide.component';
import { AuthUserComponent } from './auth-user/auth-user.component';
import { ActivationComponent } from './activation/activation.component';
import { SplashComponent } from './splash/splash.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './shared/';

const routes: Routes = [
	
    { path: 'register', component: RegisterComponent },
	{ path: 'home', component: HomeComponent  },
	{ path: 'login', component: LoginComponent },
	{ path: 'layout', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard]},
	{ path: 'organization', component: OrganizationComponent },
	{ path: 'hide', component: HideComponent },
	{ path: 'authUser', component: AuthUserComponent  },
	{ path: 'activation', component: ActivationComponent  },
	{ path: 'error', component: ErrorComponent  },
	{ path: 'loading', component: SplashComponent  },
	//{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**',  redirectTo: '', pathMatch: 'full'},
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { 

	constructor() {
	}

}