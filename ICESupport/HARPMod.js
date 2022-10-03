// Github:   <WHERE YOU STORE IT>
// By:       Imaginos
// Contact:  https://app.roll20.net/users/<YOUR ID>

const HARP = (() => {// eslint-disable-line no-unused-vars

    const version = '0.1.0';
    const lastUpdate = '8/12/2022;'
    const schemaVersion = 0.1;

    const checkInstall = () =>  {
        log('-=> HARP v'+version+' <=-  ['+(new Date(lastUpdate))+']');

        if( ! state.hasOwnProperty('NAME') || state.NAME.version !== schemaVersion) {
            log(`  > Updating Schema to v${schemaVersion} <`);
            state.NAME = {
                version: schemaVersion
            };
        }
    };

    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        
        log(msg.content);
        var rawContent = msg.content;
        if(!rawContent.includes("!HARP")){
            return;
        }
        rawContent = rawContent.replace("l= ","l=");
        rawContent = rawContent.replace("ng ","ng");
        rawContent = rawContent.replace(" = ","=");
        log("Content After First Cleaning: " + rawContent);
        rawContent = rawContent.replace("n= R","n=R");
        rawContent = rawContent.replace("g 1d20 = (","g1d20=(");
        log("Content After Second Cleaning: " + rawContent);
        rawContent = rawContent.replace(") + (",")+(");
        log("Content After Third Cleaning: " + rawContent);
        rawContent = rawContent.replace(")* (","*(");
        log("Content After fourth Cleaning: " + rawContent);
        rawContent = rawContent.replace(" + ","+");
        log("Content After Fifth (1) Cleaning: " + rawContent);
        rawContent = rawContent.replace(" + ","+");
        log("Content After Fifth (2) Cleaning: " + rawContent);
        rawContent = rawContent.replace(")) - ","))-");
        log("Content After Sixth Cleaning: " + rawContent);
        rawContent = rawContent.replace(" * (","*(");
        log("Content After Seventh Cleaning: " + rawContent);
        rawContent = rawContent.replace("Martial Arts Strikes","MartialArtsStrikes");
        rawContent = rawContent.replace("Martial Arts Sweeps","MartialArtsSweeps");
        rawContent = rawContent.replace("Internal Poison","InternalPoison");
        rawContent = rawContent.replace("External Poison","ExternalPoison");
        let args = rawContent.split(/\s+/);
        var who = msg.who;
        var inputRoll = "";
        var inputResolution = "";
        var inputDamageType = "";
        var inputLocation = "";
        var sizemod = "";
        var critical = "";
        var miniscule = "";
        var tiny = "";
        var small = "";
        var medium = "";
        var large = "";
        var huge = "";
        var gigantic = "";
        switch(args[0]) {
            case '!HARPSkill':
                var argcount = args.length;
                for(var i = 1;i < argcount; i++){
                    var split = args[i].indexOf("=");
                    var harpswitch = args[i].substr(0,split);
                    var harparg = args[i].substr(split+1);
                    log("----------------------------------------");
                    log("Switch: " + harpswitch);
                    log("Value: " + harparg);
                    if (harpswitch === "roll"){
                        inputRoll = harparg;
                    }
                    if (harpswitch === "resolution"){
                        inputResolution = harparg;
                    }
                    if(harpswitch === "damage"){
                        inputDamageType = harparg;
                    }
                    if(harpswitch == "location"){
                        inputLocation = harparg;
                    }
                    if(harpswitch == "crit"){
                        critical = harparg;
                    }
                    if(harpswitch == "sizemod"){
                        sizemod = harparg;
                    }
                    if(harpswitch == "miniscule"){
                        miniscule = harparg;
                    }
                    if(harpswitch == "tiny"){
                        tiny = harparg;
                    }
                    if(harpswitch == "small"){
                        small = harparg;
                    }
                    if(harpswitch == "medium"){
                        medium = harparg;
                    }
                    if(harpswitch == "large"){
                        large = harparg;
                    }
                    if(harpswitch == "huge"){
                        huge = harparg;
                    }
                    if(harpswitch == "gigantic"){
                        gigantic = harparg;
                    }
                }
                break;
        }
        var find = inputRoll.indexOf("'>");
        var finalRoll = inputRoll.substr(find);
        finalRoll = finalRoll.replace("'>","");
        find = inputLocation.indexOf("'>");
        var finalLocation = inputLocation.substr(find);
        finalLocation = finalLocation.replace("'>","");
        if (inputResolution !== ""){
            var output = "";
            switch(inputResolution){
                case "all":
                    if (finalRoll >= 101){
                        output = "&{template:info} {{name=All-or-Nothing Roll (" + finalRoll + ")}} {{title=<img src='https://raw.githubusercontent.com/imaginosmusic/Assets/AssetsMain/Images/crit.png' height='15' width='15'/>}} {{color=outdoor}} {{info=Success!}}";
                    }
                    else{
                        output = "&{template:info} {{name=All-or-Nothing Roll (" + finalRoll + ")}} {{title=<img src='https://raw.githubusercontent.com/imaginosmusic/Assets/AssetsMain/Images/fumble1.png' height='15' width='15'/>}} {{color=influence}} {{info=Falied! All-or-Nothing maneuvers require a roll total exceeding 100 to count as a success.}}";
                    }
                    break;
                case "rr":
                    score = getmaneuverscore(finalRoll,inputResolution);
                    output = "&{template:info} {{name=RR Roll (" + finalRoll + ")}} {{title=" + score + "}} {{info=Result from resistance table.}} {{color=outdoor}}";
                    break;
                case "per":
                    score = getmaneuverscore(finalRoll,inputResolution);
                    output = "&{template:info} {{name=Percentage Roll (" + finalRoll + ")}} {{title=" + score + "}} {{info=Result from percentage table.}} {{color=outdoor}}";
                    break;
                case "bns":
                    score = getmaneuverscore(finalRoll,inputResolution);
                    output = "&{template:info} {{name=Percentage Roll (" + finalRoll + ")}} {{title=" + score + "}} {{info=Result from bonus table.}} {{color=outdoor}}";
                    break;
                case "util":
                    score = getmaneuverscore(finalRoll,inputResolution);
                    output = "&{template:info} {{name=Utility Spell Roll (" + finalRoll + ")}} {{title=" + score + "}} {{info=Result from utility table.}} {{color=outdoor}}";
                    break;
                case "cbt":
                    //var hitlocation = GetHitLocation(finalLocation);
                    log("Critical: " + critical + " Size: " + sizemod + " medium: " + medium + " final Roll: " + finalRoll);
                    var capmessage = "";
                    if(critical == 0){
                        if(sizemod == -30 && parseInt(finalRoll) > parseInt(miniscule)){//miniscule
                            log("Cap damage at 80");
                            finalRoll = miniscule;
                            capmessage = " <small>*capped for miniscule*</small> ";
                        }
                        if(sizemod == -20 && parseInt(finalRoll) > parseInt(tiny)){//tiny
                            log("Cap damage at 80");
                            finalRoll = tiny;
                            capmessage = " <small>*capped for tiny*</small> ";
                        }
                        if(sizemod == -10 && parseInt(finalRoll) > parseInt(small)){//small
                            log("Cap damage at 90");
                            finalRoll = small;
                            capmessage = " <small>*capped for small*</small> ";
                        }
                        if(sizemod == 0 && parseInt(finalRoll) > parseInt(medium)){//medium
                            log("Cap damage at dmedium");
                            finalRoll = medium;
                            capmessage = " <small>*capped for medium*</small> ";
                        }
                        if(sizemod == 10 && parseInt(finalRoll) > parseInt(large)){//large
                            log("Cap damage at 80");
                            finalRoll = large;
                            capmessage = " <small>*capped for large*</small> ";
                        }
                        if(sizemod == 20 && parseInt(finalRoll) > parseInt(huge)){//huge
                            log("Cap damage at 80");
                            finalRoll = huge;
                            capmessage = " <small>*capped for huge*</small> ";
                        }  
                        if(sizemod == 30 && parseInt(finalRoll) > parseInt(gigantic)){//gigantic
                            log("Cap damage at 80");
                            finalRoll = gigantic;
                            capmessage = " <small>*capped for gigantic*</small> ";
                        }  
                    }
                    
                    if(inputDamageType == "InternalPoison" || inputDamageType == "ExternalPoison"){
                        if(inputDamageType == "InternalPoison"){
                            inputDamageDisplay = "Internal Poison";
                        }
                        if(inputDamageType == "ExternalPoison"){
                            inputDamageDisplay = "ExternalPoison";
                        }
                        output = "&{template:info} {{name=" + inputDamageDisplay+ " (" + finalRoll + ")" + capmessage + "}} {{title=It's Poison!}} (" + finalRoll + ")}} " + GetPoisonMessage(inputDamageType,finalRoll) + "{{color=combat}}" ;    
                    }
                    else{
                        if(inputDamageType == "MartialArtsStrikes"){
                            inputDamageDisplay = "Martial Arts Strikes";
                        }
                        else{
                            if(inputDamageType == "MartialArtsSweeps"){
                                inputDamageDisplay = "Martial Arts Sweeps";
                            }
                            else{
                                inputDamageDisplay = inputDamageType
                            }
                            
                        }
                        output = "&{template:info} {{name=" + inputDamageDisplay + " (" + finalRoll + ")" + capmessage + "}} {{title=Hit to " + GetHitLocation(finalLocation) + "}} " + GetDamageMessage(inputDamageType,finalLocation,finalRoll) + "{{color=combat}}" ;    
                    }
                    
                    break;
                case "fumble":
                    log("FUMBLE: " + finalRoll);
                    output = "&{template:info} {{name=Fumble (" + finalRoll + ")}} " + GetFumble(finalRoll) + " {{color=combat}}" ;    
                    break;
            }
            sendChat("HARP Fantasy",output);
        }
        return;
    };
    
    function getmaneuverscore(rollscore,resolution){
        
        var percentage = "";
        var bonus = "";
        var rr = "";
        var utility = "";
        
        if(rollscore < -51){
            percentage = "Fail";
            bonus = "-70";
            rr = "Fail";
            utility = "Cast has failed";
        }
        if(rollscore >= -50 && rollscore <= -31){
            percentage = "Fail";
            bonus = "-65";
            rr = "Fail";
            utility = "Fail";
        }
        if(rollscore >= -30 && rollscore <= -11){
            percentage = "Fail";
            bonus = "-60";
            rr = "Fail";
            utility = "Cast has failed";
        }
        if(rollscore >= -10 && rollscore <= -1){
            percentage = "Fail";
            bonus = "-55";
            rr = "Fail";
            utility = "Fail";
        }
        if(rollscore >= 0 && rollscore <= 10){
            percentage = "Fumble";
            bonus = "-50";
            rr = "Fumble";
            utility = "Fumble";
        }
        if(rollscore >= 11 && rollscore <= 20){
            percentage = "10";
            bonus = "-45";
            rr = "65";
            utility = "Fail";
        }
        if(rollscore >= 20 && rollscore <= 30){
            percentage = "20";
            bonus = "-40";
            rr = "70";
            utility = "Cast has failed";
        }
        if(rollscore >= 31 && rollscore <= 40){
            percentage = "30";
            bonus = "-35";
            rr = "75";
            utility = "Cast has failed";
        }
        if(rollscore >= 41 && rollscore <= 50){
            percentage = "40";
            bonus = "-30";
            rr = "80";
            utility = "Cast has failed";
        }
        if(rollscore >= 51 && rollscore <= 60){
            percentage = "50";
            bonus = "-25";
            rr = "85";
            utility = "Cast has failed";
        }
        if(rollscore >= 61 && rollscore <= 70){
            percentage = "60";
            bonus = "-20";
            rr = "90";
            utility = "Cast has failed";
        }
        if(rollscore >= 71 && rollscore <= 80){
            percentage = "70";
            bonus = "-15";
            rr = "95";
            utility = "Normal";
        }
        if(rollscore >= 81 && rollscore <= 90){
            percentage = "80";
            bonus = "-10";
            rr = "100";
            utility = "Normal cast";
        }
        if(rollscore >= 91 && rollscore <= 100){
            percentage = "90";
            bonus = "-5";
            rr = "110";
            utility = "Normal cast";
        }
        if(rollscore >= 101 && rollscore <= 110){
            percentage = "100";
            bonus = "5";
            rr = "120";
            utility = "Normal cast";
        }
        if(rollscore >= 111 && rollscore <= 130){
            percentage = "110";
            bonus = "10";
            rr = "130";
            utility = "Normal cast";
        }
        if(rollscore >= 131 && rollscore <= 150){
            percentage = "120";
            bonus = "20";
            rr = "140";
            utility = "Normal cast";
        }
        if(rollscore >= 151 && rollscore <= 170){
            percentage = "130";
            bonus = "30";
            rr = "160";
            utility = "Double cast";
        }
        if(rollscore >= 171 && rollscore <= 200){
            percentage = "140";
            bonus = "40";
            rr = "180";
            utility = "Double cast";
        }
        if(rollscore >= 201 && rollscore <= 230){
            percentage = "150";
            bonus = "50";
            rr = "200";
            utility = "Double x2 cast";
        }
        if(rollscore >= 231 && rollscore <= 260){
            percentage = "160";
            bonus = "60";
            rr = "220";
            utility = "Double x2 cast";
        }
        if(rollscore >= 261 && rollscore <= 300){
            percentage = "170";
            bonus = "70";
            rr = "240";
            utility = "Triple cast";
        }
        if(rollscore >= 301){
            percentage = "180";
            bonus = "80";
            rr = "260";
            utility = "Triple cast";
        }
        
        var score = "";
        
        switch(resolution){
            case "rr":
                score = rr;
                break;
            case "per":
                score = percentage;
                break;
            case "bns":
                score = bonus;
                break;
            case "util":
                score = utility;
                break;
        }
        
        return score;
    };
    
    function GetHitLocation(inputLocation){
        
        var outputLocation = "";
        
        if (inputLocation >=1 && inputLocation <= 3){
            outputLocation = "Right Leg"
        }
        if (inputLocation >=4 && inputLocation <= 7){
            outputLocation = "Left Leg"
        }
        if (inputLocation >=8 && inputLocation <= 10){
            outputLocation = "Abdomen and Groin"
        }
        if (inputLocation >=11 && inputLocation <= 12){
            outputLocation = "Chest and Back"
        }
        if (inputLocation >=13 && inputLocation <= 15){
            outputLocation = "Right Arm"
        }
        if (inputLocation >=16 && inputLocation <= 18){
            outputLocation = "Left Arm"
        }
        if (inputLocation >=19 && inputLocation <= 20){
            outputLocation = "Head and Neck"
        }
        
        return outputLocation;
    };
    
    function GetDamageMessage(inputDamageType,inputLocation,inputRoll){
        var outputDamage = "";
        
        if (inputLocation >=1 && inputLocation <= 7){ //legs
            switch(inputDamageType){
                case  "Crush":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Side of thigh bruised.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Strike to top of foes foot.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Ding!}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Light shot causes more pain than damage.}} {{Hits=4}} {{Maneuver=-5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Solid shot to the knee.}} {{Hits=5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Strike breaks a toe.}} {{Hits=6}} {{Maneuver=-10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Strike causes for to stumble, but they manage to keep their balance.}} {{Hits=7}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe Drops to one knee.}} {{Hits=9}} {{Stun=1}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Shot breaks bone in the lower leg. Movement reduced by 50%.}} {{Hits=10}} {{Stun=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Knee momentarily locks preventing movement for 2 rnds}} {{Hits=11}} {{Stun=2}} {{Maneuver=-20}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe drops to ground. Foe Prone and cannot stand.}} {{Hits=12}} {{Stun=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Shin Broken, movement reduced by 1/2}} {{Hits=14}} {{Stun=3}} {{Maneuver=-25}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Blow sutns foe and causes them to fall to the ground.}} {{Hits=15}} {{Stun=3}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foot crushed. Movement reduced to 1/2.}} {{Hits=16}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=1}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Blow shatters foes knee, knocking them to the ground.}} {{Hits=17}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe is Knocked to ground}} {{Hits=19}} {{Stun=5}} {{Maneuver=-40}} {{Bleed=1}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Painful hairline fracture in thigh. Foe is downed.}} {{Hits=20}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=2}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Leg broken. Foe falls to the ground, then expires from shock in 3 rounds.}} {{Hits=21}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Leg torn off. Foe dies instantly from the trauma.}} {{Hits=23}} {{Instantaneous Death}}"};
                    break;
                case  "Puncture":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Shot to the side of thigh.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Nice shot to the foe's foot.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=DING!}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Oh! That is an impressive scratch.}} {{Hits=4}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Helpful hint! The pointy end goes toward the enemy.}} {{Hits=5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Well placed shot to the knee. Foe stumbles. - 5 to next maneuver.}} {{Hits=6}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Shot slices open skin behind knee.}} {{Hits=7}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Minor leg wound.}} {{Hits=8}} {{Maneuver=-5}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Nice gash. Foe drops to the ground.}} {{Hits=9}} {{Stun=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Shot breaks a bone. Movement cut in half.}} {{Hits=10}} {{Stun=1}} {{Maneuver=-10}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Thigh strike. Foe drops to the ground and cannot stand.}} {{Hits=11}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Broken shin, movent at 1/2}} {{Hits=13}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Shot stuns foe and causes them to fll to the ground.}} {{Hits=14}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Destryed knee prevents foe from standing, foe falls to kneeling position.}} {{Hits=15}} {{Stun=3}} {{Maneuver=-20}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Critical shot shtters knee dropping foe to the ground.}} {{Hits=16}} {{Stun=4}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Good damage!}} {{Hits=17}} {{Stun=4}} {{Maneuver=-25}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Hairline fracture to the thigh. Foe Downed}} {{Hits=18}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=3}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Femoral artery severed. Foe dies in 3 rounds from shock and blood loss.}} {{Hits=19}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Shot travels into the lower body severing arteries. Foe dies instantly.}} {{Hits=21}} {{Instantaneous Death}}"};
                    break;
                case  "Slash":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Small cut to the thigh.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Nice strike to the top of foes foot.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Soft slash to the knee}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Swoosh!}} {{Hits=4}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Solid slash to the knee.}} {{Hits=5}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe stumbles as he avoids most of the attack.}} {{Hits=7}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foot slashed. Movement 50%}} {{Hits=8}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Leg slashed causing foe to fall to one knee.}} {{Hits=9}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Musles and tissue slashed in thigh. Foe drops to ground.}} {{Hits=11}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Ankle broken, foe falls to knees. Movement reduced by half.}} {{Hits=12}} {{Stun=1}} {{Maneuver=-20}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Leg broken below the hip. Foe falls to the ground.}} {{Hits=13}} {{Stun=1}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Shin is slashed making standing inpossible.}} {{Hits=15}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foot is broken, foe has difficulty standing. Movement reduced by half.}} {{Hits=16}} {{Stun=2}} {{Maneuver=-30}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Very nice slash knocks opponent to the ground.}} {{Hits=17}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Broken knee drops foe to the ground.}} {{Hits=19}} {{Stun=3}} {{Maneuver=-35}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Leg is slashed causing muscle and bone damage.}} {{Hits=20}} {{Stun=4}} {{Maneuver=-40}} {{Bleed=2}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Strike severs leg mid-thigh. Foe drops to the ground and dies in 6 rounds.}} {{Hits=21}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=3}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Vicious strike exposes muscle and bone. Foe dies of shock in 3 rounds.}} {{Hits=23}} {{Stun=3}} {{Maneuver=-45}} {{Bleed=3}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Leg severed. Foe dies of shock.}} {{Hits=23}} {{Stun=7}} {{Maneuver=-45}} {{Bleed=3}} {{Instantaneous Death}}"};
                    break;
                case  "Grapple":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Grab foe but miss hold}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe grabe, misses.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=You grip foe’s shield arm.}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Grab foe and give him a weak punch.}} {{Hits=2}} {{Maneuver=-5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Collide with foe. You push him away 5’.}} {{Hits=3}} {{Maneuver=-10}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=You and foe collide. He breaks your grip and stumbles away.}} {{Hits=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Routine st maneuver to break garment hold}} {{Hits=4}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Short fingers render thigh hold ineffectual.}} {{Hits=5}} {{Maneuver=-20}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Grasp foe’s leg, lifting it off the ground for a moment.}} {{Hits=5}} {{Maneuver=-25}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Entangle foe’s leg. Foe is knocked down. Foe lands on his arm.}} {{Hits=6}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Entangle foe’s leg and send him down. He pulls a muscle in his leg.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-30}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Trip foe. He goes down, dropping his weapon.}} {{Hits=7}} {{Stun=1}} {{Maneuver=-35}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe trips, you fall on top of him}} {{Hits=8}} {{Stun=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Attack to upper leg. Foe spins to break free. Hard Strength maneuver for foe to break free.}} {{Hits=8}} {{Stun=2}} {{Maneuver=-40}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe tumbles to the ground spraining an ankle. Movement cut 50%.}} {{Hits=9}} {{Stun=3}} {{Maneuver=-45}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Grab leg and flip foe to ground, pinning him for 2 rnds.}} {{Hits=10}} {{Stun=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Entangle foe’s legs. You send foe to the ground. He is knocked out.}} {{Hits=10}} {{Stun=4}} {{Maneuver=-50}} {{Bleed=1}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Leg and hip broken. Bone fragments cut artery killing foe in 3 rnds.}} {{Hits=11}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=1}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Leg torn off, instant death}} {{Hits=12}} {{Instantaneous Death}}"};
                    break;
                case  "Heat":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Smoke in foe’s eyes.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Sparks and smoke dance all over foe.}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Eeeeeoowww!}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe suspects that he is on fire. He is wrong.}} {{Hits=4}} {{Maneuver=-10}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Blast to the knee causes some tissue damage.}} {{Hits=6}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Heat catches foe in lower leg.}} {{Hits=7}} {{Maneuver=-10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Strong blast hits foe in legs. He recoils 5 ft.}} {{Hits=7}} {{Maneuver=-15}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Concentrated strike burns through clothing.}} {{Hits=10}} {{Stun=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe falls down. One leg is on fire.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-20}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Clothing is set on fire. Small flames still burning.}} {{Hits=13}} {{Stun=3}} {{Maneuver=-25}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Flame spreads to both legs causing foe to drop to the ground.}} {{Hits=14}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Searing strike to foe’s legs. Exposed skin and muscle is burned.}} {{Hits=16}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe legs are burned severely. Armor is destroyed.}} {{Hits=17}} {{Stun=5}} {{Maneuver=-35}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=leg and foot severly burned}} {{Hits=19}} {{Stun=6}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Armor is destroyed, severe burns}} {{Hits=20}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Fire burns away skin from the thigh}} {{Hits=21}} {{Stun=7}} {{Maneuver=-45}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Trapped in your blast. He is unconscious and dies in 6 rnds.}} {{Hits=23}} {{Stun=6}} {{Bleed=4}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Leg blast knocks foe to the ground 10’ backward. Foe breaks neck and dies in 3 rnds. Foe is inactive.}} {{Hits=24}} {{Stun=8}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe’s legs are burned away. Instant death.}} {{Hits=27}} {{Instantaneous Death}}"};
                    break;  
                case  "Cold":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Cold causes mild damage}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe evades frantically. He is still chilled.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Light frosting leaves foe unsteady. Once more with feeling!}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Numbing whirlwind encircles foe.}} {{Hits=4}} {{Maneuver=-5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe failed in his efforts to avoid your attack}} {{Hits=5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Ice up the ground and foe’s feet.}} {{Hits=7}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Disorient foe with a tricky shot.}} {{Hits=8}} {{Maneuver=-15}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Metal armor freezes in position}} {{Hits=9}} {{Stun=1}} {{Maneuver=-20}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe ices up; exposed skin freezes}} {{Hits=11}} {{Stun=2}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Your attack freezes legs’ metal items.}} {{Hits=12}} {{Stun=3}} {{Maneuver=-25}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Catch foe in lower leg. Foe is knocked to the ground.}} {{Hits=13}} {{Stun=4}} {{Maneuver=-30}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Strike lands on foe’s legs. The pain and shock cause him to falter.}} {{Hits=15}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe falls. If no armor, the foot is frozen with frostbite.}} {{Hits=19}} {{Stun=5}} {{Maneuver=-35}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe recoils 5 feet away from your assault.}} {{Hits=17}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Blast freezes the knee in a locked position causing foe to fall to the ground.}} {{Hits=19}} {{Stun=6}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Cold makes foe struggle to remain standing.}} {{Hits=20}} {{Stun=7}} {{Maneuver=-45}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Your tempest steals the warmth from his body. He drops and dies in 6 rnds.}} {{Hits=21}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=3}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Both legs are frozen solid, foe dies in 3 rounds from shock}} {{Hits=23}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=4}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Blood frozen in thigh. A clot moves to his heart killing him. Instant death.}} {{Hits=25}} {{Stun=8}} {{Maneuver=-50}} {{Bleed=4}} {{Instantaneous Death}}"};
                    break;
                case  "Electrical":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Bright flash.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe steps back.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe heats up and goes on the defensive.}} {{Hits=3}} {{Maneuver=-5}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Bolt jumps between legs and then into the ground.}} {{Hits=5}} {{Maneuver=-10}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe strikes out at the blast to protect himself.}} {{Hits=6}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Your attack jolts foe, he steps back.}} {{Hits=8}} {{Maneuver=-15}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=The blast of light and heat daunts foe.}} {{Hits=10}} {{Stun=1}} {{Maneuver=-20}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Flashes of light and sharp cracks. Foe’s impressed.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-25}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Strong blast hits foe low. His legs almost give from the pain. Foe recoils.}} {{Hits=13}} {{Stun=3}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Strike is low and pours into ground. A stray bolt arches into foe’s leg.}} {{Hits=14}} {{Stun=4}} {{Maneuver=-30}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Bolt passes through foe’s leg before grounding. Foe suffers.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-35}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Fused metal causes foe to fall. One leg is paralyzed if metal greaves are worn.}} {{Hits=17}} {{Stun=5}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Blast causes severe damage to legs. Foe falls to the ground in convulsions for 1 rnd.}} {{Hits=19}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Strike to hip. Garments catch fire. Shock and nerve damage inflicted}} {{Hits=21}} {{Stun=7}} {{Maneuver=-45}} {{Bleed=1}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Both legs caught in the blast. Foe falls to the ground.}} {{Hits=22}} {{Stun=7}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Simple leg fracture if he wears armor, a compound fracture it not.}} {{Hits=24}} {{Stun=8}} {{Maneuver=-50}} {{Bleed=2}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Titanic blast cuts legs off at the hip. Foe dies in 6 rnds, of course.}} {{Hits=25}} {{Stun=6}} {{Maneuver=-55}} {{Bleed=3}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Legs are completely burned to cinders. Foe dies in 3 rnds from shock.}} {{Hits=27}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=3}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Havoc reigns around foe, instant death}} {{Hits=30}} {{Instantaneous Death}}"};
                    break;
                case  "Impact":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Strike glances off foe.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Firm strike causes foe to step back.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe abandons any hope and falls back}} {{Hits=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe turns to evade and gets hit in the thigh.}} {{Hits=4}} {{Maneuver=-10}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe fails to avoid some of the attack.}} {{Hits=5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe loses his balance.}} {{Hits=6}} {{Maneuver=-15}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Impact unnerves foe and knocks him down.}} {{Hits=7}} {{Stun=1}} {{Maneuver=-20}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Concussive blow bashes foe.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-25}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe loses footing before blow, downed}} {{Hits=10}} {{Stun=3}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Pitiless blow to foe’s lower leg.}} {{Hits=11}} {{Stun=4}} {{Maneuver=-30}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Strike at foe’s legs. Foe wisely leaps back from the strike.}} {{Hits=12}} {{Stun=5}} {{Maneuver=-35}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=His knee is pressed backwards, damaging muscles and tendons.}} {{Hits=14}} {{Stun=6}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Muscles are bruised and tendons are torn. Foe remains standing.}} {{Hits=15}} {{Stun=6}} {{Maneuver=-40}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Strong bash hits foe low. His legs almost give with the pain.}} {{Hits=16}} {{Stun=7}} {{Maneuver=-45}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Blow fractures foe’s thigh. Foe does not fall down, but he cannot walk.}} {{Hits=17}} {{Stun=7}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe’s leg is twisted and his foot is broken.}} {{Hits=19}} {{Stun=8}} {{Maneuver=-50}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=The bone is fractured and foe falls down. Foe dies in 6 rnds from shock.}} {{Hits=20}} {{Stun=6}} {{Maneuver=-55}} {{Bleed=1}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Pelvis is broken. Foe dies in 3 rnds from internal damage.}} {{Hits=24}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=1}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Impact breaks both legs and pelvis. Foe instantly.}} {{Hits=23}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsStrikes":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Blow made a weird noise.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Not so solid a strike.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Forceful. Foe steps back.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Hard strike.}} {{Hits=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=He falls back to recover from your onslaught.}} {{Hits=4}} {{Maneuver=-10}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Your form was perfect, now let’s use some power!}} {{Hits=4}} {{Maneuver=-15}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe falls back from the blow trying to recover.}} {{Hits=5}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Blow on top of foe’s foot is slightly misplaced.}} {{Hits=6}} {{Maneuver=-20}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Strike Achilles tendon. Foe almost falls. He recovers his balance.}} {{Hits=7}} {{Stun=1}} {{Maneuver=-25}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Kick in back of foe’s leg. He stumbles.}} {{Hits=8}} {{Stun=1}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Brutal strike to upper leg. The bruise is deep. The pain makes it hard for foe to stand on the leg.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-30}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Blow strikes a nerve in foe’s upper leg. His leg is numb.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-35}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Strike to nerve in foe’s leg. Foe’s leg buckles. He does not fall; he crouches down in pain.}} {{Hits=10}} {{Stun=3}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=You find an opening and strike the back of foe’s knee.}} {{Hits=11}} {{Stun=4}} {{Maneuver=-40}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Strike to back of lower leg. He is unable to defend himself.}} {{Hits=12}} {{Stun=4}} {{Maneuver=-45}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Strike area behind foe’s knee. Tendon and cartilage damage.}} {{Hits=13}} {{Stun=5}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Kick knock’s foe down and breaks both legs.}} {{Hits=14}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=1}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Kick to hip sends bone splinters through an artery. Foe dies in 3 rnds.}} {{Hits=15}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Precise combination leaves foe in a mangled heap. Instant death.}} {{Hits=16}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsSweeps":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Clever strike.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=You slip in a punch, after failing your sweep.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Your form confuses foe.}} {{Hits=1}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe fights back and pushes you clear.}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Solid strike is not a sweep. Your foe stands listless for a moment and recovers.}} {{Hits=3}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Sweep foe over. He does not fall.}} {{Hits=3}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Your attack breaks foe’s guard down.}} {{Hits=4}} {{Maneuver=-5}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Hard, but less than smooth throw attempt. Foe is unbalanced.}} {{Hits=5}} {{Stun=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Fall bruises foe’s thigh. He gets back to his feet instantly.}} {{Hits=5}} {{Stun=1}} {{Maneuver=-10}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Sweep bruises foe’s leg. Foe limps clear of your attack.}} {{Hits=6}} {{Stun=2}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=You throw foe down, but he gets up quickly. Your killing blow misses him.}} {{Hits=6}} {{Stun=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Sweep to foe’s legs. Foe jumps over some of your assault, but not all of it.}} {{Hits=7}} {{Stun=4}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Strike sweeps his legs up and behind him. Both are broken.}} {{Hits=8}} {{Stun=5}} {{Maneuver=-20}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Fall from throw tears ligaments in foe’s leg.}} {{Hits=8}} {{Stun=6}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=You sweep foe down and break his leg on impact.}} {{Hits=9}} {{Stun=6}} {{Maneuver=-25}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=You assist foe in falling very hard. Foe’s leg is fractured.}} {{Hits=10}} {{Stun=7}} {{Maneuver=-30}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Leg sweep sends foe to the ground. Leg broken and movement cut by half.}} {{Hits=10}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=1}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Sweep downs foe & you put him in a leg-breaking hold.}} {{Hits=11}} {{Stun=8}} {{Maneuver=-35}} {{Bleed=1}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Bring foe down with your knee sweep. You break his back and paralyze him.}} {{Hits=12}} {{Stun=8}} {{Maneuver=-35}} {{Bleed=2}}"};
                    break;
                case  "Large":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Strike to the thigh. You break your weapon.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Nice strike to foot.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Soft shot to the knee.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Ding!}} {{Hits=3}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Don’t play with your food.}} {{Hits=5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Shot to the leg causes more pain than damage.}} {{Hits=6}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Heavy bruise to the thigh.}} {{Hits=7}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Solid shot to the knee.}} {{Hits=8}} {{Maneuver=-5}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Good strike breaks a toe causing a -5 to all moving maneuvers.}} {{Hits=9}} {{Maneuver=-10}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Strike behind knee causes foe to stumble.}} {{Hits=10}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Hit to lower leg causes minor fracture. Movement cut by 25%.}} {{Hits=11}} {{Maneuver=-15}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Minor leg wound.}} {{Hits=12}} {{Maneuver=-20}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Ouch! Leg broken and ankle sprained.}} {{Hits=13}} {{Stun=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foot broken. Movement cut by 50%.}} {{Hits=16}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Leg broken. Movement cut by 50%. Foe falls to the ground.}} {{Hits=15}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Thigh broken in half. Foe drops to the ground.}} {{Hits=17}} {{Stun=2}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Strike goes through the leg and into the pelvis.}} {{Hits=18}} {{Stun=2}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Leg severed. Foe dies in 3 rnds from the massive blood loss.}} {{Hits=19}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Crushing blow breaks hip sending splinters through several vital organs. Instant death.}} {{Hits=21}} {{Instantaneous Death}}"};
                    break;
                case  "Huge":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Your strike is powerful. Weapon breaks.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=You are distracted and swing weakly.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=This terrible creature’s hide deflects the blow.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Graceful assault knocks down foe’s defenses.}} {{Hits=2}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Incredible strike across foe’s calf trips him.}} {{Hits=3}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Acceptable strike to foe’s leg.}} {{Hits=4}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=You deal out a sharp and hard strike. Foe steps back to look at his leg.}} {{Hits=5}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Solid strike on foe’s leg. You move quickly away to avoid the retaliation.}} {{Hits=6}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Catch foe in his exposed leg.}} {{Hits=6}} {{Maneuver=-5}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Blow injures foe’s upper leg.}} {{Hits=7}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Strike to foe’s leg makes them hop around from the pain.}} {{Hits=8}} {{Maneuver=-10}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Next time, try hitting a vital spot.}} {{Hits=9}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Shin strike. Skin is torn open and bone is bruised. That one hurt.}} {{Hits=10}} {{Maneuver=-15}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Hammering foe’s thigh gets you some respect.}} {{Hits=10}} {{Stun=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Sparks fly as your weapon strikes solidly on the thigh.}} {{Hits=11}} {{Stun=1}} {{Maneuver=-20}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Boom! Solid without question.}} {{Hits=12}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Shattered thigh.}} {{Hits=13}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=1}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Leg severed at the hip. Foe dies in 3 rnds.}} {{Hits=14}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Your weapon cuts off both legs. Instant death.}} {{Hits=15}} {{Instantaneous Death}}"};
                    break;
                case  "Acid":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Ouch!}} {{Hits=1}}"};
        			if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=A few extra drops startle foe.}} {{Hits=2}}"};
        			if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe wants you to feel like you are doing well. Acts impressed.}} {{Hits=3}}"};
        			if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe gets an unusual burn.}} {{Hits=5}} {{Maneuver=-10}}"};
        			if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=The burning and the smoke makes foe wary of you.}} {{Hits=6}} {{Maneuver=-15}}"};
        			if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe's legs get weak from the burning of the attack.}} {{Hits=8}} {{Maneuver=-20}}"};
        			if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=All exposed skin suffers from a mild acid burn}} {{Hits=10}} {{Stun=1}} {{Maneuver=-20}}"};
        			if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Acid burns foe's leg and damages armor.}} {{Hits=11}} {{Stun=1}} {{Maneuver=-25}}"};
        			if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe turns to avoid the attack and takes the full force on their leg.}} {{Hits=13}} {{Stun=2}} {{Maneuver=-30}}"};
        			if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Strong attack to leg staggers foe and knocks them back 5 feet.}} {{Hits=14}} {{Stun=2}} {{Bleed=1}}"};
        			if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Acid completely covers foe. They almost lose their footing.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-35}} {{Bleed=1}}"};
        			if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Attack burn foes feet.}} {{Hits=17}} {{Stun=3}} {{Maneuver=-40}} {{Bleed=1}}"};
        			if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe attempts to dodge, but trips. He drops to one knee, lower leg armor dissolved.}} {{Hits=19}} {{Stun=4}} {{Bleed=2}}"};
        			if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Armor destroyed.}} {{Hits=21}} {{Stun=4}} {{Maneuver=-45}} {{Bleed=2}}"};
        			if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Both legs burned badly. Armor and clothing are melted away.}} {{Hits=22}} {{Stun=5}} {{Maneuver=-50}} {{Bleed=2}}"};
        			if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Massive attack destroys all organic covering.}} {{Hits=24}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=3}}"};
        			if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Legs destroyed and melted. Vital organs spill out. Foe dies in 6 painful rounds.}} {{Hits=25}} {{Stun=6}} {{Maneuver=-55}} {{Bleed=3}} {{Death in 6 rounds}}"};
        			if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Strike makes them collapse. Their only release, is death in 3 rnds.}} {{Hits=27}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=3}} {{Death in 3 rounds}}"};
        			if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Massive acid attack melts foe starting with the legs. Instant death.}} {{Hits=30}} {{Instantaneous Death}}"};
                    break;
            }
        }
        if (inputLocation >=8 && inputLocation <= 10){// abdomen and groin
            switch(inputDamageType){
                case  "Crush":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Light hit!}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Close shot to the vitals makes foe wince.}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Baff!}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Good shot to the soft tissue. Some bruising.}} {{Hits=5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Well-placed shot causes some internal damage.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Hard strike bruises muscles and soft tissue.}} {{Hits=7}} {{Stun=1}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Hip shot knocks foe off balance, but they remain upright.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Painful blow.}} {{Hits=10}} {{Stun=2}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Sound of organs being injured can be heard 20' away.}} {{Hits=12}} {{Stun=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Foe gets the wind knocked out of them.}} {{Hits=13}} {{Stun=3}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Liver and kidney damage. Foe stumbles back from force of blow.}} {{Hits=15}} {{Stun=4}} {{Maneuver=-20}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Muscles and tissue destryed. Belt torn free and equipment falls.}} {{Hits=16}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Blow knocks the wind out of foe causing them to gasp for air.}} {{Hits=17}} {{Stun=5}} {{Maneuver=-25}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=String shot bends foe around your weapon.}} {{Hits=19}} {{Stun=6}} {{Bleed=1}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe doubles over your weapon.}} {{Hits=20}} {{Stun=8}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Shot crushes tissue. That's going to be a tender spot.}} {{Hits=22}} {{Stun=9}} {{Bleed=2}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=internal bleeding causes foe to die in 6 rounds from shock.}} {{Hits=23}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=3}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Resounding blow knock foe down. Internal injuries cause death in 3 rounds.}} {{Hits=25}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=3}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Instant death. The abdomen is ripped open.}} {{Hits=27}} {{Instantaneous Death}}"};
                    break;
                case  "Puncture":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Light hit!}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Whoa! Careful, you might hurt someone!}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Thunk!}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Getting better. Maybe a little more practice?}} {{Hits=4}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Good shot to soft tissue.}} {{Hits=6}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Excellent shot causes some internal damage.}} {{Hits=7}} {{Stun=1}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Cut across abdomen.}} {{Hits=8}} {{Stun=1}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Minor wound to the mid-section. Foe steps back.}} {{Hits=9}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Pierced intestine. Healing will be required.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-5}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Stomach pierced.}} {{Hits=12}} {{Stun=3}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Liver and kidneys damaged. Foe steps back.}} {{Hits=13}} {{Stun=3}} {{Maneuver=-10}} {{Bleed=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Nice hit destroys muscles and tissue.  Armor needs some repairs.}} {{Hits=15}} {{Stun=4}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Shot makes foe wince and bleed.}} {{Hits=16}} {{Stun=4}} {{Maneuver=-15}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Optimal strike pierces intestines and stomach.}} {{Hits=17}} {{Stun=5}} {{Bleed=3}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Well placed shot goes completely through soft tissue and out the back.}} {{Hits=19}} {{Stun=6}} {{Maneuver=-20}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Critical strike causes serious internal damage.}} {{Hits=20}} {{Stun=7}} {{Bleed=4}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Internal bleeding is fatal. Foe dies in 6 rounds.}} {{Hits=21}} {{Stun=6}} {{Maneuver=-25}} {{Bleed=4}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Several vital organs destroyed. Foe dies after 3 rounds of inactivity.}} {{Hits=23}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=5}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe is impaled and des instantly. Weapon is stuck until freed.}} {{Hits=25}} {{Instantaneous Death}}"};
                    break;
                case  "Slash":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Light!}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Dangerous looking strike makes foe wince.!}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=User error.}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Pow!}} {{Hits=5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=You could do better.}} {{Hits=6}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Hip slash knocks foe off balance.}} {{Hits=8}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=You feel skin give way as you slash him open.}} {{Hits=9}} {{Stun=1}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe gets sliced open in the mid-section delivering.}} {{Hits=11}} {{Stun=1}} {{Maneuver=-10}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=That’s going to leave a mark. Are you trying to carve your initials?}} {{Hits=13}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Well-placed slash causing internal damage. Blood stains his garments.}} {{Hits=14}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Deep wound & bleeding. Organic armor in that area is destroyed.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-20}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Well-placed strike damages internal organs.}} {{Hits=17}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Hip broken and internal bleeding. Foe winces from the pain.}} {{Hits=19}} {{Stun=4}} {{Maneuver=-25}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Your cut opens a vein in the groin area.}} {{Hits=20}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Groin shot! Foe is in intense agony.}} {{Hits=22}} {{Stun=6}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Echoing blow knocks foe down to the ground.}} {{Hits=23}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe eviscerated. Dies in 6 rounds.}} {{Hits=25}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=3}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe knocked down and expires in 3 rnds.}} {{Hits=27}} {{Stun=3}} {{Maneuver=-45}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    break;
                case  "Grapple":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Your fingernails cut deep}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Weak grip.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=He hurts himself evading}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Push foe, unbalancing him}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Poor attack allows foe to escape your grasp}} {{Hits=3}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=You grapple foe in a brutal way. Hold proves to be excellent.}} {{Hits=4}} {{Maneuver=-10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Routine St maneuver for foe to break free}} {{Hits=5}} {{Maneuver=-15}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Sloppy grip to lower back. Foe wards you off.}} {{Hits=5}} {{Stun=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Grab foe’s waist.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-20}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Slipping grasp around foe’s waist is weak. He breaks your grip.}} {{Hits=7}} {{Stun=2}} {{Maneuver=-25}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Grapple breaks a few bones.}} {{Hits=8}} {{Stun=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Grip foe’s waist. He begins to break free.}} {{Hits=8}} {{Stun=3}} {{Maneuver=-30}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Good hold around the waist crushes foe.}} {{Hits=9}} {{Stun=3}} {{Maneuver=-35}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Bear hug around foe. Both his arms are pinned. Hard Strength maneuver for foe to break free.}} {{Hits=10}} {{Stun=4}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=You do not know your own strength. Your grip leaves him with multiple shattered bones.}} {{Hits=11}} {{Stun=4}} {{Maneuver=-40}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Good hold around foe’s waist pulls him to the ground.}} {{Hits=11}} {{Stun=5}} {{Maneuver=-45}} {{Bleed=1}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=You send him flying 10 feet, knocking him out for 1d10 hours.}} {{Hits=12}} {{Stun=2}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Spine broken. Foe dies in 3 rnds from the shock.}} {{Hits=13}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Internal organs crushed, instant death}} {{Hits=14}} {{Instantaneous Death}}"};
                    break;
                case  "Heat":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe evades the flames.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Sweltering heat reaches out for foe.}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Humphhfffff!}} {{Hits=4}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Flash unbalances foe and causes some damage.}} {{Hits=5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Skin damage around the waist.}} {{Hits=7}} {{Stun=1}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Abdomen entangled in flames.}} {{Hits=8}} {{Stun=2}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Flames burst against foe’s side.}} {{Hits=10}} {{Stun=3}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Flame spreads up foe’s side.}} {{Hits=12}} {{Stun=4}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Strike ignites foe’s cloak and pack.}} {{Hits=13}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=He falls on his back. He is prone for 1 rnd.}} {{Hits=14}} {{Stun=5}} {{Maneuver=-20}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Blast engulfs lower half of foe’s body.}} {{Hits=17}} {{Stun=6}} {{Maneuver=-25}} {{Bleed=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe’s lower body is badly burned.}} {{Hits=18}} {{Stun=6}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Garments and equipment on the waist are destroyed.}} {{Hits=20}} {{Stun=7}} {{Maneuver=-30}} {{Bleed=3}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=foe drops to one knee}} {{Hits=22}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=3}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Severe burn destroyes garments and skin}} {{Hits=23}} {{Stun=8}} {{Bleed=4}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Cover foe with flash fire, exposed skin burns}} {{Hits=25}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=4}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Every part of foe is ablaze. He dies in 6 rnds, making terrifying noises.}} {{Hits=27}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=5}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe is consumed by a hellfire in 3 rnds. Foe is inactive}} {{Hits=28}} {{Stun=3}} {{Bleed=5}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Fire devours foe’s abdominal region. Instant death.}} {{Hits=31}} {{Stun=9}} {{Maneuver=-50}} {{Bleed=5}} {{Instantaneous Death}}"};
                    break;  
                case  "Cold":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=A brief climate change.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Your blast looks good, works poorly.}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe is covered in a light frost.}} {{Hits=3}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Light blast chills foe.}} {{Hits=5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Chilling strike gets foe’s attention.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe seems mildly annoyed with you.}} {{Hits=8}} {{Stun=2}} {{Maneuver=-10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe screams from the frigid air.}} {{Hits=9}} {{Stun=3}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Chilly blast injures foe.}} {{Hits=11}} {{Stun=4}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe feels the icy touch of death trying to reach out to him.}} {{Hits=13}} {{Stun=5}} {{Maneuver=-20}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Blast sends foe spinning.}} {{Hits=14}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Strike to foe’s waist. All equipment on belt freezes and breaks if foe moves.}} {{Hits=16}} {{Stun=6}} {{Maneuver=-25}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Freezing shot disables foe.}} {{Hits=17}} {{Stun=6}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Hip is fractured. Skin and muscles are frostbitten. Foe falls down.}} {{Hits=19}} {{Stun=7}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Blast partially freezes foe.}} {{Hits=10}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=3}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe is knocked down from the bitter blast of cold air.}} {{Hits=22}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Strong unbalancing blast.}} {{Hits=23}} {{Stun=8}} {{Bleed=4}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe freezes and dies in 6 rnds as a well-preserved frozen statue. Store in a cool dry place.}} {{Hits=23}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=4}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Blast freezes foe’s lower extremities. Foe dies in 3 rnds from shock.}} {{Hits=27}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=5}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe freezes solid. Instant death.}} {{Hits=27}} {{Stun=9}} {{Maneuver=-50}} {{Bleed=5}} {{Instantaneous Death}}"};
                    break;
                case  "Electrical":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Not much flash.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe giggles.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Look at the sparks fly!}} {{Hits=4}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Bolt jumps from foe’s weapon into the ground.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-5}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe’s hair stands on end. Frightening!}} {{Hits=8}} {{Stun=2}} {{Maneuver=-10}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Blast leaves foe smoldering}} {{Hits=9}} {{Stun=3}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe just had a revelation about his own mortality}} {{Hits=11}} {{Stun=4}} {{Maneuver=-15}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=How did you get it to stand on end?}} {{Hits=13}} {{Stun=5}} {{Maneuver=-20}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe looks uncomfortable as the energy ripples over his body.}} {{Hits=15}} {{Stun=5}} {{Maneuver=-25}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Foe is making funny noises. His tongue is not working correctly.}} {{Hits=17}} {{Stun=6}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe is knocked sideways and almost falls from the blast.}} {{Hits=19}} {{Stun=7}} {{Maneuver=-30}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Blast to foe’s waist. He stumbles and twitches for the next hour.}} {{Hits=20}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Strike knocks foe backwards 10’. He lands on the ground in a heap of light and sound.}} {{Hits=22}} {{Stun=8}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=You hit hard; foe’s abdomen is hammered. He steps back 5 feet.}} {{Hits=24}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe loses control of his bodily functions for 1 rnd.}} {{Hits=26}} {{Stun=9}} {{Maneuver=-45}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=The shock of the assault inhibits foe’s spine. He has trouble standing.}} {{Hits=28}} {{Stun=9}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe’s body is surrounded by smoke and ozone. He then dies in 6 rnds.}} {{Hits=30}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=4}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=You just invented the x-ray. Foe dies in 3 rnds.}} {{Hits=32}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe’s insides heat up and burn, destroying nerves and organs alike. Foe drops and dies instantly.}} {{Hits=35}} {{Instantaneous Death}}"};
                    break;
                case  "Impact":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe evades the blow.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe staggers back and trips.}} {{Hits=2}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Firm strike causes foe to stumble.}} {{Hits=3}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=A solid shot unnerves foe.}} {{Hits=5}} {{Stun=1}} {{Maneuver=-5}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Sweep foe onto his back.}} {{Hits=6}} {{Stun=2}} {{Maneuver=-10}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Strike sends foe reeling back 10’.}} {{Hits=7}} {{Stun=3}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe looks thoroughly abused by your treatment.}} {{Hits=9}} {{Stun=4}} {{Maneuver=-15}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Moderate hit to midsection.}} {{Hits=10}} {{Stun=5}} {{Maneuver=-20}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Whack! He most definitely felt that one!}} {{Hits=12}} {{Stun=6}} {{Maneuver=-25}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Medium blast staggers foe.}} {{Hits=13}} {{Stun=6}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe is knocked down and stunned. He grips his stomach in pain.}} {{Hits=15}} {{Stun=7}} {{Maneuver=-30}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe reels from this strike. He avoids death but not damage.}} {{Hits=16}} {{Stun=7}} {{Maneuver=-35}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Organs are damaged and foe throws up blood.}} {{Hits=17}} {{Stun=8}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe is lifted off the ground and thrown back 5’.}} {{Hits=19}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe is knocked to the ground; has trouble standing up.}} {{Hits=20}} {{Stun=9}} {{Maneuver=-45}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Strike provides some excellent openings.}} {{Hits=22}} {{Stun=9}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=His spine is broken. Blood pours from his mouth. He dies in 6 rnds.}} {{Hits=23}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Vital internal organs destroyed. Foe dies in 3 inactive rounds.}} {{Hits=25}} {{Stun=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Blast breaks thirty bones in foe’s skeleton. Foe dies instantly.}} {{Hits=27}} {{Stun=10}} {{Maneuver=-55}} {{Bleed=2}}"};
                    break;
                case  "MartialArtsStrikes":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=How did you botch that?}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Weak spear hand.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Glancing kick to foe’s back.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Shot to foe’s stomach.}} {{Hits=3}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Grab foe and bring your knee into his ribs.}} {{Hits=4}} {{Maneuver=-5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=A step to the side and catch foe in his back.}} {{Hits=5}} {{Stun=1}} {{Maneuver=-10}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Snappy double shot to ribs. Ribs are fractured.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Side strike jars foe’s kidneys.}} {{Hits=7}} {{Stun=2}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Back strike. Foe attempts to flee and then changes his mind.}} {{Hits=8}} {{Stun=2}} {{Maneuver=-20}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Strike is solid and turns foe around.}} {{Hits=9}} {{Stun=3}} {{Maneuver=-25}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Press your attack under the bottom of foe’s ribcage. Knock the wind out of foe.}} {{Hits=10}} {{Stun=4}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Elbow to solar plexus and back of fist to foe’s face. Foe drops.}} {{Hits=11}} {{Stun=4}} {{Maneuver=-40}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Round-house kick drops foe to his knees.}} {{Hits=12}} {{Stun=5}} {{Maneuver=-35}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Front kick to midsection doubles foe over.}} {{Hits=13}} {{Stun=6}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Strike to abdomen ruptures spleen.}} {{Hits=14}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Side strike knocks foe down. Foe hits hard and loses his direction.}} {{Hits=15}} {{Stun=7}} {{Maneuver=-40}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe drops to the ground, spitting blood,}} {{Hits=16}} {{Stun=6}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Kick to solar plexus ruptures liver and spleen. Foe dies in 3 rnds.}} {{Hits=17}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Spear hand pierces solar plexus & ruptures heart. Instant death}} {{Hits=18}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsSweeps":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Looking good.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Knee to thigh. Unbalance foe.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe stumbles slightly.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=A soft strike and a hard punch causes damage.}} {{Hits=2}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Sweep foe over. He spends some time trying to recover his balance.}} {{Hits=3}} {{Stun=1}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe knocked to the ground}} {{Hits=4}} {{Stun=1}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Your teacher would be so proud of you!}} {{Hits=5}} {{Stun=2}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Sweep takes foe down on one knee. He breaks free and stands in pain.}} {{Hits=5}} {{Stun=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Your sweep pushes foe to the side.}} {{Hits=6}} {{Stun=4}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Grip foe’s waist and throw him down.}} {{Hits=7}} {{Stun=5}} {{Maneuver=-10}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=You sweep foe over. Foe falls and breaks his hip.}} {{Hits=8}} {{Stun=6}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Sweep sends foe to the ground hard. He fractures a few bones in the fall.}} {{Hits=8}} {{Stun=6}} {{Maneuver=-15}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Perfect toss sends foe flying 10’ away.}} {{Hits=9}} {{Stun=7}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=You spring back to your feet after a roll with foe.}} {{Hits=10}} {{Stun=7}} {{Maneuver=-20}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Upon landing 5’ away, foe has several broken ribs.}} {{Hits=11}} {{Stun=8}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe is flipped over backwards and sent stumbling away.}} {{Hits=11}} {{Stun=8}} {{Maneuver=-25}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Nice throw! You drive a broken bone through his spleen.}} {{Hits=12}} {{Stun=9}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=You send foe through the air to land in a twisted heap.}} {{Hits=13}} {{Stun=9}} {{Maneuver=-35}} {{Bleed=2}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=You use a rolling throw. Foe dies instantly.}} {{Hits=14}} {{Instantaneous Death}}"};
                    break;
                case  "Large":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Light! You break your weapon.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Close shot.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Didn’t quite get the angle on that one.}} {{Hits=3}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Bafff!}} {{Hits=4}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Getting better.}} {{Hits=5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Good shot to the soft tissue.}} {{Hits=7}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Good shot to the abs/kidneys.}} {{Hits=8}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Well-placed shot causes some internal damage.}} {{Hits=9}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Hard strike bruises muscles.}} {{Hits=11}} {{Maneuver=-5}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Hip shot knocks foe off balance and bruises bone.}} {{Hits=12}} {{Stun=1}} {{Maneuver=-10}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Shot stomach/kidneys causes internal damage.}} {{Hits=13}} {{Stun=1}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Minor wound to the mid-section.}} {{Hits=14}} {{Stun=1}} {{Maneuver=-15}} {{Bleed=1}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=The bigger they are…}} {{Hits=19}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Sound of organs being crushed can be heard.}} {{Hits=17}} {{Stun=2}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Groin shot stuns foe and makes him scream in terrible pain. Cheap shot!}} {{Hits=18}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=2}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Well-placed strike causing internal damage.}} {{Hits=20}} {{Stun=3}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Nasty strike to the lungs is taking its toll.}} {{Hits=21}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Guts ripped open. Foe trips over his intestines then dies in 3 rnds.}} {{Hits=22}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=3}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Crushing blow destroys the heart. Instant death.}} {{Hits=24}} {{Instantaneous Death}}"};
                    break;
                case  "Huge":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=You do some damage. Your weapon breaks.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=You may have scratched foe’s hide; it’s hard to tell.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=You can hear bones break.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Blow is placed solidly against foe’s side.}} {{Hits=3}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Solid strike to foes side. Hide not penetrated.}} {{Hits=4}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=The ring of steel echoes through your ears.}} {{Hits=5}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=A decoration pops off your weapon during impact to foes side.}} {{Hits=6}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=You step under his assault and strike him hard in the abdomen.}} {{Hits=7}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Rip hair, horn and scale with a glancing blow.}} {{Hits=8}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Unexpected weak spot found with your strike to foe’s side.}} {{Hits=8}} {{Maneuver=-5}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info= You step into the right spot and cut open foe’s side.}} {{Hits=9}} {{Stun=1}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Glancing strike to foe’s abdomen loses much of the impact on foe’s hide.}} {{Hits=10}} {{Stun=1}} {{Maneuver=-10}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Lucky shot to foe’s gut leaves him gasping for air. He is not happy.}} {{Hits=11}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Strike to foe’s abdomen. Foe has the biggest bruise you have ever seen.}} {{Hits=12}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe steps right into your swing.}} {{Hits=13}} {{Stun=2}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=You rip him open. His blood gets all over you.}} {{Hits=14}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Strike to side injures organs.}} {{Hits=15}} {{Stun=3}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Rip open foe’s abdomen. Foe dies in 3 rnds.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=3}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Your mighty blow is the stuff epics are made of. Instant death.}} {{Hits=17}} {{Instantaneous Death}}"};
                    break;
                case  "Acid":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe dodges.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe dodges, but loses ground.}} {{Hits=2}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=The quick flash of acid makes foe cautious.}} {{Hits=4}} {{Maneuver=-5}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe is taken aback by your fierce expression.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-10}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=You force foe back, but he is not seriously damaged}} {{Hits=8}} {{Stun=1}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Something on foe’s belt seems to attract the acid.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-15}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Acid damages armor and clothing.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-20}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=The acid is seeking foe’s abdomen.}} {{Hits=13}} {{Stun=3}} {{Bleed=1}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Target doubles over from burning pain.}} {{Hits=15}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=1}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Blast hits foe’s stomach. Armor destroyed.}} {{Hits=17}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=1}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Target suffers some agonizing pain as some of his skin is dissolved.}} {{Hits=19}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe smokes for 1D10 hours}} {{Hits=20}} {{Stun=5}} {{Maneuver=-35}} {{Bleed=2}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Destroys anything organic on foe's waist}} {{Hits=22}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=2}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Clothing and gear melt}} {{Hits=24}} {{Stun=7}} {{Maneuver=-40}} {{Bleed=3}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Armor and clothing dissolve in 6 rounds}} {{Hits=26}} {{Stun=8}} {{Maneuver=-45}} {{Bleed=3}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Target screams likes he is in agonizing pain.}} {{Hits=28}} {{Stun=9}} {{Maneuver=-50}} {{Bleed=3}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Mid-section melts, dies in 6 rounds}} {{Hits=30}} {{Stun=6}} {{Bleed=4}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe smokes intensely, then dies in 3 rnds. Nothing left but a glowing puddle.}} {{Hits=32}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=4}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe is completely covered by acid. Instant death.}} {{Hits=35}} {{Instantaneous Death}}"};
                    break;
            } 
        }
        if (inputLocation >=11 && inputLocation <= 12){// chest and back
            switch(inputDamageType){
                case  "Crush":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Tickle, tickle!}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Kittens hit harder than that!}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Oouffff!}} {{Hits=4}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Are we there yet? You almost had it.}} {{Hits=6}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Hard shot causes som internal damage.}} {{Hits=8}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Hefty strike bruises ribs.}} {{Hits=10}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Strike knocks the wind out of foe.}} {{Hits=11}} {{Stun=1}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Crunch! Broken rib.}} {{Hits=13}} {{Stun=1}} {{Maneuver=-10}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=The sound of bones crunching is music to your ears.}} {{Hits=15}} {{Stun=2}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Medium wound. Solid blow knocks some of the wind out of your foe.}} {{Hits=17}} {{Stun=2}} {{Maneuver=-15}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Bone fragments cause internal damage. Foe gasps for air.}} {{Hits=19}} {{Stun=3}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Two ribs broken. Foe turns their side away from you in fear of a repeat.}} {{Hits=21}} {{Stun=3}} {{Maneuver=-20}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Blow staggers foe causing some sever internal damage.}} {{Hits=23}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Powerful blow knocks foe down.}} {{Hits=24}} {{Stun=4}} {{Maneuver=-25}} {{Bleed=1}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Several broken ribs and internal bleeding.}} {{Hits=26}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Strike breaks sternum. Foe begins to wheeze.}} {{Hits=28}} {{Stun=6}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Bone fragments sever artery. Foe dies in 6 rounds of inactive pain.}} {{Hits=30}} {{Stun=6}} {{Bleed=2}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Devastating blow crushes vital organs and drops foe. Foe dies in 3 rounds.}} {{Hits=32}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Heart crushed. Instant death.}} {{Hits=35}} {{Instantaneous Death}}"};
                    break;
                case  "Puncture":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Trying to shred his shirt?}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Embarassing.}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Whizzzzz!}} {{Hits=4}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=That was a warning shot, right?}} {{Hits=6}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=You're getting better!}} {{Hits=7}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=That will leave a scar. Looks worse than it is.}} {{Hits=9}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Small gash across the chest trickles blood.}} {{Hits=11}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Minor chest wound makes foe scream.}} {{Hits=12}} {{Stun=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Cutt across shoulder and chest.}} {{Hits=14}} {{Stun=1}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=The bones stopped the shot from going too deep.}} {{Hits=16}} {{Stun=2}} {{Maneuver=-5}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Wound causes interna bleeding. Foe gasps for air.}} {{Hits=17}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Strike destroys muscle ad tendon. You have their attention.}} {{Hits=19}} {{Stun=3}} {{Maneuver=-10}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Shot staggers foe and cuases internal bleeding.}} {{Hits=21}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Strike damages internal organs.}} {{Hits=23}} {{Stun=4}} {{Maneuver=-15}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Shot breaks the sternum. Foe starts wheezing and coughing blood.}} {{Hits=24}} {{Stun=4}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Shot pierces lung. Foe has trouble breathing.}} {{Hits=26}} {{Stun=5}} {{Maneuver=-20}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Vital organs are pierced causing severe blood loss. Foe dies in 6 rounds.}} {{Hits=28}} {{Stun=6}} {{Bleed=4}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Lungs pierced making breathing impossible. Foe dies in 3 rounds.}} {{Hits=29}} {{Stun=3}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe is impaled and dies instantly. Weapon is stuck until freed.}} {{Hits=32}} {{Instantaneous Death}}"};
                    break;
                case  "Slash":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Tickle, tickle!}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=You can do better!}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Perhaps you should sharpen your weapon.}} {{Hits=4}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Zinng!}} {{Hits=6}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=That would leave a scar is it weren't so pitiful.}} {{Hits=8}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Slash to the side.}} {{Hits=10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=The sound of flesh tearing is music to your ears.}} {{Hits=12}} {{Maneuver=-5}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Medium wound. Armor will need some repair.}} {{Hits=14}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Chest struck shattering several ribs.  Foe grabs side in pain.}} {{Hits=16}} {{Stun=1}} {{Maneuver=-10}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Nice cut! The shot was perfectly placed; it just needed to be harder.}} {{Hits=18}} {{Stun=1}} {{Maneuver=-15}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Bad cut across the chest destroys any organic armor.}} {{Hits=21}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Cut opens chest and causes internal bleeding.}} {{Hits=22}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Several broken ribs and some internal bleeding.}} {{Hits=24}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Sternum cracked}} {{Hits=26}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Strike breaks collar bone. Foe drops weapon.}} {{Hits=28}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Powerful blow send foe to the ground.}} {{Hits=30}} {{Stun=5}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Strike severs the spine just below the neck. Paralyzed from the neck down.}} {{Hits=32}} {{Bleed=3}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Slash opens the lungs and vital organs to the open air. Foe dies in 3 round}} {{Hits=34}} {{Stun=3}} {{Maneuver=-40}} {{Bleed=3}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Instant death. Slash to the chest rips organs from body.}} {{Hits=37}} {{Instantaneous Death}}"};
                    break;
                case  "Grapple":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Your attack falls short.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Not a special moment.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Small bruise.}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe recovers quickly.}} {{Hits=3}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe bounces back out of your grip.}} {{Hits=4}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Pull foe over, he breaks free. He is having trouble recovering.}} {{Hits=5}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Routine ST maneuver to break free}} {{Hits=6}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Grip foe’s side and shake him. He is disoriented.}} {{Hits=7}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Passing chest strike. Foe eludes grapple, keeps defensive stance.}} {{Hits=8}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=You get foe so tangled up he drops anything he is holding.}} {{Hits=9}} {{Stun=1}} {{Maneuver=-20}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe evades your grasp by falling to the ground. Smile at your good luck.}} {{Hits=10}} {{Stun=1}} {{Maneuver=-25}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe thrown 5’ in a random direction.}} {{Hits=11}} {{Stun=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Grab foe in a full nelson around the chest.}} {{Hits=12}} {{Stun=2}} {{Maneuver=-30}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Your skill shines through as foe is entangled. Hard Strength maneuver for foe to break free.}} {{Hits=13}} {{Stun=3}} {{Maneuver=-35}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Elbow to the chest knocks the wind out of the foe and stuns him for a short time.}} {{Hits=14}} {{Stun=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=You send foe flying in a spin to land 5’ away. His hip is broken.}} {{Hits=15}} {{Stun=4}} {{Maneuver=-40}} {{Bleed=1}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Ride foe down to the ground. Organs crushed and foe dies in 6 rnds.}} {{Hits=16}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=1}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Is it supposed to bend in that direction? Foe dies in 3 rnds.}} {{Hits=17}} {{Stun=3}} {{Bleed=2}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Bear hug crushes ribs, heart bursts, death}} {{Hits=18}} {{Instantaneous Death}}"};
                    break;
                case  "Heat":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe evades the flames.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Flames surround foe.}} {{Hits=3}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Oouffff!}} {{Hits=5}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe is enshrouded by smoke.}} {{Hits=7}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Strong heat gives a light burn to the chest}} {{Hits=9}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe’s garments smolder from assault.}} {{Hits=11}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Equipment crackles as it burns and falls clear.}} {{Hits=13}} {{Stun=1}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=The wound is grave and infection will follow.}} {{Hits=15}} {{Stun=2}} {{Maneuver=-10}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Flames send him stumbling back 5’.}} {{Hits=17}} {{Stun=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Heat blast burns garments and clothing.}} {{Hits=20}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Chest and arm have serious burns. If he has a shield, it is destroyed.}} {{Hits=22}} {{Stun=5}} {{Maneuver=-20}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Organic chest armor destroyed and engulfs any wood on foe.}} {{Hits=24}} {{Stun=5}} {{Maneuver=-25}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Chest armor is destroyed from the blast. Foe has severe burns on the neck.}} {{Hits=26}} {{Stun=6}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Downed, chest armor destroyed}} {{Hits=28}} {{Stun=6}} {{Maneuver=-30}} {{Bleed=3}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=garments and armor fused to skin}} {{Hits=30}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe’s side is ignited by your strike and the wounds are deep.}} {{Hits=32}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=4}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Flames turn him into a torch. He runs a short distance, then dies in 6 rnds.}} {{Hits=35}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=4}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Blast lands on foe’s chest Foe dies in 3 painful rnds of screaming. Foe is inactive}} {{Hits=37}} {{Stun=3}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Flames assault upper body. Major organs burned to ashes. Instant death.}} {{Hits=40}} {{Instantaneous Death}}"};
                    break;  
                case  "Cold":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Bitter arctic wind.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Encrust foe with ice.}} {{Hits=2}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe is covered by the blast. All extremities are damaged.}} {{Hits=4}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Scatter your attack all over foe’s chest.}} {{Hits=6}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Strike freezes on an exposed area.}} {{Hits=8}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Frigid strike to foe’s chest and face}} {{Hits=10}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Burst of cold hurls him to the ground hard.}} {{Hits=12}} {{Stun=1}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Cold penetrates foe’s chest.}} {{Hits=14}} {{Stun=2}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe turns and exposes his back. All organic items on his back become frozen.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Blast hits foe’s chest and scatters. The cold stings all exposed skin.}} {{Hits=18}} {{Stun=4}} {{Maneuver=-20}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Polar wind pierces deep into chest. Foe faces the wrong way.}} {{Hits=20}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Blast freeze-dries organic material on foe’s back.}} {{Hits=22}} {{Stun=5}} {{Maneuver=-25}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Bitter cold freezes tissue and garments. Foe’s body temperature drops.}} {{Hits=24}} {{Stun=6}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Chest strike sends foe over hard.}} {{Hits=26}} {{Stun=6}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe feels the bitter hand of death slowly closing in on him.}} {{Hits=19}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Hypothermia is the least of foe’s worries.}} {{Hits=30}} {{Stun=7}} {{Maneuver=-40}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe’s heart and lungs are frozen by your arctic blast. Foe is finished in 6 rnds.}} {{Hits=32}} {{Stun=6}} {{Bleed=4}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe dies in 3 rnds from the block of ice that has formed around him.}} {{Hits=34}} {{Stun=3}} {{Maneuver=-15}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Body frozen completely, if knocked over it will shatter. Instant death.}} {{Hits=37}} {{Stun=9}} {{Maneuver=-50}} {{Bleed=5}} {{Instantaneous Death}}"};
                    break;
                case  "Electrical":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe avoids blast.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Lots of sparks and smoke.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=The thunderous crack of your attack panics foe.}} {{Hits=5}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Boom! Foe’s skeleton crackles with the impact.}} {{Hits=8}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Electrical energy chases around foe’s body.}} {{Hits=10}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Clothes smoke, then burn. Foe flails his arms.}} {{Hits=12}} {{Stun=1}} {{Maneuver=-10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe’s equipment is infested by the blast.}} {{Hits=15}} {{Stun=2}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Entangle foe in deadly blue light.}} {{Hits=17}} {{Stun=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Direct hit illuminates foe. Some energy remains for an instant.}} {{Hits=19}} {{Stun=4}} {{Maneuver=-20}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Disrupt the beating of foe’s heart for a moment. Reflexes strain muscles.}} {{Hits=22}} {{Stun=5}} {{Maneuver=-25}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe’s heart stops for an instant, then starts beating again.}} {{Hits=24}} {{Stun=5}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe smells own hair burning. Organic armor destroyed.}} {{Hits=26}} {{Stun=6}} {{Maneuver=-30}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe loses consciousness temporarily. His convulsions keep him standing for 1 rnd.}} {{Hits=29}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Chest blast. Organic armor is destroyed. Metal armor is scalding hot.}} {{Hits=31}} {{Stun=7}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Strike savages foe. Foe’s convulsions resemble a dance.}} {{Hits=34}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Web of incandescent energy engulfs foe as he writhes in agony.}} {{Hits=36}} {{Stun=8}} {{Maneuver=-45}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Metal on foe fuses to his body, damaging nerves. Foe dies in 6 rnds.}} {{Hits=38}} {{Stun=6}} {{Bleed=3}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Blast envelopes foe in coruscating energies. Foe dies in 3 rnds.}} {{Hits=41}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Electrify foe’s body. Muscles & tendons tear in convulsions. Extra crispy dead guy. Instant death.}} {{Hits=45}} {{Instantaneous Death}}"};
                    break;
                case  "Impact":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Very little force.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe is unbalanced.}} {{Hits=2}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe starts stepping away from the assault.}} {{Hits=4}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe is knocked down. He drops his weapon.}} {{Hits=6}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Blast knocks foe down.}} {{Hits=8}} {{Maneuver=-5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe is shaken and steps back 5’.}} {{Hits=10}} {{Stun=1}} {{Maneuver=-10}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Blow almost sends foe down.}} {{Hits=11}} {{Stun=2}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Strike to chest is not hard but it is well placed. Foe steps back 5’.}} {{Hits=13}} {{Stun=3}} {{Maneuver=-15}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Boom! Foe is hammered by an effective strike to his back.}} {{Hits=15}} {{Stun=4}} {{Maneuver=-20}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Blow crashes into foe’s chest.}} {{Hits=17}} {{Stun=5}} {{Maneuver=-25}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe is knocked down. Chest armor is destroyed. Ribs are broken.}} {{Hits=19}} {{Stun=6}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe’s evasion attempt exposes back and side.}} {{Hits=21}} {{Stun=6}} {{Maneuver=-30}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Two ribs protrude from his side. Foe now respects your abilities.}} {{Hits=23}} {{Stun=7}} {{Maneuver=-35}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=A piece of solid equipment is jammed into foe’s chest.}} {{Hits=24}} {{Stun=7}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Savage impact ruptures internal organs. Medic! Medic!}} {{Hits=26}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Concussion bruises skin and batters ribs}} {{Hits=28}} {{Stun=8}} {{Maneuver=-45}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=His rib cage is fractured. Foe dies in 6 rnds from internal bleeding.}} {{Hits=30}} {{Stun=6}} {{Bleed=1}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Chest caved in from the blast. Foe dies in 3 rnds from internal bleeding.}} {{Hits=32}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Crush foe’s lungs and heart. Foe dies instantly.}} {{Hits=35}} {{Stun=10}} {{Maneuver=-55}} {{Bleed=2}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsStrikes":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Nice form.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe avoids your attack.}} {{Hits=2}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Glancing strike makes foe respect you.}} {{Hits=3}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Your strike unbalances foe.}} {{Hits=4}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Blow to shoulder.}} {{Hits=6}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Kick foe’s side. He stumbles out of the way.}} {{Hits=7}} {{Maneuver=-5}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=A solid punch. Foe is rattled a little.}} {{Hits=8}} {{Maneuver=-10}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=He can see your next strike coming.}} {{Hits=9}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Chest strike. Foe makes a strange noise but blocks and recovers.}} {{Hits=11}} {{Stun=1}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Your strike is light and fast. Bruise foe’s chest.}} {{Hits=12}} {{Stun=2}} {{Maneuver=-20}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Blow to chest. Use your forehead in a brutal way to subdue foe.}} {{Hits=13}} {{Stun=2}} {{Maneuver=-25}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe falls forward onto one knee in front of you.}} {{Hits=14}} {{Stun=3}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Solid chest strike. The impact confuses foe greatly. His ribs are fractured.}} {{Hits=14}} {{Stun=3}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Distract foe with a feint and then hammer him in chest.}} {{Hits=17}} {{Stun=4}} {{Maneuver=-35}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Roundhouse kick knocks foe out and fractures collarbone.}} {{Hits=18}} {{Stun=5}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Spear hand strike to chest. Elbow shot to foe’s side.}} {{Hits=20}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Flying kick to foe’s back.}} {{Hits=21}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Back strike severs spine then kills foe in 3 painful agonizing rounds.}} {{Hits=22}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Heel strike to foe’s sternum crushes ribcage. Foe dies instantly.}} {{Hits=24}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsSweeps":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=You forget your moves.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=It looks like you’re sparring.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe evades your assault.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Your attack causes foe to strike himself lightly}} {{Hits=3}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Sweep almost takes foe off his feet. He drops down on one knee.}} {{Hits=4}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe’s feet come out from under him. He recovers.}} {{Hits=5}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Sweep nearly knocks foe down.}} {{Hits=6}} {{Stun=1}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Sweep strikes foe’s calf. Foe does not fall, but the bruise is heavy.}} {{Hits=7}} {{Stun=1}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Strong throw. Foe is left a second behind you and confused.}} {{Hits=8}} {{Stun=2}} {{Maneuver=-5}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=You impress foe with your prowess by knocking him to the ground.}} {{Hits=9}} {{Stun=3}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Perfect throw lands him however you want him to, within 10’.}} {{Hits=10}} {{Stun=4}} {{Maneuver=-10}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=You attempt a throw. Foe avoids your main attack, but you steal his weapon.}} {{Hits=11}} {{Stun=5}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Well-done throw knocks foe out for 1 rnd. Foe has wind knocked out of him.}} {{Hits=12}} {{Stun=6}} {{Maneuver=-15}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe lands on his back. He rolls over and stands up.}} {{Hits=13}} {{Stun=6}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe lands on his back. Back broken. Foe is paralyzed.}} {{Hits=14}} {{Stun=7}} {{Maneuver=-20}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=You send foe over backwards. He stumbles 10’.}} {{Hits=15}} {{Stun=7}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Throw sends foe flying 10’ away.}} {{Hits=16}} {{Stun=8}} {{Maneuver=-25}} {{Bleed=1}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Throw breaks ribs which penetrate the lungs.}} {{Hits=17}} {{Stun=8}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=A brutal grapple from below breaks foe’s back. He is paralyzed.}} {{Hits=18}} {{Stun=9}} {{Maneuver=-35}} {{Bleed=2}}"};
                    break;
                case  "Large":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Tickle, tickle! You break your weapon.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Kittens hit harder.}} {{Hits=2}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Shot looked good, but that’s about it.}} {{Hits=4}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Oouffff!}} {{Hits=5}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Are you just being polite?}} {{Hits=7}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Are we there yet?}} {{Hits=9}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Nice shot to the sternum/spine.}} {{Hits=10}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Hard shot causes some internal damage.}} {{Hits=12}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Hefty strike bruises ribs.}} {{Hits=14}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Strike to the side knocks the wind out of the foe and damages tissue.}} {{Hits=15}} {{Maneuver=-5}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Your blow convinces foe you may be small but you demand respect.}} {{Hits=17}} {{Maneuver=-10}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Minor chest/back wound.}} {{Hits=19}} {{Stun=1}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Crunch! Broken ribs and internal damage.}} {{Hits=20}} {{Stun=1}} {{Maneuver=-20}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Ribs and sternum broken.}} {{Hits=22}} {{Stun=1}} {{Maneuver=-20}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Precision strike causes massive internal damage and pain.}} {{Hits=24}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=2}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Blow breaks several ribs and skin.}} {{Hits=25}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Liver and kidneys destroyed causing massive hemorrhage.}} {{Hits=27}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Blow to chest destroys major organs. Foe dies after 3 painful, inactive rnds.}} {{Hits=29}} {{Stun=3}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Crushing blow staggers foe and sends bone through a major artery. Instant death.}} {{Hits=31}} {{Instantaneous Death}}"};
                    break;
                case  "Huge":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Roll a fumble for yourself.Weapon breaks.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Glancing blow bounces across beast’s hide.}} {{Hits=2}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Solid, but nowhere near a vital spot.}} {{Hits=3}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=You make this strike land well.}} {{Hits=4}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Hard glancing strike crosses foe’s chest.}} {{Hits=5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Blow to back.}} {{Hits=6}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=The recoil of your strike to foes chest sends you stumbling back.}} {{Hits=8}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Back strike. Weapon seems to damage by touch only.}} {{Hits=9}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=You strike the fell titan in the chest.}} {{Hits=10}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Blow to foe’s back. Foe’s hide is tough there. You need more strength.}} {{Hits=11}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=You came close to piercing the heart. Try again!}} {{Hits=12}} {{Maneuver=-5}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Wound foe along his side with an excellent strike.}} {{Hits=13}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=He is stunned and has difficulty maneuvering.}} {{Hits=15}} {{Stun=1}} {{Maneuver=-10}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=When your strike lands on foes back, bones crackle and pop.}} {{Hits=16}} {{Stun=1}} {{Maneuver=-10}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Surprise! You found a vital spot!}} {{Hits=17}} {{Stun=1}} {{Maneuver=-15}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Messy strike leaves you covered in blood.}} {{Hits=18}} {{Stun=2}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=6 broken ribs}} {{Hits=19}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Strike breaks bone and damages vital organs. Foe dies in 3 rnds.}} {{Hits=21}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Awe-inspiring strike drives bone through both lungs. Instant death.}} {{Hits=22}} {{Instantaneous Death}}"};
                    break;
                case  "Acid":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Attack barely hits them.}} {{Hits=1}}"};
        			if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe must have acid repellant on!}} {{Hits=3}}"};
        			if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe is completely surrounded by acid.}} {{Hits=5}}"};
        			if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe disoriented from the attack and recoils!}} {{Hits=8}} {{Maneuver=-5}}"};
        			if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Good attack causes foe to stagger.}} {{Hits=10}} {{Maneuver=-10}}"};
        			if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=A wave of acid washes over foe.}} {{Hits=12}} {{Stun=1}}"};
        			if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe is surprised by the pain from your attack.}} {{Hits=15}} {{Stun=1}} {{Maneuver=-15}}"};
        			if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Chest armor damaged}} {{Hits=17}} {{Stun=2}} {{Maneuver=-20}}"};
        			if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Good attack. Armor bypassed and skin burned.}} {{Hits=19}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=1}}"};
        			if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Foe staggers to get clear of the attack!}} {{Hits=22}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=1}}"};
        			if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=The acid seems to cling to foe, making him smoke for a while.}} {{Hits=24}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=1}}"};
        			if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Target loses a large patch of skin and flesh underneath.}} {{Hits=26}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=2}}"};
        			if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Target is in extreme pain as his flesh melts.}} {{Hits=29}} {{Stun=4}} {{Maneuver=-35}} {{Bleed=2}}"};
        			if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Chest covering destroyed}} {{Hits=31}} {{Stun=5}} {{Maneuver=-40}} {{Bleed=2}}"};
        			if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Chest armor and clothing destroyed. Foe burned very badly.}} {{Hits=34}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=3}}"};
        			if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Blast grabs foe around the chest. Armor is destroyed.}} {{Hits=36}} {{Stun=7}} {{Maneuver=-45}} {{Bleed=3}}"};
        			if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Targets’ flesh melts and sloughs off in large chunks. They die in 6 agonizing rounds.}} {{Hits=38}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=3}} {{Death in 6 rounds}}"};
        			if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Target is surrounded by acrid smoke as thier flesh melts. Foe dies in 3 rnds.}} {{Hits=41}} {{Stun=39}} {{Maneuver=-55}} {{Bleed=4}} {{Death in 3 rounds}}"};
        			if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Internal organs are melted and blood evaporates. Instant death.}} {{Hits=45}} {{Instantaneous Death}}"};
                    break;
            }
        }
        if (inputLocation >=13 && inputLocation <= 18){ // arms
            switch(inputDamageType){
                case  "Crush":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Nice bruise.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Strike to the upper arm.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Pow!}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=It's harder than it looks, huh? Concentrate.}} {{Hits=3}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Bruise to the hand makes foe almost drop weapon.}} {{Hits=4}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Strike to the hand breaks a finger.}} {{Hits=5}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Strike causes to to drop whatever they are holding.}} {{Hits=6}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Thud! Foe drops whatever is in their hand.}} {{Hits=7}} {{Stun=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Upper arm wound. Blow across the bicep leaves a mark.}} {{Hits=8}} {{Stun=1}} {{Maneuver=-15}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Elbow damaged making arm use difficult.}} {{Hits=9}} {{Stun=2}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Broken fingers, drops what is in hands}} {{Hits=10}} {{Stun=2}} {{Maneuver=-20}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Arm Broken. Use of arm is lost}} {{Hits=11}} {{Stun=3}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Arm Useless for 1 rnd, does not drop weapon}} {{Hits=12}} {{Stun=3}} {{Maneuver=-25}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Arm shattered, loses use of arm}} {{Hits=13}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Arm broken. Loss of use.}} {{Hits=14}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=1}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=broken hand, loss of use}} {{Hits=15}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm broken, loss of use}} {{Hits=16}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=2}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Arm crushed, almost torn from body, loss of use}} {{Hits=17}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Arm torn off, Instant death}} {{Hits=19}} {{Instantaneous Death}}"};
                    break;
                case  "Puncture":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Small cut on back of hand.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Light shot to upper arm.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Ouch!}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Badly aimed shot to the upper arm.}} {{Hits=3}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=It would be easier if they would stop moving.}} {{Hits=4}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Good shot makes foe almost drop weapon.}} {{Hits=5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Shot to hand causes foe to drop weapon.}} {{Hits=6}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Minor arm wound. It could get infected!}} {{Hits=7}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Forearm wound. Foe drops weapon.}} {{Hits=8}} {{Stun=1}} {{Maneuver=-5}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Moderate upper arm hit. Garment is opened.}} {{Hits=9}} {{Stun=1}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Shot breaks fingers. Foe drops all held items.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-10}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Shot shatters bone in upper arm. Foe winces from the pain.}} {{Hits=10}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Shot strikes shoulder. Arm useles for one round.}} {{Hits=11}} {{Stun=3}} {{Maneuver=-15}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Shot pierces elbow. Will be painful to remove!}} {{Hits=12}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Shot breaks bones in the upper arm.}} {{Hits=13}} {{Stun=4}} {{Maneuver=-25}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Hand crushed, for dorps anything in hand}} {{Hits=14}} {{Stun=4}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm is broken and useless.}} {{Hits=15}} {{Stun=5}} {{Maneuver=-25}} {{Bleed=3}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Shot pierces arm and side. Foe dies in 3 rounds from internal wounds.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Shot through hand and into chest pierces heart. Instant death!}} {{Hits=18}} {{Instantaneous Death}}"};
                    break;
                case  "Slash":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Nice bruise.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Light strike to the upper arm.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Grazing strike to the lower arm.}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Slice!}} {{Hits=3}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Sash to the hand makes foe almost drop weapon.}} {{Hits=4}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Slash to the hand causes foe to drop weapon.}} {{Hits=6}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Moderate upper arm wound.}} {{Hits=7}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Elbow joint damaged. Foe winces from the pain.}} {{Hits=8}} {{Maneuver=-10}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Slash cuts off 1-5 fingers. Foe drop whatever was held in hand.}} {{Hits=9}} {{Maneuver=-15}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Vicious slash to the forearm causes foe to drop anything in hand.}} {{Hits=10}} {{Stun=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Arm broken below shoulder. Foe cannot hold anything in hand.}} {{Hits=11}} {{Stun=1}} {{Maneuver=-20}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Arm is slashed.}} {{Hits=12}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Broken hand, foe can use weapon but not effectively}} {{Hits=13}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Hand is broken. Foe drops items in hand}} {{Hits=14}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Upper arm strike. Broken bone and bleeding result.}} {{Hits=15}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Arm is slashed damaging muscles and bone.}} {{Hits=17}} {{Stun=4}} {{Maneuver=-35}} {{Bleed=2}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm issevered. Foe falls to ground and dies in 6 rounds.}} {{Hits=18}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=3}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Artery slashed, you are sprayed with blood}} {{Hits=19}} {{Stun=3}} {{Maneuver=-45}} {{Bleed=3}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Arm severed. Foe dies instantly from pain and blood loss.}} {{Hits=21}} {{Instantaneous Death}}"};
                    break;
                case  "Grapple":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe frees himselg}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Almost get a grip on on arm}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=You grip foe’s shield arm.}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=No shield: pin arm for 6rnds}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Grip foes hand}} {{Hits=2}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Grip Arm}} {{Hits=3}} {{Maneuver=-10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Disarmed. Still have hold. Routine St maneuver to break}} {{Hits=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Grab foes arm, foe disarmed}} {{Hits=4}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Pin arm. w/shield: you pull down shield, No shield: arm immobilized.}} {{Hits=4}} {{Maneuver=-15}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Entangle arm. Your grip makes it impossible for foe to use his shield.}} {{Hits=5}} {{Maneuver=-25}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Entangle foe’s arm. Foe hangs onto his weapon, but arm is immobilized.}} {{Hits=5}} {{Stun=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Entangle foe’s arm. His weapon is held immobile.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-30}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Grip foes arm, disarmed}} {{Hits=6}} {{Stun=2}} {{Maneuver=-35}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=You almost disarm foe and trip him. Hard Strength maneuver for foe to break free.}} {{Hits=7}} {{Stun=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Tie up both of foe’s arms. He drops anything he is holding and cannot attack next round.}} {{Hits=7}} {{Stun=3}} {{Maneuver=-40}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=You find yourself on foe’s shield side with a vicious arm lock.}} {{Hits=8}} {{Stun=3}} {{Maneuver=-45}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm is painfully immobilized. Foe is thinking about surrender.}} {{Hits=8}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Arm broken sending splinters through arteries. Foe dies in 3 rnds.}} {{Hits=9}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=1}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Arm torn off. Instant death.}} {{Hits=10}} {{Instantaneous Death}}"};
                    break;
                case  "Heat":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Attack boils nearby water.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Singe foe’s exposed skin.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Zing!}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe simmers in his clothes.}} {{Hits=4}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Blast stings foe’s hands and arms.}} {{Hits=5}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe’s arm swathed in fire. Shield combusts.}} {{Hits=6}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Strike burns arm and clothing.}} {{Hits=7}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Blaze consumes garments.}} {{Hits=8}} {{Stun=1}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Any organic armor is destroyed.}} {{Hits=7}} {{Stun=2}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Moderate burns.}} {{Hits=11}} {{Stun=3}} {{Maneuver=-20}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=He makes a supreme effort to pull his arm away.}} {{Hits=12}} {{Stun=4}} {{Maneuver=-25}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Wooden items are destroyed, metal too hot to hold.}} {{Hits=13}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Blast burns foe’s arm and continues up to the neck.}} {{Hits=14}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=If foe has a shield it is on fire}} {{Hits=15}} {{Stun=6}} {{Maneuver=-35}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Arm is severly burned}} {{Hits=17}} {{Stun=6}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe’s arm is a conflagration. Hand and arm are useless.}} {{Hits=18}} {{Stun=7}} {{Maneuver=-40}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm and lower side burned to ashes. Foe dies from the shock in 6 rnds.}} {{Hits=19}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=4}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe’s hand burned away without mercy. Hand is useless. Foe dies in 3 rnds from the shock.}} "};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Intense heat fuses metal, cloth and skin. Instant death.}} {{Hits=22}} {{Instantaneous Death}}"};
                    break;  
                case  "Cold":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Poorly directed.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe dodges your attack without too much effort.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe shields himself. Your attack misses most of its mark.}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Strike slams into foe’s arm.}} {{Hits=3}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe’s hand frozen shut for 1 rnd.}} {{Hits=4}} {{Maneuver=-5}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Mild frostbite.}} {{Hits=6}} {{Maneuver=-10}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Any leather & cloth in the hit location freezes and shatters.}} {{Hits=7}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe is unable to protect himself.}} {{Hits=8}} {{Stun=1}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Skin and nerve damage causes foe pain.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-20}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Your blast engulfs foe’s arm and climbs toward his torso}} {{Hits=10}} {{Stun=3}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=If he has no shield, his arm is useless for 10 rnds from the bitter cold.}} {{Hits=11}} {{Stun=4}} {{Maneuver=-25}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Freeze foe’s arm. It is useless until it is warmed up. (5 rnds).}} {{Hits=12}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Bitter arctic blast spreads up his arm. If he has a shield, it is destroyed.}} {{Hits=13}} {{Stun=5}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=The hand is frozen closed holding anything in hand.}} {{Hits=14}} {{Stun=6}} {{Maneuver=-35}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Blast freezes the arm to the body still holding its weapon.}} {{Hits=15}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Any metal armor freezes in position.}} {{Hits=17}} {{Stun=7}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Blast freezes weapon hand and shoulder. Foe dies in 6 rnds of agony.}} {{Hits=18}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=3}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Arm frozen to the body. Foe dies in 3 rnds from shock and loss of heat.}} {{Hits=19}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=4}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=The blood in foe’s extremities is frozen. Instant death.}} {{Hits=21}} {{Stun=8}} {{Maneuver=-50}} {{Bleed=4}} {{Instantaneous Death}}"};
                    break;
                case  "Electrical":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Energy dissipates.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Mild jolt.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Blast grounds into foe’s arm.}} {{Hits=3}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Strike connects with foe’s arm.}} {{Hits=4}} {{Maneuver=-5}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe’s side and back are singed.}} {{Hits=5}} {{Maneuver=-10}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Strike slams into foe’s arm.}} {{Hits=7}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Blast to foe’s shoulder. Foe’s arm ignites.}} {{Hits=8}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Blast climbs up foe’s arm, sending him back 5’.}} {{Hits=9}} {{Stun=2}} {{Maneuver=-20}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Any metal armor on arm is fused, pinning foe’s arm}} {{Hits=11}} {{Stun=3}} {{Maneuver=-25}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Strike lands on arm and streaks up shoulder. Foe steps backward.}} {{Hits=12}} {{Stun=4}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Electrify foe’s arm.}} {{Hits=13}} {{Stun=5}} {{Maneuver=-30}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=His arm and any shield are on fire. Metal is fused.}} {{Hits=14}} {{Stun=5}} {{Maneuver=-35}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Nerves in foe’s elbow are damaged; arm is useless. He drops his weapon on his foot.}} {{Hits=16}} {{Stun=6}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Hand an arm are useless, skin muscles and nerves damaged}} {{Hits=17}} {{Stun=7}} {{Maneuver=-40}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Blast spreads up the arm and to the neck. Severe burns.}} {{Hits=18}} {{Stun=7}} {{Maneuver=-45}} {{Bleed=2}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Bright flash illuminates foe and jolts every muscle in his body.}} {{Hits=20}} {{Stun=8}} {{Maneuver=-50}} {{Bleed=3}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info= Nerve damage, shock, and a broken arm spell death in 6 rnds.}} {{Hits=21}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=3}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Blast turns the arm and shoulder into a lightning rod. Foe dies in 3 rnds.}} {{Hits=22}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=3}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info= Strike seeks out the shoulder and then his spine. Instant death.}} {{Hits=25}} {{Instantaneous Death}}"};
                    break;
                case  "Impact":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Bruise his elbow.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe can only manage some wild swings}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Wild assault to shoulder falls to connect with foe.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Any shield is destroyed; arm is bruised.}} {{Hits=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Hammer foe in shoulder.}} {{Hits=4}} {{Maneuver=-10}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Arm is slammed into his chest; weapon dropped.}} {{Hits=5}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe’s arm is roughed up. Foe puts his guard up.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=The strike slams his arm into his side and pins it for the moment.}} {{Hits=7}} {{Stun=2}} {{Maneuver=-20}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Well-placed strike slams into foe’s arm.}} {{Hits=8}} {{Stun=3}} {{Maneuver=-25}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Fingers are broken in the impact.}} {{Hits=9}} {{Stun=4}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Solid strike to shoulder numbs foe’s senses and bruises muscles.}} {{Hits=10}} {{Stun=5}} {{Maneuver=-30}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Strike lands hard against foe’s shield side. He almost loses his footing.}} {{Hits=11}} {{Stun=6}} {{Maneuver=-35}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Crashing blow to foe’s shoulder sends him over.}} {{Hits=12}} {{Stun=6}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Blast breaks shield arm. He falls on his arm and breaks his wrist.}} {{Hits=13}} {{Stun=7}} {{Maneuver=-40}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Strike breaks his shoulder and collar-bone. One arm is useless.}} {{Hits=14}} {{Stun=7}} {{Maneuver=-45}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Lay waste to foe’s arm. Shield is destroyed by impact.}} {{Hits=15}} {{Stun=8}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Bones are broken by the concussion. Foe goes into shock, and dies in 6 rnds.}} {{Hits=16}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=1}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Fold up foe’s arm and snap it like a twig. Foe dies in 3 rnds from shock.}} {{Hits=17}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=1}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=The shoulder blade contacts foe’s spine. Foe is paralyzed then dies.}} {{Hits=19}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsStrikes":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Fancy, but little damage.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Your master would be upset.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Poorly aimed strike forces foe to defend himself.}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Good shot!}} {{Hits=2}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Wheel kick sends foe 10’ in a desired direction.}} {{Hits=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Wheel kick knocks foe flat.}} {{Hits=4}} {{Maneuver=-10}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=You take an open shot to foe’s side.}} {{Hits=4}} {{Maneuver=-15}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Shoulder strike. Foe is badly unbalanced}} {{Hits=5}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Knife hand strike breaks foe’s arm, leaving it useless.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-25}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Strong knife hand to upper arm, breaking it.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-25}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=You turn a block into a strike to foe’s arm. Foe is disarmed. Strike damages cartilage.}} {{Hits=7}} {{Stun=2}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Hammer foe’s arm as it passes near you. The bruise is deep.}} {{Hits=8}} {{Stun=2}} {{Maneuver=-30}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Firm flat palm strike to foe’s upper arm. Bone broken. It hurts him to raise his arm.}} {{Hits=9}} {{Stun=3}} {{Maneuver=-35}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Dislocate the arm and then break it.}} {{Hits=9}} {{Stun=4}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Strike to foe’s elbow shatters joint. Foe drops anything in hand.}} {{Hits=10}} {{Stun=4}} {{Maneuver=-40}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=If foe has a shield, it is broken. If foe has no shield, his arm is broken.}} {{Hits=11}} {{Stun=5}} {{Maneuver=-45}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm lock breaks upper arm then the neck. Dies in 6 rnds.}} {{Hits=11}} {{Stun=6}} {{Bleed=1}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Kick breaks arm and drives rib into heart. Foe dies in 3 rnds.}} {{Hits=12}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=You disarm foe & use his weapon to kill him. Foe instantly dies.}} {{Hits=13}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsSweeps":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=It looked…interesting.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Your attack is little more than a clumsy grip.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Your attack is deflected.}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Throw dislocates foe’s shoulder.}} {{Hits=2}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe breaks his fall with his hand. He sprains two fingers when landing.}} {{Hits=2}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Base your grip on a garment that tears off.}} {{Hits=3}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=You grip foe’s arm, pulling and twisting it.}} {{Hits=3}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Your sweep results in an attempt at throwing foe’s arm. He is disarmed.}} {{Hits=4}} {{Stun=1}} {{Maneuver=-5}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=You almost disarm foe. He bends down to recover his weapon.}} {{Hits=4}} {{Stun=1}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Excellent throw sends foe falling on his arm. He is disarmed.}} {{Hits=5}} {{Stun=2}} {{Maneuver=-10}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Nifty throw. You have foe pinned, on his face, and in an arm lock.}} {{Hits=5}} {{Stun=3}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe falls on his side. If he has a shield, it is broken.}} {{Hits=6}} {{Stun=4}} {{Maneuver=-15}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=You throw foe down on his shoulder. Break collar bone and arm.}} {{Hits=6}} {{Stun=5}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=You knock foe over and ride him down.}} {{Hits=7}} {{Stun=6}} {{Maneuver=-20}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=You immobilize him in an arm lock. Arm broken and useless.}} {{Hits=7}} {{Stun=6}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe lands on arm. Shield and arm are broken and useless.}} {{Hits=8}} {{Stun=7}} {{Maneuver=-25}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Sly, rolling throw sends foe into air. Arm broken and useless.}} {{Hits=8}} {{Stun=7}} {{Maneuver=-30}} {{Bleed=1}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Fall breaks arm and cuts off circulation}} {{Hits=9}} {{Stun=8}} {{Maneuver=-35}} {{Bleed=1}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=With one throw, you disarm foe, knock him out, and break his back.}} {{Hits=10}} {{Stun=8}} {{Maneuver=-35}} {{Bleed=2}}"};
                    break;
                case  "Large":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Nice bruise. Weapon is broken on impact. 1H}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Light strike.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Grazing strike to the lower arm.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Pow!}} {{Hits=3}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Sloppy shot to the elbow.}} {{Hits=4}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=It’s harder than it looks, huh?}} {{Hits=5}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Well-placed shot in the armpit.}} {{Hits=6}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Good shot to the hand makes foe drop weapon.}} {{Hits=6}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Hard strike to the hand breaks a finger.}} {{Hits=7}} {{Maneuver=-5}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Painful strike causes him to drop whatever they are holding.}} {{Hits=8}} {{Maneuver=-10}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Hit to upper arm bruises muscle and bone.}} {{Hits=9}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Minor arm wound.}} {{Hits=10}} {{Maneuver=-15}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Thud! Arm broken and hand sprained.}} {{Hits=11}} {{Stun=1}} {{Maneuver=-20}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Moderate upper arm wound.}} {{Hits=12}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Arm broken. Foe drops his weapon.}} {{Hits=13}} {{Stun=1}} {{Maneuver=-25}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Crushing blow breaks the hand making it useless.}} {{Hits=14}} {{Stun=2}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Shot goes through the arm and into the torso.}} {{Hits=15}} {{Stun=2}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Arm cut off at the elbow. Foe dies in 3 rnds from the shock and blood loss.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Blow cuts off both arms by traveling through the chest. Instant death.}} {{Hits=17}} {{Instantaneous Death}}"};
                    break;
                case  "Huge":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Weapon is knocked from your hand, then breaks.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Blow to foe’s upper arm. Get it together.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Your attack lands poorly.}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Blow to foe’s arm. Ready for a better strike.}} {{Hits=2}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Two light and quick shots to foe’s forearm.}} {{Hits=3}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=The beast used its forearm for defense.}} {{Hits=3}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Your blow lands against foe’s shoulder.}} {{Hits=4}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Brutal strike to foe's forearm.}} {{Hits=5}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Blow to foe’s elbow joint lands poorly.}} {{Hits=5}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=A little bird shows you the flaw in foe’s defense. Your strike plunges deep.}} {{Hits=6}} {{Maneuver=-5}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=You are able to cut foe and make them scream.}} {{Hits=7}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Strike lands on foe’s horn. The vibration has some effect.}} {{Hits=7}} {{Maneuver=-10}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=They are insulted by the blow, but not hurt badly.}} {{Hits=8}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=You step under foe’s lunge and use the force against him.}} {{Hits=9}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Nice blow to arm opens a deep wound and causes some bleeding.}} {{Hits=9}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Violent strike to foe’s forearm.}} {{Hits=10}} {{Stun=1}} {{Maneuver=-20}} {{Bleed=1}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm is shattered.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=1}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Arm severed at shoulder, death in 3 rounds.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-25}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Sever arm and torso. Instant death.}} {{Hits=12}} {{Instantaneous Death}}"};
                    break;
                case  "Acid":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Fizzle.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe is singed by the acid.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe is shaken by the force of your attack.}} {{Hits=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe cannot evade.}} {{Hits=4}} {{Maneuver=-10}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe’s arm smokes for a moment.}} {{Hits=5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe’s shield is damaged from the attack.}} {{Hits=7}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe dodges most of the attack, but not all of it.}} {{Hits=8}} {{Stun=1}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Jarring pain rips across target’s arm.}} {{Hits=9}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=He falls forward, but keeps hold of his weapon.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-25}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Target is staggered from the sudden pain.}} {{Hits=12}} {{Stun=2}} {{Maneuver=-30}} {{Bleed=1}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Focused attack melts foe’s arm armor. Armor is now gone.}} {{Hits=13}} {{Stun=3}} {{Bleed=1}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe moves to the side, but the attack hits him anyway}} {{Hits=14}} {{Stun=3}} {{Maneuver=-35}} {{Bleed=1}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe cannot evade the strike. Armor and clothing is dissolved completely.}} {{Hits=16}} {{Stun=4}} {{Maneuver=-40}} {{Bleed=2}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Armor and skin melts.}} {{Hits=17}} {{Stun=4}} {{Maneuver=-40}} {{Bleed=2}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe’s arm and shoulder armor and clothing destroyed.}} {{Hits=18}} {{Stun=5}} {{Maneuver=-45}} {{Bleed=2}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Forceful attack knocks foe down.}} {{Hits=20}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=3}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm melted away. Shock causes foe to die in 6 rnds of pain and agony.}} {{Hits=21}} {{Stun=6}} {{Bleed=3}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Arm and shoulder dissolved. Foe dies in 3 rnds from the shock.}} {{Hits=22}} {{Stun=3}} {{Maneuver=-55}} {{Bleed=3}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=The attack melts away clothing and skin. Foe falls into a coma for d10 weeks, then dies.}} {{Hits=25}} {{Instantaneous Death}}"};
                    break;
            }
        }
        if (inputLocation >=19 && inputLocation <= 20){// head and neck
            switch(inputDamageType){
                case  "Crush":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Strike whistles past.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Was that a feint?}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Whoosh}} {{Hits=1}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Are you going for a love tap?}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Impressive, NOT! Foe giggles at you.}} {{Hits=3}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Solid hit to the temple.}} {{Hits=3}} {{Stun=1}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Hits rips off piece of foes ear.}} {{Hits=4}} {{Stun=1}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe has blurry vision.}} {{Hits=5}} {{Stun=2}} {{Maneuver=-10}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Minor concussion. Head is bleeding and foe is disoriented.}} {{Hits=6}} {{Stun=2}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Ear crushed. Hearing reduced by 50%.}} {{Hits=6}} {{Stun=3}} {{Maneuver=-15}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Moderate concussion causes foe to lose his bearings for a moment.}} {{Hits=7}} {{Stun=3}} {{Bleed=1}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Ear cut off. Hearing loss of 50%}} {{Hits=8}} {{Stun=4}} {{Maneuver=-20}} {{Bleed=1}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe is dazed for a brief moment with a blank look on his face.}} {{Hits=8}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Without helm, foe knocked unconsious for 1 day}} {{Hits=9}} {{Stun=5}} {{Maneuver=-25}} {{Bleed=2}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Temporary loss of voice.}} {{Hits=10}} {{Stun=6}} {{Bleed=2}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe can't believe how much that hurt.}} {{Hits=11}} {{Stun=8}} {{Maneuver=-30}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Eye damaged. Loss of sight in one eye.}} {{Hits=11}} {{Stun=9}} {{Maneuver=-40}} {{Bleed=3}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Skull fractured, downed}} {{Hits=12}} {{Stun=3}} {{Maneuver=-40}} {{Bleed=3}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Head Crushed}} {{Hits=13}} {{Instantaneous Death}}"};
                    break;
                case  "Puncture":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Shot nicks foe on cheek.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Was that a distraction for the real shot?}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=ZING!}} {{Hits=1}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=You sure you know how to use this weapon?}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=You're giving him a false sense of security right?}} {{Hits=3}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe is not impressed.}} {{Hits=3}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Shot cuts off piece of an ear. How attractive…}} {{Hits=4}} {{Stun=1}} {{Bleed=1}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Slash to the forehead.}} {{Hits=4}} {{Stun=1}} {{Bleed=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Cut across the cheek.}} {{Hits=5}} {{Stun=2}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Cut across the neck. Do they sound different to you?}} {{Hits=6}} {{Stun=2}} {{Bleed=2}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Well placed shot causes foe to lose his bearings for a moment.}} {{Hits=6}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Ear sliced causing 50% hearing loss.}} {{Hits=7}} {{Stun=3}} {{Maneuver=-10}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Nice grazing shot across the cheek dazes foe a moment.}} {{Hits=8}} {{Stun=4}} {{Bleed=3}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Shot to temple. Without helm, unconcious for 1 hour.}} {{Hits=8}} {{Stun=4}} {{Maneuver=-15}} {{Bleed=3}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Shot to neck causes bleeding}} {{Hits=9}} {{Stun=5}} {{Bleed=4}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Nose pierced, not in a good way.}} {{Hits=10}} {{Stun=6}} {{Maneuver=-20}} {{Bleed=4}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Eye pierced and destroyed. Depth perception is off.}} {{Hits=10}} {{Stun=7}} {{Bleed=5}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Shot through mouth kills foe in 3 rounds.}} {{Hits=11}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=5}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Shot through eye, Foe stands motionless for 2 rounds, then dies.}} {{Hits=12}} {{Stun=5}} {{Death in 2 rounds}}"};
                    break;
                case  "Slash":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Very small cut.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe must have cut themselves saving.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe feels the edge of the blade skip past their face.}} {{Hits=1}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Saaawwiiiiiing!}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Unimpressive attempt to injure your oppnent.}} {{Hits=3}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Slash cuts a small chunk off of foes ear.}} {{Hits=4}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Nice cut across the cheek.}} {{Hits=4}} {{Maneuver=-5}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Neck wound. The wound pours blood onto foes shirt.}} {{Hits=5}} {{Stun=1}} {{Bleed=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Slash across the face. No face protection: Foe loses an eye.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-10}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Ear cut off reducing hearing to 50%. Ear lands 10' away.}} {{Hits=7}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Deadly slash across face will leave a bad scar.}} {{Hits=8}} {{Stun=2}} {{Bleed=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Vicious slas to the neck will leave heavy scarring.}} {{Hits=8}} {{Stun=3}} {{Maneuver=-20}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Slash to the neck causes bleeding.}} {{Hits=6}} {{Stun=3}} {{Bleed=2}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Nice cut open the skin to reveal tissue below.}} {{Hits=10}} {{Stun=4}} {{Maneuver=-25}} {{Bleed=3}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foes jaw is broken and they bite off their tongue.}} {{Hits=11}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=3}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Slash across face exposes tissue and bone.}} {{Hits=11}} {{Stun=6}} {{Bleed=3}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Half of foe's face is sliced off. Foe dies in 6 rounds.}} {{Hits=12}} {{Stun=6}} {{Maneuver=-35}} {{Bleed=4}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Blow drives bone into brain. Foe dies in 3 rounds.}} {{Hits=13}} {{Stun=3}} {{Maneuver=-40}} {{Bleed=4}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foes severed head lands 5' away. Instant death.}} {{Hits=14}} {{Instantaneous Death}}"};
                    break;
                case  "Grapple":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=A little elbow.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Your grip fails.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe gets free; weak grip}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Lame attack}} {{Hits=1}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Grip fails, but bash does not}} {{Hits=1}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Your attack is almost comical as you seek any little grip you can get.}} {{Hits=2}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Routine ST to break hold}} {{Hits=2}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe spins away and turns back to face you.}} {{Hits=2}} {{Maneuver=-15}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Grab foe, he falls down.}} {{Hits=3}} {{Stun=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Grip foe’s head. With helm: You twist it.}} {{Hits=3}} {{Stun=1}} {{Maneuver=-20}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Crushing grip around foe’s neck. With no neck armor, foe will pass out in 5 rnds.}} {{Hits=4}} {{Stun=2}} {{Maneuver=-25}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Strong passing blow near foe’s head.}} {{Hits=4}} {{Stun=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Strangling hold. Foe flails legs in desperation.}} {{Hits=4}} {{Stun=3}} {{Maneuver=-30}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Grip foe’s neck. Hard Strength maneuver for foe to break free.}} {{Hits=5}} {{Stun=3}} {{Maneuver=-35}} {{Bleed=1}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Grip foe’s head and neck. You get +10 to your next Grappling Maneuver.}} {{Hits=5}} {{Stun=4}} {{Bleed=1}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Grasp foe around neck. He passes out for 1d10 hours.}} {{Hits=5}} {{Stun=2}} {{Maneuver=-40}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Skull fractured without a helm. Dies in 6 rnds}} {{Hits=6}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=2}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Grip foe’s neck. Foe dies in 3 rnds from the lack of oxygen to the brain.}} {{Hits=6}} {{Stun=3}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Pull the head from their body. Instant death.}} {{Hits=7}} {{Instantaneous Death}}"};
                    break;
                case  "Heat":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=The air shimmers.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Hot wind makes foe uncomfortable.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Whoosh!}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe covers his face and leaps aside.}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Assault blinds foe for a moment.}} {{Hits=3}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Hair and bowstrings are singed}} {{Hits=4}} {{Stun=1}} {{Maneuver=-15}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Hot winds dance around foe.}} {{Hits=5}} {{Stun=2}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Moderate burns to face and mouth.}} {{Hits=6}} {{Stun=3}} {{Maneuver=-10}} {{Bleed=1}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Flames dance around foe’s head.}} {{Hits=6}} {{Stun=4}} {{Maneuver=-15}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Garments over foe’s neck and head are set on fire.}} {{Hits=7}} {{Stun=5}} {{Bleed=2}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Flames burn into foe’s throat.}} {{Hits=8}} {{Stun=5}} {{Maneuver=-20}} {{Bleed=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Fire lands alongside foe’s face. His hair, cheek, and ear are engulfed.}} {{Hits=9}} {{Stun=6}} {{Maneuver=-25}} {{Bleed=3}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Severe burns on the face and head. All hair is destroyed.}} {{Hits=10}} {{Stun=6}} {{Bleed=3}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe’s face burning, having trouble opening his eyes.}} {{Hits=11}} {{Stun=7}} {{Maneuver=-30}} {{Bleed=4}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Blow to foe’s head. Head covering catches fire.}} {{Hits=11}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=4}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Fire consumes garments and hair. Blinding smoke keeps foe at bay.}} {{Hits=12}} {{Stun=8}} {{Bleed=5}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Brain overheated. With helm: dies in 6 rnds, Without helm: dies instantly}} {{Hits=13}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=5}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Smoke and flame blind foe. Foe dies in 3 rnds as the fire consumes his head. Foe is inactive.}} {{Hits=14}} {{Stun=3}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Head implodes from the fiery blast. Instant death.}} {{Hits=15}} {{Instantaneous Death}}"};
                    break;  
                case  "Cold":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Cold breeze.}} {{Hits=1}}"};
                    if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe dodges your attack without much effort.}} {{Hits=1}}"};
                    if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Burst of cold to the face sends foe stumbling back.}} {{Hits=2}}"};
                    if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Assault blinds foe for a moment.}} {{Hits=2}}"};
                    if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=You give foe’s cheeks a rosy hue.}} {{Hits=3}}"};
                    if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe is fearful of your assault.}} {{Hits=4}} {{Stun=1}} {{Maneuver=-5}}"};
                    if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe feebly tries to parry the attack.}} {{Hits=4}} {{Stun=2}} {{Maneuver=-10}}"};
                    if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe attempts to evade. You try not to laugh.}} {{Hits=5}} {{Stun=3}}"};
                    if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=With a burst of white, you shower foe with ice crystals.}} {{Hits=6}} {{Stun=4}} {{Maneuver=-15}} {{Bleed=1}}"};
                    if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Freeze foe’s hair and scalp. If foe has long hair, it breaks off!}} {{Hits=7}} {{Stun=5}} {{Maneuver=-20}} {{Bleed=1}}"};
                    if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Without helm, both ears lost and severe frostbite to the nose and mouth.}} {{Hits=8}} {{Stun=5}} {{Bleed=2}}"};
                    if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe drops anything he is holding and blocks his throat from the cold.}} {{Hits=8}} {{Stun=6}} {{Maneuver=-25}} {{Bleed=2}}"};
                    if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Blast freezes foe’s eyes, mouth, and neck causing severe frostbite.}} {{Hits=9}} {{Stun=6}} {{Maneuver=-30}} {{Bleed=3}}"};
                    if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Frigid onslaught fills foe’s eyes and mouth with ice.}} {{Hits=11}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=4}}"};
                    if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Ice and bitter air freezes one eye shut and foe’s hair to his head.}} {{Hits=11}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=4}}"};
                    if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Spray foe’s face with a powerful chill.}} {{Hits=11}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=4}}"};
                    if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Arm frozen to the body. Foe dies in 3 rnds from shock and loss of heat.}} {{Hits=12}} {{Stun=6}} {{Bleed=5}} {{Death in 6 rounds}}"};
                    if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Body fluids are frozen killing foe in 3 rnds.}} {{Hits=13}} {{Stun=3}} {{Maneuver=-45}} {{Bleed=5}} {{Death in 3 rounds}}"};
                    if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Blast to foe’s neck and collarbone. Neck freezes solid and instant death.}} {{Hits=14}} {{Instantaneous Death}}"};
                    break;
                case  "Electrical":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Strike grounds out.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Foe recoils from blast.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe is jerked off balance by the strike.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe flinches from the static In the air.}} {{Hits=3}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe sees spots.}} {{Hits=4}} {{Stun=1}} {{Maneuver=-5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe fails to avoid the attack and almost falls.}} {{Hits=4}} {{Stun=2}} {{Maneuver=-10}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe is magnetized for a moment.}} {{Hits=5}} {{Stun=3}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Flying debris obstructs foe’s vision.}} {{Hits=6}} {{Stun=4}} {{Maneuver=-15}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Blast heats up metal on foe, causing painful burns.}} {{Hits=7}} {{Stun=5}} {{Maneuver=-20}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Foe’s reflexes are numbed by blast. He is dazed and slow.}} {{Hits=8}} {{Stun=5}} {{Maneuver=-25}} {{Bleed=1}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Jolt blinds foe for 2 days and sends him crashing to the ground.}} {{Hits=9}} {{Stun=6}} {{Maneuver=-30}} {{Bleed=1}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Blast reaches out with hateful resolve. Foe’s neck and back are engulfed.}} {{Hits=10}} {{Stun=7}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Nervous system overloaded. Foe has trouble talking for one week.}} {{Hits=11}} {{Stun=7}} {{Bleed=2}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Electrical energy dances all over your foe. He recovers slowly.}} {{Hits=12}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=3}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe’s head is ablaze. Severe electrical burns all over the face.}} {{Hits=13}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=3}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe is overcome by the flash. He falls.}} {{Hits=14}} {{Stun=9}} {{Maneuver=-45}} {{Bleed=4}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe’s brain fries. He slips to ground and dies in 6 rnds.}} {{Hits=15}} {{Stun=6}} {{Bleed=4}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe’s neck absorbs the attack. Foe dies in 3 rnds from the overload.}} {{Hits=16}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=4}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Head is burned to a cinder. Instant death.}} {{Hits=17}} {{Instantaneous Death}}"};
                    break;
                case  "Impact":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe rolls with the blow.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=With great effort, foe evades the damage.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Spin foe sideways. He recovers quickly.}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=It looks solid, but foe is not hindered.}} {{Hits=2}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Blow to head brings foe toknees.}} {{Hits=3}} {{Stun=1}} {{Maneuver=-5}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Strike seeks foe’s head.}} {{Hits=3}} {{Stun=2}} {{Maneuver=-10}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Corrupt foe’s sense of balance.}} {{Hits=4}} {{Stun=3}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Your irresistible blow stuns foe. He drops his weapon.}} {{Hits=5}} {{Stun=4}} {{Maneuver=-15}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe’s response is quick enough to avoid serious damage.}} {{Hits=6}} {{Stun=5}} {{Maneuver=-20}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Bump foe in the chest.}} {{Hits=6}} {{Stun=6}} {{Maneuver=-25}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Severe concussion. Any helmet worn is bent around his head.}} {{Hits=7}} {{Stun=6}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe must give ground or fall. He steps back 5’ and goes low to avoid falling.}} {{Hits=8}} {{Stun=7}} {{Maneuver=-30}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe is knocked backwards from the blast 10’.}} {{Hits=8}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Your strike hurts foe’s sense of balance and he crashes to the ground.}} {{Hits=9}} {{Stun=8}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe’s face, jaw and neck are broken. Eating will be difficult.}} {{Hits=10}} {{Stun=8}} {{Maneuver=-40}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Snap foe’s head back. Foe is unconscious 1d10 minutes.}} {{Hits=11}} {{Stun=2}} {{Maneuver=-45}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe’s neck broken. He cannot breath. He dies after a 6 rnd struggle.}} {{Hits=11}} {{Stun=6}} {{Bleed=2}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Side of foe’s head is crushed. Foe dies in 3 rnds.}} {{Hits=12}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe dies instantly. His skull is crushed.}} {{Hits=13}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsStrikes":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Strike loses its power.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Strike slows to a tap.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=You maneuver for a better position.}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Light, well placed strike.}} {{Hits=1}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe is confused by your attack.}} {{Hits=2}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Knife hand, spear hand combination.}} {{Hits=2}} {{Maneuver=-5}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Elbow and fist combo to head bloodies nose.}} {{Hits=3}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Next time, let’s try to impress foe as well.}} {{Hits=3}} {{Stun=1}} {{Maneuver=-15}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Solid kick makes foe take you seriously.}} {{Hits=4}} {{Stun=2}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=You slip inside his guard to deliver a solid blow.}} {{Hits=4}} {{Stun=2}} {{Maneuver=-20}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Gooseneck strike. Foe’s inner ear ruptured. Follow-up strike knocks him out for 3 rounds!}} {{Hits=5}} {{Stun=3}} {{Maneuver=-25}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Solid blow spins foe to face the opposite direction.}} {{Hits=5}} {{Stun=4}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Jab to eyes blinds him temporarily. Crescent kick sends foe 10’ in direction you select.}} {{Hits=6}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Crunch! You heard bones break.}} {{Hits=6}} {{Stun=5}} {{Maneuver=-35}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Open-handed blow to foe’s Adam’s apple stuns foe.}} {{Hits=7}} {{Stun=6}} {{Bleed=2}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Strike foe in forehead, The shock sprains neck and fractures foe’s jaw.}} {{Hits=7}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Round-house kick breaks foe’s nose and jawbone.}} {{Hits=8}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Palm strike to both of foe’s ears; crushes skull. Foe dies in 3 rnds.}} {{Hits=8}} {{Stun=3}} {{Maneuver=-50}} {{Bleed=2}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Strike to foe’s nose drives bone into brain. Foe dies instantly}} {{Hits=9}} {{Instantaneous Death}}"};
                    break;
                case  "MartialArtsSweeps":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Acrobatic, but not else.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Rip your pants and miss an opportunity.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Nice move!}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=You make your sensei blush with shame.}} {{Hits=1}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe leaps back. He needs some time to recover.}} {{Hits=1}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Sweep is little more than a threatening kick.}} {{Hits=2}} {{Stun=1}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Your sweep is effective. Foe is sent reeling.}} {{Hits=2}} {{Stun=1}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe jumps over your assault. He strikes out at you in defense.}} {{Hits=2}} {{Stun=2}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=You try to throw foe, but he breaks free. Foe is unbalanced.}} {{Hits=3}} {{Stun=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=You almost connect your grapple with the force of a kick.}} {{Hits=3}} {{Stun=4}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Snazzy throw sends foe 15’ away. He’s out like a light for 1D10 minutes.}} {{Hits=4}} {{Stun=5}} {{Maneuver=-10}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Excellent shoulder throw lands foe on the ground}} {{Hits=4}} {{Stun=6}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Severe concussion stuns foe temporarily. Nose is also broken.}} {{Hits=4}} {{Stun=6}} {{Maneuver=-15}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe breaks his nose. He is down and confused.}} {{Hits=5}} {{Stun=7}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Fabulous throw sends foe flying. Foe almost breaks his neck when he lands.}} {{Hits=5}} {{Stun=7}} {{Maneuver=-20}} {{Bleed=1}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=You throw foe down hard as you land on top of him.}} {{Hits=5}} {{Stun=8}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=If he has a helm, he is knocked out. If no helm, foe is paralyzed.}} {{Hits=6}} {{Stun=8}} {{Maneuver=-25}} {{Bleed=2}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Fall to face breaks bones.}} {{Hits=6}} {{Stun=9}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Foe is smashed against several objects. Instant death.}} {{Hits=7}} {{Instantaneous Death}}"};
                    break;
                case  "Large":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe is tougher than you originally thought.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Nice fake?}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=So much enemy, so little time.}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Whoosh!}} {{Hits=2}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Are you playing or what?}} {{Hits=2}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=You going for a Love Tap?}} {{Hits=3}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Good bruise on the forehead.}} {{Hits=4}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=You were impressed, but that’s about it.}} {{Hits=4}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Solid hit to the temple. Foe is at -5 on next initiative.}} {{Hits=5}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Shot cuts off piece of an ear.}} {{Hits=6}} {{Maneuver=-5}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Strike to neck opens a vein. Foe begins to bleed all over himself.}} {{Hits=6}} {{Stun=1}} {{Maneuver=-15}} {{Bleed=1}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Minor head wound.}} {{Hits=7}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Crack! Nose and cheek broken.}} {{Hits=8}} {{Stun=1}} {{Maneuver=-15}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Minor concussion.}} {{Hits=8}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=2}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Neck wound makes for bleeding.}} {{Hits=9}} {{Stun=2}} {{Bleed=2}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Eye is destroyed.}} {{Hits=10}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Nasty strike sends bone fragments through carotid artery. Dies in 6 rnds.}} {{Hits=10}} {{Stun=3}} {{Bleed=3}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Side of head cut off. Foe dies as the air touches his exposed brain in 3 rnds.}} {{Hits=11}} {{Stun=3}} {{Maneuver=-30}} {{Bleed=3}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Crushing blow breaks skull and scrambles brain. Instant death.}} {{Hits=12}} {{Instantaneous Death}}"};
                    break;
                case  "Huge":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=You strike hard. Weapon breaks.}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Bad angle on the attack yields little damage.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Your blow was deflected.}} {{Hits=1}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Close shot delivers some damage.}} {{Hits=1}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Glancing blow to the head.}} {{Hits=2}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foe has noticed you.}} {{Hits=2}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Nothing seems to faze foe, not even the fact that you are attacking them.}} {{Hits=3}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe reaches down scratch an itch. Oops, that is not an itch; it was your attack.}} {{Hits=3}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Solid strike to foe’s head just bounces off.}} {{Hits=4}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=You are a mighty warrior. Your strike hits foe’s neck.}} {{Hits=4}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Your strike lands against foe’s neck.}} {{Hits=4}} {{Maneuver=-5}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Slash at foe’s neck fails to land very hard.}} {{Hits=5}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe stumbles from the effects of the shot.}} {{Hits=5}} {{Stun=1}} {{Maneuver=-10}} {{Bleed=1}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe presents a weak spot and you strike. Blow lands on the neck.}} {{Hits=6}} {{Stun=1}} {{Bleed=1}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Vicious blow to forehead.}} {{Hits=6}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=2}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Strike to foe injures an eye.}} {{Hits=7}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=2}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Neck and back are badly injured.}} {{Hits=7}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=3}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Weapon bites into foes skull. Foe dies in 3 rnds.}} {{Hits=8}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=3}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=You catch them in the ear. Blow collapses skull. Instant death.}} {{Hits=8}} {{Instantaneous Death}}"};
                    break;
                case  "Acid":
                    if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Lots of splash!}} {{Hits=1}}"};
					if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Acid flows over foe.}} {{Hits=1}}"};
					if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Just a little splash.}} {{Hits=2}}"};
					if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe felt that one.}} {{Hits=3}} {{Maneuver=-5}}"};
					if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe’s gear begins to melt from the assault!}} {{Hits=4}} {{Stun=1}} {{Maneuver=-10}}"};
					if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Raw acid ripples over foe’s exposed skin.}} {{Hits=4}} {{Stun=1}}"};
					if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foes helm is damaged.}} {{Hits=5}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=1}}"};
					if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe ducks, but the attack hits his neck.}} {{Hits=6}} {{Stun=2}} {{Maneuver=-20}} {{Bleed=1}}"};
					if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Some of foe’s hair is burned away!}} {{Hits=7}} {{Stun=3}} {{Bleed=1}}"};
					if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Acid engulfs foe completely.}} {{Hits=8}} {{Stun=3}} {{Maneuver=-25}} {{Bleed=2}}"};
					if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe’s face is hit. Brutal disfigurement.}} {{Hits=9}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Acid completely engulfs head; foe stumbles backwards.}} {{Hits=10}} {{Stun=4}} {{Maneuver=-30}} {{Bleed=2}}"};
					if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Attack hits them in the eyes and nose.}} {{Hits=11}} {{Stun=5}} {{Maneuver=-35}} {{Bleed=3}}"};
					if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Some skin melts away.}} {{Hits=12}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=3}}"};
					if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe’s neck and lower jaw burned badly.}} {{Hits=13}} {{Stun=7}} {{Maneuver=-40}} {{Bleed=3}}"};
					if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe ducks to avoid the attack and fails.}} {{Hits=14}} {{Stun=8}} {{Maneuver=-45}} {{Bleed=4}}"};
					if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Back of foe’s head is melted away making life very difficult. Foe dies in 6 rnds.}} {{Hits=15}} {{Stun=6}} {{Maneuver=-50}} {{Bleed=4}} {{Death in 6 rounds}}"};
					if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe takes the strike right in the head. Foe dies in 3 rnds from tissue loss.}} {{Hits=16}} {{Stun=3}} {{Bleed=4}} {{Death in 3 rounds}}"};
					if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Acid fills foe until their eyes glow. They die in a pool of their own flesh. Instant death.}} {{Hits=17}} {{Instantaneous Death}}"};
                    break;
            }
        }
        
        return outputDamage;
    };
    
    function GetPoisonMessage(inputDamageType,inputRoll){
        var ouputDamage;
        
        if(inputDamageType == "InternalPoison"){
            if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=}} {{Hits=1}}"};
			if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Is it heartburn?}} {{Hits=3}}"};
			if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe is green around the gills}} {{Hits=5}}"};
			if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe knows something is wrong now}} {{Hits=8}} {{Maneuver=-5}}"};
			if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe is woozy and light headed}} {{Hits=10}}"};
			if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=What a pretty shade of green.}} {{Hits=12}} {{Stun=1}} {{Maneuver=-10}}"};
			if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=Foe is exteremly nauseous}} {{Hits=15}} {{Stun=2}} {{Maneuver=-15}}"};
			if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Foe is vomiting}} {{Hits=17}} {{Stun=3}}"};
			if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe's stomach feels like it is on fire}} {{Hits=19}} {{Stun=4}} {{Maneuver=-20}}"};
			if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Foe is having severe cramps}} {{Hits=22}} {{Stun=5}} {{Maneuver=-25}} {{Bleed=1}}"};
			if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe stumbles in agony}} {{Hits=22}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=1}}"};
			if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe coughs blood}} {{Hits=29}} {{Stun=7}} {{Bleed=1}}"};
			if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe begins bleeding internally}} {{Hits=29}} {{Stun=7}} {{Maneuver=-35}} {{Bleed=1}}"};
			if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe has the funniest look on his face as his pores start to bleed}} {{Hits=31}} {{Stun=7}} {{Maneuver=-40}} {{Bleed=2}}"};
			if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Did he just cough up a lung}} {{Hits=34}} {{Stun=8}} {{Maneuver=-45}} {{Bleed=3}}"};
			if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=It takes 12 minutes for the fluids in his body to congeal and for him to di}} {{Hits=36}} {{Stun=8}} {{Bleed=3}} {{Death in 144 rounds}}"};
			if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe callapses and screams as his internal organs liquefy. Death in 1d10 min}} {{Hits=38}} {{Bleed=3}} {{Death in 144 rounds}}"};
			if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe collapses and dies in 1d10 rounds.}} {{Hits=41}} {{Stun=9}} {{Maneuver=-55}} {{Bleed=4}} {{Death in 10 rounds}}"};
			if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=Poison dissolves foe's brain, killing him instantly.}} {{Hits=41}} {{Instantaneous Death}}"};
        }
        else{
            if(inputRoll >= -19 && inputRoll <= -10){outputDamage = "{{info=Foe Looks just fine}} {{Hits=1}}"};
			if(inputRoll >= -9 && inputRoll <= 0){outputDamage = "{{info=Is that a rash?}} {{Hits=3}}"};
			if(inputRoll >= 1 && inputRoll <= 10){outputDamage = "{{info=Foe shows signs of discomfort}} {{Hits=6}}"};
			if(inputRoll >= 11 && inputRoll <= 20){outputDamage = "{{info=Foe is sweating and shaking}} {{Hits=8}}"};
			if(inputRoll >= 21 && inputRoll <= 30){outputDamage = "{{info=Foe is covered in red splotches}} {{Hits=11}} {{Maneuver=-5}}"};
			if(inputRoll >= 31 && inputRoll <= 40){outputDamage = "{{info=Foes Arms Feel Like they are burning}} {{Hits=14}}"};
			if(inputRoll >= 41 && inputRoll <= 50){outputDamage = "{{info=For screams from the sudden, searing pain in his chest.}} {{Hits=16}} {{Maneuver=-15}}"};
			if(inputRoll >= 51 && inputRoll <= 60){outputDamage = "{{info=Jarring pain rips through foes nerves.}} {{Hits=19}} {{Stun=1}}"};
			if(inputRoll >= 61 && inputRoll <= 70){outputDamage = "{{info=Foe doubles over from peircing pain in his abdomen.}} {{Hits=22}} {{Stun=2}} {{Maneuver=-15}} {{Bleed=1}}"};
			if(inputRoll >= 71 && inputRoll <= 80){outputDamage = "{{info=Foe is staggering with intense leg pain.}} {{Hits=24}} {{Stun=3}} {{Maneuver=-20}} {{Bleed=1}}"};
			if(inputRoll >= 81 && inputRoll <= 85){outputDamage = "{{info=Foe loses a loarge patch of skin and flesh..}} {{Hits=27}} {{Stun=4}} {{Maneuver=-25}} {{Bleed=1}}"};
			if(inputRoll >= 86 && inputRoll <= 90){outputDamage = "{{info=Foe's arm flesh melts.}} {{Hits=29}} {{Stun=4}} {{Bleed=2}}"};
			if(inputRoll >= 91 && inputRoll <= 95){outputDamage = "{{info=Foe's torso flesh looks leprous as bits and chunks fall off}} {{Hits=32}} {{Stun=5}} {{Maneuver=-30}} {{Bleed=2}}"};
			if(inputRoll >= 96 && inputRoll <= 100){outputDamage = "{{info=Foe's body is a mass of open wounds.}} {{Hits=35}} {{Stun=5}} {{Maneuver=-35}} {{Bleed=2}}"};
			if(inputRoll >= 101 && inputRoll <= 105){outputDamage = "{{info=Foe screams as the skin on his face is burned away.}} {{Hits=37}} {{Stun=6}} {{Maneuver=-40}} {{Bleed=3}}"};
			if(inputRoll >= 106 && inputRoll <= 110){outputDamage = "{{info=Foe's left foot and ankle melt away. He is writhing in helpless agony}} {{Hits=40}} {{Stun=12}} {{Bleed=3}} {{Death in 12 rounds}}"};
			if(inputRoll >= 111 && inputRoll <= 115){outputDamage = "{{info=Foe dies after 12 haelpless rounds of agaonizing pain as his skin dissolves}} {{Hits=43}} {{Stun=12}} {{Bleed=4}} {{Death in 12 rounds}}"};
			if(inputRoll >= 116 && inputRoll <= 119){outputDamage = "{{info=Foe is covered in acrid smoke as his internal organs are destroyed.}} {{Hits=45}} {{Stun=6}} {{Maneuver=-45}} {{Bleed=3}} {{Death in 6 rounds}}"};
			if(inputRoll >= 120 && inputRoll <= 999){outputDamage = "{{info=All That remains of foe are his head and torso - he is quite dead.}} {{Hits=55}} {{Instantaneous Death}}"};
        }
        
        return outputDamage;
    };
    
    function GetFumble(inputRoll){
      
      var outputFumble = "";
      
      if(inputRoll > 0 && inputRoll <= 25){outputFumble = "{{**Combat**=You lose your grip on your weapon and the opportunity to strike your foe.}} {{**Influence**=You accidentally make a high pitched noise as you try to begin.}} {{**Mental**=Umm… what was your name again? Your mind goes blank for a moment.}} {{**Moving**=You stumble over an unseen imaginary dead turtle.}} {{**Physical**=You drop whatever you are holding and must spend a round recovering it.}} {{**Spell**=You are distracted by a pixie in the corner! Give it up and try again next round.}} "};
      if(inputRoll > 26 && inputRoll <= 50){outputFumble = "{{**Combat**=You give yourself a minor wound. Take 1d10 ([[1d10]]) Hits. Remember, the pointy end faces the enemy!}} {{**Influence**=You strike a sour note with your audience. They are far from inspired by your performance. You may try again, but with a -10 modifier.}} {{**Mental**=You are too deep in thought to be distracted by trifles.}} {{**Moving**=Your maneuver ends up with you tripping and falling face-first into the dirt. Take 1d10 ([[1d10]]) Hits. You must spend a round picking yourself up off the ground.}} {{**Physical**=You mutter an oath as the tool that you are using snaps and breaks! At least you didn’t damage what you were working on…}} {{**Spell**=Wow sparks! Were you trying for that effect? What a waste of perfectly good power points!}} "};
      if(inputRoll > 51 && inputRoll <= 75){outputFumble = "{{**Combat**=It is surprising that you still have all of your limbs attached! Roll 2d10 ([[2d10]]) on the appropriate damage table. You have just successfully attacked yourself. Congratulations!}} {{**Influence**=The crowd does not look the least bit pleased. In fact, they look downright hostile. You can try again with a -20 modifier, or play it safe and go elsewhere!}} {{**Mental**=In the words of a great philosopher, “Doh!” Not only do you not remember anything pertinent, but you actually spout off incorrect information without realizing it!}} {{**Moving**=Wow, people can bounce! Roll 2d10+10 ([[2d10+10]]) on the Crush table for the damage that you gave yourself in that spectacular fall!}} {{**Physical**=You are distracted by a noise at a critical moment. Not only is the tool you were using broken, but the item you are working on was damaged in the process.}} {{**Spell**=Since when do you glow? You internalize the magical energy of the spell, and must roll 2d10+10 ([[2d10+10]]) on the Electricity Critical Table for the damage you just did to yourself.}} "};
      if(inputRoll > 76 && inputRoll <= 100){outputFumble = "{{**Combat**=That will most definitely leave a mark! You shouldn’t try to harm yourself like that. Make a 1d100 ([[1d100]]) roll on the appropriate damage table as you try this fancy form of suicide.}} {{**Influence**=The audience is stunned! Well, at least for the first few seconds. After that, the term ‘Lynch Mob’ comes to mind. Better luck next time!}} {{**Mental**=You keep using that word… It doesn’t seem to mean what you think it means…}} {{**Moving**=Is it supposed to bend that direction? Unfortunately not! Make a 1d100 ([[1d100]]) roll on the Crush table for the damage you take from that hilarious move. Everyone within 50’ spend 3 rounds trying to contain their laughter!}} {{**Physical**=Hmm… Square peg? Round hole? Nope, it’s just you destroying (or activating, if a trap) whatever you were working on. Take 2d10 ([[2d10]]) hits of damage as you wound yourself in the process.}} {{**Spell**=Wow! You just invented the x-ray! Unfortunately, you also knock yourself out and take a 1d100 ([[1d100]]) on the Electricity Critical Table from the magical energy feedback.}} "};
      
      return outputFumble;  
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