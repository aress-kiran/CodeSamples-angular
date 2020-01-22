import { Injectable, EventEmitter  } from '@angular/core';
import { URLSearchParams, JsonpModule, Http, Response, RequestOptions, Headers, RequestMethod  } from '@angular/http';
import { Router, CanActivate } from '@angular/router';
import { ElectronService } from 'ngx-electron';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

declare var jquery:any;
declare var $ :any;

@Injectable()
export class TopicsService {
		
    isStandalone = false;

	topicList = null;
	blockedTopicList;
	
	blockedTopics = [];
	unblockedTopics = [];
	
	selectedTopic;
	selectedTopicName: string;
	
	caseStudy;
	trueStory;
	model;
	applyIt;	
	info;
	howto;
	profile;
	brain;
	gotIt1;
	gotIt2;
	
	guide;
	orgid;
	orgname;
	learner;
	isAdmin;
	assestData;
	
	relatedTopic;
	activeScreen;
	idleTimeout = false;
	
	caseStudyUpdated:EventEmitter<any> = new EventEmitter();
	howtoUpdated:EventEmitter<any> = new EventEmitter();
	infoUpdated:EventEmitter<any> = new EventEmitter();
	profileUpdated:EventEmitter<any> = new EventEmitter();
	relatedUpdated:EventEmitter<any> = new EventEmitter();
	assetsUpdated:EventEmitter<any> = new EventEmitter();
	
	//brain
	memoryFlag = false;
	brainSection = '';
	brainCommonText;
	
	programName = 'Example';

	admin_url  = 'http://example.com/Interventions/'; 
	base_url   = 'http://example.com/Interventions/api';
	assets_url = 'http://example.com/Interventions/assets/uploads';
	audio_url  = 'http://example.com/Interventions/assets/uploads/common';
	
	cdn_audio_url = 'http://example.com/Interventions/assets/uploads/common'; 
	cdn_image_url = 'http://example.com/Interventions/assets/uploads/common'; 
	
	
	constructor(public http: Http, private router: Router, private electronService: ElectronService) {
		
		if (this.electronService.isElectronApp) {
			
            this.isStandalone = true;
			
			this.assets_url = '../data/assets';
			
			this.admin_url = '../data/assets';
			
			this.audio_url = '../data/assets';
			
			this.cdn_audio_url = '../data/assets/audio/';
			
			this.cdn_image_url = '../data/assets';
        
		}

	}
	
	
	/*
	 * get assets by ID
	 * @param: assetsID(string)
	 * @return: Array
	 */
	getAssetData(assetId) {
			
		return this.assestData.filter(x => x.AssetID === assetId);
		
	}
	
	
	/*
	 * ELECTRON / API CALL
	 * get all assests
	 * @param: NONE
	 * @return: NONE
	 */
	getAllAssetfiles() {
		
		if(this.isStandalone) {
			
			let res = this.electronService.ipcRenderer.sendSync('getAssetDetails', this.programName);
			
			this.assestData = res.assetList;
			
			this.assetsUpdated.emit(this.assestData);		
			
		}
		else {
		
			let topicsUrl = this.base_url+"/topics/getAssetDetails/programType/teens";
			
			this.http.get(topicsUrl).map((response) => response.json()).subscribe(data => { 
				
				if(data) {						
					
					this.assestData = data.assetList;
					
					this.assetsUpdated.emit(this.assestData);		
			
				}
					
			});
		}
	}
	
		
	/*
	 * ELECTRON / API CALL
	 * get all topics
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getAllTopics(): Observable<any> {
		
		if(this.isStandalone) {
			
			let res = this.electronService.ipcRenderer.sendSync('getTopicList', this.programName);
			
			return Observable.of(res);
			
		}
		else {
			
			let topicsUrl = this.base_url+"/topics/getAllTopicList/category/teens";
			
			return this.http.get(topicsUrl).map((response) => response.json());
			
		}		
		
	}
	
	/*
	 * ELECTRON / API CALL
	 * get related topics
	 * @param: NONE
	 * @return: Observale(Object)
	 */
	getRelatedTopics(topicID): Observable<any> {
		
		this.relatedTopic = null;
		
		if(this.isStandalone) {
			
			let res = this.electronService.ipcRenderer.sendSync('getRelatedTopic', topicID, this.programName);
			
			return Observable.of(res);
		
		}
		else {
			let relatedUrl = this.base_url+"/topics/getRelatedTopic/topicId/"+topicID;
		
			return this.http.get(relatedUrl).map((response) => response.json());
		}
	}
	
