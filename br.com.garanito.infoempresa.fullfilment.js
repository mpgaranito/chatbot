// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const https = require('request-promise-native');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  async function httpGet(agent, text) {
    let vtext =' ';
    vtext = text;
    console.log(vtext);
    vtext = vtext.replace(' ','');
    console.log(vtext);
    vtext = vtext.replace(/\./g,'');
    console.log(vtext);
    vtext = vtext.replace(',','');
    console.log(vtext);
    vtext = vtext.replace('-','');
    console.log(vtext);
    vtext = vtext.replace('/','');
    console.log(vtext);
	var url = encodeURI('http://garanitobot.eastus.cloudapp.azure.com/receita/receita/details/'+vtext);
    return https.get(url)
    .catch( err =>
           {
      		console.error(err);
    		agent.add( `Lamento, mas o sistema de consulta está fora do ar. Tente novamente mais tarde.` );
    		})
        .then( body => {
            console.log(body);
      		const a = JSON.parse(body);
            //var val = body.someParameter;
          //var msg = `The value is ${val}`;
          agent.add( `A resposta no meu catálogo online foi essa, "`+a.RAZAOSOCIAL+`". Obrigado por usar nossos serviços.`);
        });
    
    }
  
   async function getcnpj(agent) {
   // httpGet(agent);
        var cnpj = agent.parameters.digitado_cnpj;
      //  console.log('o treco e' + request.body.queryResult.queryText);
      if(cnpj){
       // agent.add(`cnpj é:` + cnpj);
      }else {
        const regex = /(?:\d{1,14})/g;
        const str = request.body.queryResult.queryText;
        let m;

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
              	cnpj = match;
               // agent.add(`cnpj é:` + cnpj);
            });
        }
      }
      const response = await httpGet(agent,cnpj);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

 
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
 // intentMap.set('Default Welcome Intent', welcome);
 // intentMap.set('br.com.garanito.dialogflow.agent.actions.gettimeoclock', consultaHora);
  intentMap.set('br.com.garanito.infoempresas.intents.getcnpj', getcnpj);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
