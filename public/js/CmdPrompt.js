/**
 * Created by emol on 4/7/17.
 */
let swalService = new SwalService();
// display command prompt
function showCmdPrompt() {
    $('#cmd-prompt').show();
}

function hideCmdPrompt() {
    clearHighlightedVertices();
    clearHighlightedHexes();
    let $prompt = $('#cmd-prompt');
    $prompt.find('.button').remove();
    $prompt.hide();
}

function isCmdPromptVisible() {
    return $('#cmd-prompt').is(':visible');
}


function generateDrawCardPrompt(cmd) {
    // FIXME: maybe text whether player have selected other stuffs here?
    let opts;
    if (cmd == "drawOneResourceCard") {
        opts = Object.values(Enum.Resource);
    }
    if (cmd == "drawOneProgressCard") {
        opts = Object.values(Enum.cityImprovementCategory);
    }
    let cmds = new Array(opts.length).fill(cmd);

    populateCmdPromptOptions(opts, cmds);
    showCmdPrompt();
}


function generateDiscardCardPrompt() {
    if (isCmdPromptVisible()) hideCmdPrompt();
    let $prompt = $('#cmd-prompt');
    $prompt.append(generateTradeForm('selling', 'discardResourceCards'));

    addConfirmAndCancelButtonForPrompt();

    // confirm button
    $prompt.find('.button[data-id=confirm]').click(function () {
        let input = getInputCmdPrompt();
        let {selling, buying} = readTradeInput(input);
        // selling is the cards object ({Cost}) we want to discard, the name is inappropriate, because I am using the trade input function...


        console.log("selling", selling);
        Commands.discardResourceCards(selling);


        hideCmdPrompt();


    });
    showCmdPrompt();

}


/**
 *
 * @param cmds String[] a list of cmds used to generate prompt options
 * @param data the data user inputted (command argument)
 */
function populateCmdPromptCmds(cmds, data) {
    let $prompt = $('#cmd-prompt');
    //$prompt.find('.button').not('.button[data-id=cancel]').remove();
    $prompt.prepend($('<div class="button" data-id="cancel">Cancel</div>'));
    _.forEach(cmds, function (cmd) {
        let $cmd = $('<div class="button">' + cmd + '</div>');
        $cmd.attr('cmd', cmd);
        $prompt.prepend($cmd);
    });


    // add listener here because we generate the buttons dynamically
    $('#cmd-prompt .button').click(function (e) {
        let $button = $(e.target);

        if ($button.attr('data-id') == 'cancel') {
            hideCmdPrompt();
        }
        else {
            let cmdName = $button.attr('cmd');
            hideCmdPrompt();
            if (_.has(SpecialsCommands, cmdName)) {
                SpecialsCommandsNextStep[cmdName].apply(this, data);
            }
            else {
                Commands[cmdName].apply(this, data);
            }
            // console.log($button.attr('cmd'));
        }

    });
}


/**
 * @param opts String[] a list of options used to generate prompt options
 * @param cmds String[] a list of cmds used to generate prompt options
 * @param data the data user inputted (command argument)
 */
function populateCmdPromptOptions(opts, cmds, data = []) {
    let $prompt = $('#cmd-prompt');
    //$prompt.find('.button').not('.button[data-id=cancel]').remove();
    $prompt.prepend($('<div class="button" data-id="cancel">Cancel</div>'));
    for (let i = 0; i < opts.length; i++) {
        let cmd = cmds[i];
        let opt = opts[i];
        let $cmd = $('<div class="button">' + opt + '</div>');
        $cmd.attr({
            'cmd': cmd,
            'opt': opt
        });
        $prompt.prepend($cmd);
    }

    // add listener here because we generate the buttons dynamically
    $('#cmd-prompt .button').click(function (e) {
        let $button = $(e.target);

        if ($button.attr('data-id') == 'cancel') {
            hideCmdPrompt();
        }
        else {
            let cmdName = $button.attr('cmd');
            let opt = $button.attr('opt');
            hideCmdPrompt();
            data.push(opt);
            console.log(data);

            if (_.has(SpecialsCommands, cmdName)) {
                SpecialsCommandsNextStep[cmdName].apply(this, data);
            }
            else {
                Commands[cmdName].apply(this, data);
            }
            // console.log($button.attr('cmd'));**/
        }

    });
}