	/*
	 * ELECTRON / API CALL
	 * get Case study by topic id 
	 * @param: topicID(string)
	 * @return: Observable(Object)
	 */
	getCaseStudyByTopic(topicID): Observable<any> {
		
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getCaseStudy', topicID, this.programName);
			
			return Observable.of(res);
				
		}
		else {
			
			let casestudyUrl = this.base_url+"/topics/getCaseStudyDetails/topicId/"+topicID;
			
			return this.http.get(casestudyUrl).map((response) => response.json());
			
		}		
		
	}
	
	/*
	 * ELECTRON / API CALL
	 * get True story by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getTrueStoryByTopic(topicID): Observable<any> {
		
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getTrueStory', topicID, this.programName);
			
			return Observable.of(res);
			
		}
		else {
		
			let trueStoryUrl = this.base_url+"/topics/getTrueStoryDetails/topicId/"+topicID;

			return this.http.get(trueStoryUrl).map((response) => response.json());
		}
	}
	
	/*
	 * ELECTRON / API CALL
	 * get Applyit by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getApplyItByTopic(topicID): Observable<any> {
		
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getAppyIt', topicID, this.programName);
			
			return Observable.of(res);
		}
		else {
		
			let applyItUrl = this.base_url+"/topics/getApplyItDetails/topicId/"+topicID;

			return this.http.get(applyItUrl).map((response) => response.json());
		}
	}
	
	/*
	 * ELECTRON / API CALL
	 * get Model by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getModelByTopic(topicID): Observable<any> {
		
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getModel', topicID, this.programName);
			
			return Observable.of(res);
			
		}
		else  {
			
			let modelUrl = this.base_url+"/topics/getModelDetails/topicId/"+topicID;
			
			return this.http.get(modelUrl).map((response) => response.json());
		}
	}
	
	/*
	 * ELECTRON / API CALL
	 * get Info by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getInfoByTopic(topicID): Observable<any> {
		
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getInfo', topicID, this.programName);
			
			return Observable.of(res);
		
		}
		else {
		
			let infoUrl = this.base_url+"/topics/getInfoDetails/topicId/"+topicID;
			
			return this.http.get(infoUrl).map((response) => response.json());
		}
	}
	
	/*
	 * ELECTRON / API CALL
	 * get How to by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getHowToByTopic(topicID): Observable<any> {
		
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getHowTo', topicID, this.programName);
			
			return Observable.of(res);
				
		}
		else {

			let howtoUrl = this.base_url+"/topics/getHowToDetails/topicId/"+topicID;
			
			return this.http.get(howtoUrl).map((response) => response.json());
		}
	}
	
	/*
	 * API CALL
	 * get Profile by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getProfileByTopic(topicID): Observable<any> {
		
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getProfile', topicID, this.programName);
			
			return Observable.of(res);
				
		}
		else {

			let profileUrl = this.base_url+"/topics/getProfileDetails/topicId/"+topicID;
		
			return this.http.get(profileUrl).map((response) => response.json());
			
		}
	}
	
	/*
	 * API CALL
	 * get Brain by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getBrainByTopic(topicID): Observable<any> {
			
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getBrain', topicID, this.programName);
			
			return Observable.of(res);
				
		}
		else {
			
			let brainUrl = this.base_url+"/topics/getYourMindDetails/topicId/"+topicID;
			
			return this.http.get(brainUrl).map((response) => response.json());
			
		}
	}
		
	/*
	 * API CALL
	 * get Got It 1 by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getGotIt1ByTopic(topicID): Observable<any> {
				
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getGotIt1', topicID, this.programName);
		
			return Observable.of(res);
				
		}
		else {
			
			let gotit1Url = this.base_url+"/topics/getGotIt1Details/topicId/"+topicID;
			
			return this.http.get(gotit1Url).map((response) => response.json());
			
		}
	}
	
	/*
	 * API CALL
	 * get Got It 2 by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getGotIt2ByTopic(topicID): Observable<any> {
				
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getGotIt2', topicID, this.programName);
			
			return Observable.of(res);
				
		}
		else {
		
			let gotit2Url = this.base_url+"/topics/getGotIt2Details/topicId/"+topicID;
			
			return this.http.get(gotit2Url).map((response) => response.json());
		}
	}
		
	/*
	 * API CALL
	 * get active screens by topic id 
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getActiveScreensByTopic(topicID): Observable<any> {
				
		if(this.isStandalone) {
		
			let res = this.electronService.ipcRenderer.sendSync('getActiveScreens', topicID, this.programName);
			
			return Observable.of(res);
				
		}
		else {
			let activeScreensUrl = this.base_url+"/topics/getActiveScreens/topicId/"+topicID;
			
			return this.http.get(activeScreensUrl).map((response) => response.json());
		}
	
	}
	
	/*
	 * API CALL
	 * get topic list by key name
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getTopicByKey(keyName): Observable<any> {
		
		if(this.isStandalone) {
			
			let res = this.electronService.ipcRenderer.sendSync('getKeyTopicList', keyName, this.programName);
			
			return Observable.of(res);
			
		}
		else {
		
			let keyUrl = this.base_url+"/topics/getKeyTopicList/category/teens/key/"+keyName;
			
			return this.http.get(keyUrl).map((response) => response.json());
		}
	
	}
		
	/*
	 * API CALL
	 * get brain text list
	 * @param: NONE
	 * @return: Observable(Object)
	 */
	getBrainTextDetails(): Observable<any> {
		
		if(this.isStandalone) {
			
			let res = this.electronService.ipcRenderer.sendSync('getBrainTextDetails', this.programName);
			
			return Observable.of(res);
			
		}
		else {
		
			let keyUrl = this.base_url+"/topics/getBrainTextDetails";
			
			return this.http.get(keyUrl).map((response) => response.json());
		}
	}
	
	/*
	 * topic details
	 * @param: NONE
	 * @return: topicId(OBJECT)
	 */
	getTopicDetails(topicId) {
		if(topicId==null) {
			return null;
		}
		return this.topicList.filter(x => x.topicID === topicId);
	}
	
	/*
     * add mCustomScrollbar to all pages using jquery
	 * @param: scrollClassName(string)
	 * @return: NULL
	 */
	addCustomScroll(scrollClassName:string) {
		if(window.screen.width>=1280) {
			$(""+scrollClassName).mCustomScrollbar({
				scrollButtons:{enable:true,scrollType:"stepless"},
				keyboard:{scrollType:"stepless"},
				mouseWheel:{scrollAmount:120,normalizeDelta:true},
				theme:"rounded-dark",
				autoExpandScrollbar:true,
				snapAmount:0,
				snapOffset:40
			});
		}
	}
	
	
	/*
	 * check if topic is blocked
	 * @param: id(string)
	 * @return: Boolean
	 */
	isBlocked(id:string): boolean {
		
		var checkTopic;
		
		var found = false;
		
		// iterate over each element in the array
		for (var i = 0; i < this.topicList.length; i++){
			
			// look for the entry with a matching `code` value
			var topic = JSON.parse(JSON.stringify(this.topicList[i]));
				
			if (topic.Id == id){	
			
				checkTopic = this.topicList[i];
				
			}
		}
		
		if(checkTopic) {
			
			this.blockedTopicList.forEach((blockedEntry:string) => {
		
				if(checkTopic.topicID == blockedEntry) {
						
					$("#blockedError").modal();
					
					found =  true;
					
				}
				
			}); 
			
		}	

		if(found) {
			
			return true;
			
		} else {
			
			return false;
			
		}
		
	}
		
	/*
	 * sort blocked topic
	 * @param: NONE
	 * @return: NONE
	 */
	sortTopicByBlockedList() {
		
		this.blockedTopics = [];
		
		this.unblockedTopics = this.topicList;
		
		this.unblockedTopics.forEach((entry) => {
			
			this.blockedTopicList.forEach((blockedEntry:string) => {
				
				if(entry.topicID == blockedEntry) {
						
					this.removeUnblockedTopicItem(entry.topicID);
				}
					
			}); 
				
		}); 
		 	
	}
		
	/*
	 * remove blocked topic from list
	 * @param: STRING(topicID)
	 * @return: NONE
	 */
	removeUnblockedTopicItem(topicID: string) {
		this.unblockedTopics = this.unblockedTopics.filter(item => item.topicID !== topicID);
	}
	
}