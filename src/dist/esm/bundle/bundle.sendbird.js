import{N as e,v as s,w as t,a as n,x as o,y as r,z as a,M as i,A as d,E as c,F as u,H as h,I as p,J as l,K as _,Q as m,R as N,U as E,T as U,W as I,S as C,X as T,Y as f,Z as $,$ as R,a0 as x}from"./bundle.shared.js";import"../vendor/vendor.internal.js";const O=p=>(l,_)=>{if(0===l)p.commitSchema([{collectionName:e,keyName:s,index:[t(n.LATEST_LAST_MESSAGE),t(n.CHRONOLOGICAL),t(n.CHANNEL_NAME_ALPHABETICAL)]},{collectionName:o,keyName:r,index:[a(i.CHANNEL_LATEST)]},{collectionName:d,keyName:c,index:[a(i.CHANNEL_LATEST)]},{collectionName:u,keyName:h}]).then((()=>_())).catch((e=>_(e)));else _()};class A{constructor({logger:e,connectionDelegate:s}){this.logger=e,this.connectionDelegate=s}get isAvailable(){return"undefined"!=typeof window&&window.addEventListener&&"ononline"in window&&"onoffline"in window&&"undefined"!=typeof navigator&&void 0!==navigator.onLine}onlineWorker(){try{this.isAvailable&&this.connectionDelegate.reconnect()}catch(e){this.logger.warn("`window.addEventListener.ononline` or `navigator.onLine` not found.")}}offlineWorker(){try{this.isAvailable&&this.connectionDelegate.disconnect()}catch(e){this.logger.warn("`window.addEventListener.ononline` or `navigator.onLine` not found.")}}start(){try{this.isAvailable&&(window.addEventListener("online",this.onlineWorker),window.addEventListener("offline",this.offlineWorker))}catch(e){this.logger.warn("`window.addEventListener.ononline` or `navigator.onLine` not found.")}}stop(){try{this.isAvailable&&(window.removeEventListener("online",this.onlineWorker,!1),window.removeEventListener("offline",this.offlineWorker,!1))}catch(e){this.logger.warn("`window.addEventListener.ononline` or `navigator.onLine` not found.")}}}class y extends p{constructor({userId:e,nickname:s=null,profileUrl:t=null,profileImage:n=null,preferredLanguages:o=null}){super(),this.method=l.PUT,this.path=`${_}/${encodeURIComponent(e)}`,this.params=m({nickname:s,profile_url:t,profile_file:n,preferred_languages:o})}}class v extends N{constructor(e,s){super(e,s),this.user=null,this.user=new E(e,Object.assign({},s))}}class g extends p{constructor({userId:e,token:s}){super(),this.method=l.POST,this.path=`${_}/${encodeURIComponent(e)}/push/apns`,this.params={apns_device_token:s,always_push:!0}}}class w extends p{constructor({userId:e,token:s}){super(),this.method=l.POST,this.path=`${_}/${encodeURIComponent(e)}/push/gcm`,this.params={gcm_reg_token:s,always_push:!0}}}class L extends p{constructor({userId:e,token:s}){super(),this.method=l.DELETE,this.path=`${_}/${encodeURIComponent(e)}/push/apns/${encodeURIComponent(s)}`}}class S extends p{constructor({userId:e,token:s}){super(),this.method=l.DELETE,this.path=`${_}/${encodeURIComponent(e)}/push/gcm/${encodeURIComponent(s)}`}}class k extends p{constructor({userId:e}){super(),this.method=l.DELETE,this.path=`${_}/${encodeURIComponent(e)}/push/apns`}}class P extends p{constructor({userId:e}){super(),this.method=l.DELETE,this.path=`${_}/${encodeURIComponent(e)}/push/gcm`}}class b extends p{constructor({userId:e,type:s,token:t,ts:n}){super(),this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/push/${encodeURIComponent(s)}/device_tokens`,this.params={created_ts:n,token:t}}}class G extends N{constructor(e,s){super(e,s),this.pushTokens={type:s.type?U[s.type.toLowerCase()]:U.UNKNOWN,deviceTokens:s.device_tokens,hasMore:s.has_more,token:s.token}}}class D extends p{constructor({userId:e}){super(),this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/channel_invitation_preference`}}class z extends N{constructor(e,s){super(e,s),this.autoAccept=s.auto_accept}}class M extends p{constructor({userId:e,willAutoAccept:s}){super(),this.method=l.PUT,this.path=`${_}/${encodeURIComponent(e)}/channel_invitation_preference`,this.params={auto_accept:s}}}class H extends N{constructor(e,s){super(e,s),this.autoAccept=s.auto_accept}}class W extends p{constructor({userId:e}){super(),this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/push_preference`}}class j extends N{constructor(e,s){super(e,s),this.preference={doNotDisturbOn:s.do_not_disturb,startHour:s.start_hour,startMin:s.start_min,endHour:s.end_hour,endMin:s.end_min,timezone:s.timezone}}}class V extends p{constructor({userId:e,doNotDisturbOn:s,startHour:t,startMin:n,endHour:o,endMin:r,timezone:a}){super(),this.method=l.PUT,this.path=`${_}/${encodeURIComponent(e)}/push_preference`,this.params={do_not_disturb:s,start_hour:t,start_min:n,end_hour:o,end_min:r,timezone:a}}}class F extends N{constructor(e,s){super(e,s),this.preference={doNotDisturbOn:s.do_not_disturb,startHour:s.start_hour,startMin:s.start_min,endHour:s.end_hour,endMin:s.end_min,timezone:s.timezone}}}class K extends p{constructor({userId:e}){super(),this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/push_preference`}}class q extends N{constructor(e,s){super(e,s),this.snoozePeriod={isSnoozeOn:s.snooze_enabled},"number"==typeof s.snooze_start_ts&&(this.snoozePeriod.startTs=s.snooze_start_ts),"number"==typeof s.snooze_end_ts&&(this.snoozePeriod.endTs=s.snooze_end_ts)}}class B extends p{constructor({userId:e,snoozeOn:s,startTs:t,endTs:n}){super(),this.method=l.PUT,this.path=`${_}/${encodeURIComponent(e)}/push_preference`,this.params={snooze_enabled:s,snooze_start_ts:t,snooze_end_ts:n}}}class J extends N{constructor(e,s){super(e,s),this.snoozePeriod={isSnoozeOn:s.snooze_enabled},"number"==typeof s.snooze_start_ts&&(this.snoozePeriod.startTs=s.snooze_start_ts),"number"==typeof s.snooze_end_ts&&(this.snoozePeriod.endTs=s.snooze_end_ts)}}class Q extends p{constructor({userId:e,blockedUserId:s}){super(),this.method=l.POST,this.path=`${_}/${encodeURIComponent(e)}/block`,this.params={target_id:s}}}class X extends p{constructor({userId:e,unblockedUserId:s}){super(),this.method=l.DELETE,this.path=`${_}/${encodeURIComponent(e)}/block/${encodeURIComponent(s)}`}}class Y extends p{constructor({userId:e}){super(),this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/push/template`}}class Z extends N{constructor(e,s){super(e,s),this.name=s.name}}class ee extends p{constructor({userId:e,templateName:s}){super(),this.method=l.PUT,this.path=`${_}/${encodeURIComponent(e)}/push/template`,this.params={name:s}}}class se extends N{constructor(e,s){super(e,s),this.name=s.name}}class te extends p{constructor({userId:e,token:s}){super(),this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/friends/changelogs`,this.params={token:s}}}class ne extends N{constructor(e,s){super(e,s),this.changelogs={addedUsers:s.added.map((s=>new E(e,s))),updatedUsers:s.updated.map((s=>new E(e,s))),deletedUserIds:s.deleted,hasMore:s.has_more,token:s.next}}}class oe extends p{constructor({userId:e,discoveries:s}){super(),this.method=l.PUT,this.path=`${_}/${encodeURIComponent(e)}/friend_discoveries`,this.params={friend_discoveries:s.map((e=>({friend_discovery_key:e.friendDiscoveryKey,friend_name:e.friendName})))}}}class re extends N{constructor(e,s){super(e,s),this.friendDiscoveryRequestId=s.friend_discovery_request_id}}class ae extends p{constructor({userId:e,discoveryKeys:s}){super(),this.method=l.DELETE,this.path=`${_}/${encodeURIComponent(e)}/friend_discoveries`,this.params={friend_discovery_keys:s}}}class ie extends p{constructor({userId:e,userIds:s}){super(),this.method=l.POST,this.path=`${_}/${encodeURIComponent(e)}/friends`,this.params={user_ids:s}}}class de extends N{constructor(e,s){super(e,s),this.users=s.users.map((s=>new E(e,s)))}}class ce extends p{constructor({userId:e,userIds:s}){super(),this.method=l.DELETE,this.path=`${_}/${encodeURIComponent(e)}/friends`,this.params={user_ids:s}}}class ue extends p{constructor({userId:e}){super(),this.method=l.GET,this.path=`${_}/${e}/allow_friend_discovery`,this.params={}}}class he extends N{constructor(e,s){super(e,s),this.allowFriendDiscovery=s.allow_friend_discovery}}class pe extends p{constructor({userId:e,allowFriendDiscovery:s}){super(),this.method=l.PUT,this.path=`${_}/${e}/allow_friend_discovery`,this.params={allow_friend_discovery:s}}}class le extends p{constructor({userId:e,filter:s}){super();const{keys:t}=s;this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/unread_item_count`,this.params={item_keys:t}}}class _e extends N{constructor(e,s){super(e,s),"number"==typeof s[I.GROUP_CHANNEL_UNREAD_MENTION_COUNT]&&(this.groupChannelUnreadMentionCount=s[I.GROUP_CHANNEL_UNREAD_MENTION_COUNT]),"number"==typeof s[I.GROUP_CHANNEL_UNREAD_MESSAGE_COUNT]&&(this.groupChannelUnreadMessageCount=s[I.GROUP_CHANNEL_UNREAD_MESSAGE_COUNT]),"number"==typeof s[I.GROUP_CHANNEL_INVITATION_COUNT]&&(this.groupChannelInvitationCount=s[I.GROUP_CHANNEL_INVITATION_COUNT]),"number"==typeof s[I.SUPER_UNREAD_MENTION_COUNT]&&(this.superGroupChannelUnreadMentionCount=s[I.SUPER_UNREAD_MENTION_COUNT]),"number"==typeof s[I.SUPER_UNREAD_MESSAGE_COUNT]&&(this.superGroupChannelUnreadMessageCount=s[I.SUPER_UNREAD_MESSAGE_COUNT]),"number"==typeof s[I.SUPER_INVITATION_COUNT]&&(this.superGroupChannelInvitationCount=s[I.SUPER_INVITATION_COUNT]),"number"==typeof s[I.NONSUPER_UNREAD_MENTION_COUNT]&&(this.nonSuperGroupChannelUnreadMentionCount=s[I.NONSUPER_UNREAD_MENTION_COUNT]),"number"==typeof s[I.NONSUPER_UNREAD_MESSAGE_COUNT]&&(this.nonSuperGroupChannelUnreadMessageCount=s[I.NONSUPER_UNREAD_MESSAGE_COUNT]),"number"==typeof s[I.NONSUPER_INVITATION_COUNT]&&(this.nonSuperGroupChannelInvitationCount=s[I.NONSUPER_INVITATION_COUNT])}}class me extends p{constructor({userId:e}){super(),this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/unread_channel_count`}}class Ne extends N{constructor(e,s){super(e,s),this.unreadCount=s.unread_count}}class Ee extends p{constructor({userId:e,filter:s}){super();const{channelCustomTypesFilter:t,superChannelFilter:n}=s;this.method=l.GET,this.path=`${_}/${encodeURIComponent(e)}/unread_message_count`,this.params={super_mode:null!=n?n:C.ALL,custom_types:t}}}class Ue extends N{constructor(e,s){super(e,s),this.unreadCount=s.unread_count}}class Ie extends p{constructor(){super(),this.method=l.GET,this.path=T}}class Ce extends N{constructor(e,s){super(e,s),this.emojiContainer=new f(s)}}class Te extends p{constructor({categoryId:e}){super(),this.method=l.GET,this.path=`${T}/${e}`}}class fe extends N{constructor(e,s){super(e,s),this.emojiCategory=new $(s)}}class $e extends p{constructor({key:e}){super(),this.method=l.GET,this.path=`${R}/${e}`}}class Re extends N{constructor(e,s){super(e,s),this.emoji=new x(s)}}export{ue as A,Q as B,he as C,pe as D,oe as E,re as F,D as G,ae as H,ie as I,de as J,ce as K,Ie as L,Ce as M,Te as N,A as O,fe as P,$e as Q,w as R,M as S,Re as T,y as U,le as V,_e as W,me as X,Ne as Y,Ee as Z,Ue as _,v as a,S as b,P as c,g as d,L as e,k as f,z as g,H as h,W as i,j,V as k,F as l,O as m,K as n,q as o,B as p,J as q,b as r,G as s,Y as t,Z as u,ee as v,se as w,X as x,te as y,ne as z};