// --------------------trade form-----------------


/**
 *
 * @param type {String} "selling" / "buying"
 */
function generateTradeForm(type, cmd) {
    let $form = $('<div></div>');
    $form.attr('data-id', type);

    if (cmd != "discardResourceCards") {
        // trade
        let $title = $('<div>' + type + '</div>');
        $title.addClass('button title ' + type);
        $form.append($title);
    }
    else {
        // discard cards
        let $title = $('<div>' + 'Choose cards to discard' + '</div>');
        $title.addClass('button title ' + type);
        $form.append($title);
    }


    let $item = $('<div class="button ' + type + '" data-id="select"> </div>');
    let $select = $('<select class="weui-select"></select>');
    $select.attr('name', type + 1);
    $item.append($select);

    _.forEach(Enum.Tradable, function (item) {
        let $option = $('<option value="' + item + '">' + item + '</option>');
        $select.append($option);
    });


    if (cmd != "tradeWithBank") {
        // trade with player
        let $input = $('<input class="weui-input" type="number" pattern="[0-9]*" placeholder="0">');
        $input.attr('name', type + 1 + "cnt");
        $item.append($input);

        // add and delete icon
        $item.append('<i class="fa fa-minus-circle delete" aria-hidden="true"></i> <i class="fa fa-plus-circle add" aria-hidden="true"></i>');
    }

    else if (type == "buying") {
        // default
        let ratio = DATA.getMyPlayer().tradeRatio["Lumber"];
        let merchant_used = Object.keys(DATA.getMyPlayer().active_cards).indexOf("MerchantFleet") !== -1;
        if(merchant_used){
            ratio = 2;
        }
        // trade with bank
        let $ratioInfo = $('<div class="trade-info"><i class="fa fa-info-circle" aria-hidden="true">  trade ratio</i><div class="text">' + ratio + '</div><div></div>');

        $select.change(function () {
            let type = $select.val();
            $ratioInfo.find('.text').text(DATA.getMyPlayer().tradeRatio[type]);
            console.log(DATA.getMyPlayer().tradeRatio[type]);
            console.log($select.val());
        });

        $item.append($ratioInfo);
    }

    $form.append($item);

    return $form;
}

// FIXME: Is there a nicer way to create listner on dynamically generated divs???
function addNewItem(e) {
    let $buttonClicked = $(e.target).parent();
    let $newButton = $buttonClicked.clone();
    let $form = $buttonClicked.parent();
    // change name of input
    let buttonNumber = $form.find('.button').size();  // title is also a button, so number of buttons is size() - 1, no for this button is size() - 1 +1
    let type = $form.attr('data-id');
    $newButton.find('input').attr('name', type + buttonNumber + 'cnt');
    $newButton.find('select').attr('name', type + buttonNumber);

    // create listener for new button
    $newButton.find('i.add').click(function (e) {
        addNewItem(e);
    });
    $newButton.find('i.delete').click(function (e) {
        removeItem(e);
    });
    // let $button =  $("#cmd-prompt .button[data-id=select]").eq(0).clone();
    $buttonClicked.after($newButton);
}


function removeItem(e) {
    let $button = $(e.target).parent();
    let $form = $button.parent();
    if ($form.find('.button').size() <= 2) {
        swalError2("You should at least have one item!");
        return;
    }
    $button.remove();

}


function addConfirmAndCancelButtonForPrompt() {
    let $prompt = $('#cmd-prompt');

    $prompt.append('<div class="button" data-id="confirm">Confirm</div> <div class="button" data-id="cancel">Cancel</div>');

    // add listener
    // for trade form cmd prompt, add and remove icon
    $('#cmd-prompt i.add').click(function (e) {
        addNewItem(e);
    });

    $('#cmd-prompt i.delete').click(function (e) {
        removeItem(e);
    });

    // cancel button
    $prompt.find('.button[data-id=cancel]').click(function () {
        hideCmdPrompt();
    });
}


