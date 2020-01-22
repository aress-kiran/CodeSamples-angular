import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicsService, PdaService } from '../shared';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	orgname;
	orgid;
		
	/*
	 * constructor
	 * @param router(Object),crypto(Object), pdaservice(Object), topicservice(Object), storage(Object)
	 * @return NONE
     */
	constructor(private router: Router, private pdaservice: PdaService, private topicservice: TopicsService, private storage:LocalStorageService) {
	
	}

	/*
	 * in view 
	 * @param NONE
	 * @return NONE
	 */
	ngOnInit() {
		this.orgname=this.storage.retrieve('orgname');
		this.orgid=this.storage.retrieve('orgid');
		this.topicservice.orgname = this.orgname;
		this.topicservice.orgid = this.orgid;
		
	}
	
	
	/*
	 * after view init
	 * redirect to login on refresh
	 * @param NONE
	 * @return NONE
	 */
	ngAfterViewInit(): void {
		
		if(this.orgname){
		
			this.pdaservice.getLearnersByOrganization(this.orgname);
			
			this.router.navigate(['/loading']);
		}
	}
	
}