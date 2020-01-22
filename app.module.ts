import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { OrganizationComponent } from './organization/organization.component';
import { PdaService, CryptoService, TopicsService, AuthGuard, RetraceService, KeysService } from './shared/';
import { HomeComponent } from './home/home.component';
import { Ng2Webstorage } from 'ngx-webstorage';
import { LocationStrategy, Location, HashLocationStrategy } from '@angular/common';
import { HideComponent } from './hide/hide.component';
import { AuthUserComponent } from './auth-user/auth-user.component';
import { ErrorComponent } from './error/error.component';
import { ActivationComponent } from './activation/activation.component';
import { SplashComponent } from './splash/splash.component';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		OrganizationComponent,
		HomeComponent,
		HideComponent,
		AuthUserComponent,
		ErrorComponent,
		ActivationComponent,
		SplashComponent,
    
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		HttpClientModule,
		AppRoutingModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		Ng2Webstorage,
		NgxElectronModule,
		MomentModule,
		NgIdleKeepaliveModule.forRoot()
	],
	providers: [
		PdaService,
		CryptoService,
		TopicsService,
		AuthGuard,
		RetraceService,
		KeysService
	],
	entryComponents: [AppComponent],
	
	bootstrap: [AppComponent],

})

export class AppModule { }


