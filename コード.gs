var prop = PropertiesService.getScriptProperties().getProperties();
var slackApp = SlackApp.create(prop.token); 
var token_j2e = prop.slash_command_token_j2e;
var token_e2j = prop.slash_command_token_e2j;

function doGet(e) {
  doPost(e);
}

function doPost(e) {

  if (!e) {

    //for Test. Slackからは以下のパラメータで飛んできます。
    e = {
      parameter : {
        team_id : "T0001",
        channel_id : "Cxxxxxxx",
        channel_name : "aso_bot",
        timestamp : "1355517523.000005",
        user_id : "Uxxxxxx",
        user_name : "wataru-kurashima",
        text : "こんにちは、世界",
        trigger_word : "MyFirstBot:",
        command : "/.j2e",
        token : token_j2e
      }
    };
  }
  Logger.log(e);

  //slackのスラッシュコマンドのtoken。ここに含まれていない場合はErrorにする。
  var slashtoken = [token_j2e,token_e2j];
  if (!slashtoken.some(function(v){ return v === e.parameter.token })) {
    throw new Error("invalid token.");
  }
  
  var command = e.parameter.command;
  var text = e.parameter.text;
  var user = e.parameter.user_name;
  if (command === '/.j2e') {
    var translated_text = translateEn(text);
    var post_text = "やぁ、 " + user + ",\n> " + text + "\n を英語で言うと、\n>"+ translated_text;
  } else if (command === '/.e2j') {
    var translated_text = translateJa(text);
    var post_text = "Hey, " + user + ",\n> " + text + "\nin Japanese,\n>"+ translated_text;
  } else {
    throw new Error("invalid command.");
  }

  var channel = e.parameter.channel_id;
  postSlack(post_text, command, channel);
  return null;
}


function translateEn(text) {
  var en_text = LanguageApp.translate(text, 'ja', 'en');
  return en_text;
}

function translateJa(text) {
  var ja_text = LanguageApp.translate(text, 'en', 'ja');
  return ja_text;
}

function postSlack(text, command, channel) {
  //Create an instance.
  var postChannelId = channel;
  var postOption = {
    username : "DicBot",
    icon_emoji : ":blue_book:",
    link_names : 1
  }
   
  //#team_posへ、@channel、from username付でスラッシュコマンドの引数を投稿する
  var slackRes = slackApp.chatPostMessage(postChannelId, text , postOption);

  Logger.log(slackRes);
  return null;
}