import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { Router,ActivatedRoute, NavigationCancel, Params  } from '@angular/router';
import { URLSearchParams, } from '@angular/http';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { ElectronService } from 'ngx-electron';
import { PdaService, TopicsService, CryptoService } from './shared';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';


declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	
	sub;
	message = '';

	authUserID:string = '';
	
	user;
	orgid
	orgname;
	
	idleState = 'Not started.';
	timedOut = false;
	lastPing?: Date = null;
	
	/*
	 * constructor
	 * @param: router(Object), route(Object), pdaservice(Object), topicservice(Object), storage(Object)
	 * crypto(Object), electronService(Object)
	 * idle(Object for session timeout), keepalive(Object for session timeout)
	 * @return: NONE
	 */
	constructor(private router: Router, private route: ActivatedRoute, private pdaservice: PdaService, private topicservice: TopicsService, private storage:LocalStorageService,  private crypto: CryptoService, private electronService: ElectronService, private idle: Idle, private keepalive: Keepalive) { 
	
		 // sets an idle timeout of 5 seconds, for testing purposes.
		idle.setIdle(600);
		// sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
		idle.setTimeout(1);
		// sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
		idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

		idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
		idle.onTimeout.subscribe(() => {
			console.log('Time Out');
			this.pdaservice.idleTimout = true;
			
			if(this.pdaservice.loginUser) {
				this.router.navigate(['/layout/logout']);
			}
			this.timedOut = true;
			this.reset();
		});
		idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
		idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

		// sets the ping interval to 15 seconds
		keepalive.interval(15);

		keepalive.onPing.subscribe(() => this.lastPing = new Date());

		this.reset();
	
	}
	
	/*
	 * function: reset()
	 * On auto logout completed
	 * @param: NONE
	 * @return: NONE
	 */
	reset() {
		this.idle.watch();
		this.idleState = 'Started.';
		this.timedOut = false;
	}

	/*
	 * read org parameter from url and redirect to login
	 * @param: NONE
	 * @return: NONE
	 */
	ngOnInit() {
				
		this.topicservice.getAllAssetfiles();
 
		if (this.electronService.isElectronApp) {
			
			let res = this.electronService.ipcRenderer.sendSync('isOnline', this.topicservice.programName);
			
			let org = this.electronService.ipcRenderer.sendSync('getOrganization');
			
			if(org.error) {
				
				this.message = '';
					
				this.router.navigate(['/activation']);
			}
			else {
				
				this.message = '';
				
				this.orgname = org['name'];
				
				this.orgid = org['id'];
				
				this.storage.store('orgname', this.orgname);
				this.storage.store('orgid', this.orgid);
				this.topicservice.orgname = this.storage.retrieve('orgname');
				this.topicservice.orgid = this.storage.retrieve('orgid');
				
				this.pdaservice.getLearnersByOrganization(this.orgname);
				
				this.router.navigate(['/loading']);
			}
				
		}		
		else {	
				
			this.sub = this.route.queryParams.debounceTime(500).subscribe(params => {
			
				// check if from saml	
				if(params['uid']) {
						
					// decrypt password
					this.authUserID = this.crypto.decryptUserId(params['uid']); 
					
					this.storage.store('learnerid', this.authUserID);
						
					this.pdaservice.getLearnersByID(this.authUserID).subscribe(
						data => { 
								
							if(data){
							
								this.user = data;
								
								this.topicservice.orgid = data.organization_id;	
									
								this.pdaservice.getOrganizationByID(this.topicservice.orgid).subscribe(data => {
										
									this.topicservice.orgname = data[0].name;
										
									var parsedUnixTime = new Date().getTime();
			
									var sessionSeconds = [];
									sessionSeconds.push({
										'startTime': ''+parsedUnixTime,
										'elapsedSeconds': 0
									});
									
									var	learner = new Map();
			
									learner.set('firstName', this.user.first_name);
									learner.set('firstNameStripped', this.user.first_name.toLowerCase());
									learner.set('lastName', this.user.last_name);
									learner.set('lastNameStripped', this.user.last_name.toLowerCase());
									learner.set('middleInitial', this.user.middle_initial);
									learner.set('password', this.user.password);
									learner.set('grade', "");
									learner.set('student_id', "none");
									learner.set('fileName', this.user.file_name);
									learner.set('modified', parsedUnixTime);
									learner.set('version', 6);
									learner.set('schoolID', this.topicservice.orgname);
									learner.set('product', this.pdaservice.PROGRAM);
									learner.set('sessionSeconds', JSON.stringify(sessionSeconds));
									learner.set('assessments', JSON.stringify('[]'));
									learner.set('journalEntries', JSON.stringify('[]'));
									learner.set('activitiesMastered', JSON.stringify('[]'));

									this.pdaservice.registerLearner(learner).subscribe(data => { 
									
										if(data.id){
											
											this.pdaservice.loginUser = true;
									
											this.topicservice.learner={
												'id':data.id,
												'firstName':data.first_name,
												'lastName': data.last_name,
												'middleInitial': data.middle_initial,
												'password': data.password,
												'grade': "10",
												'student_id': "none",
												'fileName': data.firstname+".db",
												'modified': parsedUnixTime,
												'version':6,
												'schoolID': this.topicservice.orgname,
												'product': this.pdaservice.PROGRAM,
												'sessionSeconds': JSON.stringify(sessionSeconds),
												'assessments': JSON.stringify('[]'),
												'journalEntries': JSON.stringify('[]'),
												'activitiesMastered': JSON.stringify('[]')
											};
											this.router.navigate(['/authUser']);
										}
										else{
											
										}
									});
									
								});
								
							}
							else{
								//this.router.navigate(['/login']);
							}
						}
					);
					
					this.message = '';
				}
				else if (params['org']) {
					
					// check if from org url
					this.orgname = params['org']; 
					this.pdaservice.getOrganization(this.orgname).subscribe(data => { 
						this.orgid = data;
						this.pdaservice.getSubscriptionDetails(this.orgid).subscribe(data => { 
					
							if(data){
								
									this.storage.store('orgname', this.orgname);
									this.storage.store('orgid', this.orgid);
									
									this.message = '';
									this.login();
								
							}
							else{
								this.message = 'nopath';
							}
						
						});	
						
					});
					this.sub.unsubscribe();
				}
				// check if return by refresh
				else {
					this.orgname=this.storage.retrieve('orgname');
					this.orgid=this.storage.retrieve('orgid');
					
					if(this.orgname){
					
						this.message = '';
						this.login();
					}
					else {
						setTimeout(()=>{  
							this.orgname=this.storage.retrieve('orgname');
							if(!this.orgname){
								this.message = 'nopath';
							}
						},3000);
		
					} 
					
				}
				
			});
		}
		
	}

	/*
	 * read org parameter to service and redirect to login
	 * @param: NONE
	 * @return: NONE
	 */
	login() {
		
		this.pdaservice.getSubscriptionDetails(this.orgid).subscribe(data => {	
			if(data){
				this.topicservice.orgname = this.orgname;
				this.topicservice.orgid = this.orgid;
				this.router.navigate(['/loading']);
			} else {
				this.message = 'nopath';
			}
		});	
			
	}
	
}