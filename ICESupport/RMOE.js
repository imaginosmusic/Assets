// Github:   <WHERE YOU STORE IT>
// By:       <YOU>
// Contact:  https://app.roll20.net/users/<YOUR ID>

const RMOE = (() => {// eslint-disable-line no-unused-vars

    const version = '0.2.5';
    const lastUpdate = '8/4/2022;'
    const schemaVersion = 0.1;

    const checkInstall = () =>  {
        log('-=> RMOE v'+version+' <=-  ['+(new Date(lastUpdate))+']');

        if( ! state.hasOwnProperty('NAME') || state.NAME.version !== schemaVersion) {
            log(`  > Updating Schema to v${schemaVersion} <`);
            state.NAME = {
                version: schemaVersion
            };
        }
    };

    const handleInput = (msg) => {
        // CALL LIKE THIS OR IT WILL NOT WORK!!!
        // !RMOE [[1d100!>96cs>96cf<5+5+5+5+5]]
        // Will only process one inline roll.
        // open ended roll must be the first
        // inline roll in the roll group.
        
        // if it is not an api call, duck out
        if (msg.type !== "api") {
            return;
        }
        var rmoecall = msg.content.includes("!RMOE");
        // if it is not an api call to this MOD, duc out
        if(!rmoecall){
            return;
        }
        
        // get the rolls
        var rolls = msg.inlinerolls;
        // get the result of the original unmodified roll
        var diceroll = rolls[0].results.rolls[0].results[0].v;
        // get the modified roll
        var totalroll = rolls[0].results.total;
        // get the expression that was sent with the original roll
        var modifier = rolls[0].results.rolls[1].expr;
        // prep the output for the defualt roll template
        var output = "&{template:default} {{Name=Open Ended Roll}} {{Die roll=[[" + diceroll + "]]}}";
        
        // test the original roll and react to low open ended result
        if(diceroll <= 5){
            // low. use the original unmodified result and subtract exploding d100
            output += " {{Total Roll=[[" + diceroll + "-1d100!>96" + modifier + "]]}}"
        }
        else{
            // not a low result. Use the original modified result
            output += "{{Total Roll=[[" + diceroll + modifier +"]]}}";
        }
        // return the output to the chat window to complete low exploding rolls
        // or to display the original result of a non-exploding or high-exploding
        // roll
        sendChat("Rolemaster Dice", output);
        
        
    };
    
    const registerEventHandlers = () => {
        on('chat:message', handleInput);
    };

    on('ready', () => {
        checkInstall();
        registerEventHandlers();
    });

    return {
        // Public interface here
    };

})();