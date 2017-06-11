import socket from './ws-client';
import {UserStore} from './storage';
import {ChatForm, ChatList, promptForUserName} from './dom';
import moment from 'moment';

const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]';
const LIST_SELECTOR = '[data-chat="message-list"]';

let userStore = new UserStore('x-chattrbox/u');
let username  = userStore.get();
if(!username){
  username = promptForUserName();
  userStore.set(username);
}


class ChatApp {
    constructor() {
        this.chatForm = new ChatForm(FORM_SELECTOR,INPUT_SELECTOR);
        this.chatList = new ChatList(LIST_SELECTOR,username);

        socket.init('ws://qihao.mynetgear.com:12345');
        socket.registerOpenHandler(()=>{
          this.chatForm.init((data) =>{
            let message = new ChatMessage({'message':data});
            socket.sendMesage(message.serialize());
          });
        });
        socket.registerMessageHandler((data)=>{
          console.log(data);
          let message = new ChatMessage(data);
          this.chatList.drawMessage(message.serialize());
        });
        this.chatList.init();
    }
}

class ChatMessage {
    constructor({
        message: m,
        user: u = username,
        timestamp: t = (new Date()).getTime()
    }){
        this.message = m;
        this.user = u;
        this.timestamp = t;
    }
    serialize(){
      return{
        user:this.user,
        message:this.message,
        timestamp:this.timestamp
      }
    }
}

export default ChatApp;