/**
 *
 * @param cmd {String} command name
 */
function generateTradePrompt(cmd, targetPlayer = null) {
    if (isCmdPromptVisible()) hideCmdPrompt();
    let $prompt = $('#cmd-prompt');
    $prompt.append(generateTradeForm('buying', cmd));
    $prompt.append(generateTradeForm('selling', cmd));

    addConfirmAndCancelButtonForPrompt();

    // confirm button
    $prompt.find('.button[data-id=confirm]').click(function () {
        let input = getInputCmdPrompt();
        let {selling, buying} = readTradeInput(input, cmd);


        if (cmd == "tradeWithBank") {

            console.log("selling", selling);
            console.log("buying", buying);
            Commands.tradeWithBank(selling, buying);

            // command trade with bank
            // TODO: Yuan / Emol change trade with bank cmd (it should accept cost object)
        }

        else {
            console.log("Trade is working!");
            console.log(selling, buying, targetPlayer);
            Commands.requestTrade(selling, buying, targetPlayer);
        }

        hideCmdPrompt();


    });
    //getInputCmdPrompt
}


/**
 *
 * @param cmd
 * @param options {String[]}
 */
/**
 function generateOptionPrompt(cmd, options) {
        let $prompt = $('#cmd-prompt');

        $prompt.append( '<div class="button" data-id="confirm">' + cmd + '</div> <div class="button" data-id="cancel">Cancel</div>');

        // cancel button
        $prompt.find('.button[data-id=cancel]').click(function () {
            hideCmdPrompt();
        });


        // confirm button
        $prompt.find('.button[data-id=confirm]').click(function () {
            let input = getInputCmdPrompt();
            let {selling, buying} = readTradeInput(input);


            if (cmd == "tradeWithBank"){

                console.log("selling", selling);
                console.log("buying", buying);

                // command trade with bank
                // TODO: Yuan / Emol change trade with bank cmd (it should accept cost object)
            }

            else {

            }

            hideCmdPrompt();

        });
    }
 **/


//-------------------get input---------------------------
// return true if input is a number or a stringified number
function isNum(n) {
    if (_.isNumber(n)) return true;
    if (String(parseInt(n)) == String(n)) return true;
    return false;
}


function getInputCmdPrompt() {
    var data = {};
    $('#cmd-prompt [name]').each(function () {
        var name = $(this).attr('name');
        var val = $(this).val();
        data[name] = isNum(val) ? parseFloat(val) : val;
    });
    return data;
}


/**
 *
 * @param input
 * @return {Cost, Cost} selling and buying
 */
function readTradeInput(input, cmd) {
    let sellingType = {};   // temp storage
    let buyingType = {};

    let selling = {};
    let buying = {};

    // read type
    for (let key in input) {
        if (input.hasOwnProperty(key) && !key.includes("cnt")) {
            let type = input[key];
            let number;
            if (key.includes("buying")) {
                number = key.substr(6);
                buyingType[number] = type;
            }
            if (key.includes("selling")) {
                number = key.substr(7);
                sellingType[number] = type;
            }
        }
    }

    if (cmd == "tradeWithBank") {
        selling = _.values(sellingType)[0];
        buying = _.values(buyingType)[0];
        return {selling, buying};
    }

    // read cnt
    for (let key in input) {
        if (input.hasOwnProperty(key) && key.includes("cnt") && input[key] != "") {
            let number;
            if (key.includes("buying")) {
                number = key.substr(6, 1);
                buying[buyingType[number]] = input[key];   // o is dummy value
            }
            if (key.includes("selling")) {
                number = key.substr(7, 1);
                selling[sellingType[number]] = input[key];
            }
        }
    }

    return {selling, buying};


}
