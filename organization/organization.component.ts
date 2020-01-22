import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, NavigationCancel, Params  } from '@angular/router';
import { URLSearchParams, } from '@angular/http';
import { PdaService, TopicsService } from '../shared';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

	orgname;
	orgid:number;
	
	sub;
	message = 'nopath';
	
	/*
	 * constructor
	 * @param: router(Object), route(Object), pdaservice(Object), topicservice(Object), storage(Object)
	 * @return NONE
	 */
  constructor(private router: Router, private route: ActivatedRoute, private pdaservice: PdaService, private topicservice: TopicsService, private storage:LocalStorageService) { 
		
	}

	/*
	 * read org parameter from url and redirect to login
	 * @param: NONE
	 * @return NONE
	 */
  ngOnInit() {
		
		this.orgname=this.storage.retrieve('orgname');
		this.orgid=this.storage.retrieve('orgid');
		
		if(this.orgname){
			this.topicservice.orgname = this.orgname;
			this.topicservice.orgid = this.orgid;
			this.router.navigate(['/home']);
		}
		else {
			this.sub = this.route.queryParams.subscribe(params => {
				this.orgname = params['org']; 
				if(!this.orgname){
					this.message = 'nopath';
				}
				else{
						this.pdaservice.getOrganization(this.orgname).subscribe(
							data => { 
								
								if(data){
									this.orgid = data;	
									
									this.topicservice.orgid = this.orgid;
									this.topicservice.orgname = this.orgname;
								
									this.storage.store('orgname', this.orgname);
									this.storage.store('orgid', this.orgid);
									
									this.router.navigate(['/home']);
								}
								else{
									this.message = 'error';
								}
							}
						);
				}
			});
		}
  }


}
