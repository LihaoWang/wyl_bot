const Nim = require("./NIM_Web_SDK_nodejs_v9.0.1");
const axios = require("axios");
const TELEGRAM_KEY = "";
const chatroom = Nim.Chatroom.getInstance({
  appKey: "",
  isAnonymous: true,
  chatroomNick: "WebAgent",
  // account: account,
  // token: account,
  chatroomId: "442997428",
  chatroomAddresses: ["chatweblink01.netease.im:443"],
  onconnect: onConnect,
  onwillreconnect: onWillReconnect,
  ondisconnect: onDisconnect,
  onerror: onError,
  onmsgs: onmsgs,
});

function onmsgs(msgs) {
  console.log(msgs);
  //   const cleanedMsgs = msgs.filter((msg) => msg.custom.user?.roleId === 3);
  if (msgs[0].type === "text") {
    const userText = encodeURI(msgs[0].text);
    const userName = encodeURI(JSON.parse(msgs[0].custom).user.nickName);
    const text = `*${userName}: *${userText}`;
    axios.post(
      `https://api.telegram.org/bot${TELEGRAM_KEY}/sendMessage?chat_id=-1001722899594&parse_mode=MarkdownV2&text=${text}`
    );
  } else if (msgs[0].type === "image") {
    const imgUrl = msgs[0].file.url;
    axios.post(
      `https://api.telegram.org/bot${TELEGRAM_KEY}/sendPhoto?chat_id=-1001722899594&photo=${imgUrl}`
    );
  } else {
    axios.post(
      `https://api.telegram.org/bot${TELEGRAM_KEY}/sendMessage?chat_id=-1001722899594&&text=${encodeURI(
        "Message Type not yet supported"
      )}`
    );
  }
}

function onConnect(chatInfo) {
  console.log("连接成功");
  console.log(chatInfo);
  chatroom.getHistoryMsgs({
    timetag: 0,

    done: (err, obj) => {
      //   console.log(obj);
      //   const msgs = [...obj.msgs];
      //   msgs.reverse();
      //   const cleanedMsgs = msgs
      //     .filter((msg) => !msg.resend)
      //     .map((msg) => ({ ...msg, custom: JSON.parse(msg.custom) }));
    },
  });
  chatroom.getChatroomMembers({
    guest: false,
    done: (err, obj) => {
      console.log(obj);
    },
  });
}
function onWillReconnect(obj) {
  // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
  console.log("即将重连");
  console.log(obj.retryCount);
  console.log(obj.duration);
}
function onDisconnect(error) {
  // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
  console.log("丢失连接");
  console.log(error);
  if (error) {
    switch (error.code) {
      // 账号或者密码错误, 请跳转到登录页面并提示错误
      case 302:
        break;
      // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
      case 417:
        break;
      // 被踢, 请提示错误后跳转到登录页面
      case "kicked":
        break;
      default:
        break;
    }
  }
}
function onError(error) {
  console.log(error);
}
