/**/
// click on 1 vertex
    function showVertexOpeartions($e) {
        let vertexID = parseInt($e.attr('data-id'));
        populateCmdPromptCmds(VertexUnit.getCommands(vertexID), [vertexID]);
        showCmdPrompt();

    }

// click on 2 vertices
    function showEdgeOperations() {
        var $map = $('#board .map');
        var $cmd = $('#cmd-table');
        var $v1 = $map.find('.ctrl-clicked').eq(0);
        var $v2 = $map.find('.ctrl-clicked').eq(1);
        let edge = Map.edge($v1.attr('data-id'), $v2.attr('data-id'));
        populateCmdPromptCmds(EdgeUnit.getCommands(edge), [edge[0], edge[1]]);
        showCmdPrompt();

    }

    function showHexOperations($e) {
        let hexID = parseInt($e.attr('data-id'));
        let cmds = HexTile.getCommands(hexID);
        if (cmds.length == 0) return;
        populateCmdPromptCmds(HexTile.getCommands(hexID), [hexID]);
        showCmdPrompt();
    }




    // -----------------special cmd prompt for cmd requires multi-steps-----------------------
    /**
     *
     * @param position {int} old position
     */
    SpecialsCommandsNextStep.moveKnight = function (position) {
        swal({
                title: "Move Knight",
                text: "Click on the map where you want to move the knight!",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK!",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    app.ongoingCmd = "moveKnight";
                    app.ongoingCmdData = [position];
                }
            });
    };

    SpecialsCommandsFinalStep.moveKnight = function (newPosition) {
        swal({
                title: "Move knight here?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    let oldPosition = app.ongoingCmdData[0];
                    Commands.moveKnight(oldPosition, newPosition);
                }

                app.ongoingCmd = null;
                app.ongoingCmdData = null;
                clearHighlightedVertices();
            });
    };


    SpecialsCommandsNextStep.requestTrade = function (targetPlayer) {
        generateTradePrompt("tradeWithPlayer", targetPlayer);
        showCmdPrompt();
    };




    SpecialsCommandsNextStep.upgradeToMetropolis = function(position){
        let $prompt = $('#cmd-prompt');

        $prompt.prepend($('<div class="button" data-id="cancel">Cancel</div>'));
        let a = Player.ableToUpgradeToMetropolis();
        _.forEach(Player.ableToUpgradeToMetropolis(), function (type) {
            let $opt = $('<div class="button">' + type + '</div>');
            $opt.attr('type', type);
            $prompt.prepend($opt);
        });


        // add listener here because we generate the buttons dynamically
        $('#cmd-prompt .button').click(function (e) {
            let $button = $(e.target);

            if ($button.attr('data-id') == 'cancel') {
            }

            else {
                let type = $button.attr('type');
                Commands.upgradeToMetropolis.apply(this, [position, type]);
                // console.log($button.attr('cmd'));
            }
            hideCmdPrompt();

        });

        showCmdPrompt();
    };



    SpecialsCommandsNextStep.moveShip = function (oldV1, oldV2) {
        swal({
                title: "Move Ship",
                text: "Where do you want to move the ship to? (Click two points with CTRL pressed)",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK!",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    app.ongoingCmd = "moveShip";
                    app.ongoingCmdData = [oldV1, oldV2];
                }
            });
    };


    SpecialsCommandsFinalStep.moveShip = function () {
        var $map = $('#board .map');
        var $cmd = $('#cmd-table');
        var $v1 = $map.find('.ctrl-clicked').eq(0);
        var $v2 = $map.find('.ctrl-clicked').eq(1);
        let newPosition = Map.edge($v1.attr('data-id'), $v2.attr('data-id'));

        swal({
                title: "Move Ship here?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    let oldVertex1 = app.ongoingCmdData[0];
                    let oldVertex2 = app.ongoingCmdData[1];
                    Commands.moveShip(oldVertex1, oldVertex2, newPosition[0], newPosition[1]);
                }

                app.ongoingCmd = null;
                app.ongoingCmdData = null;
                clearHighlightedVertices();
            });
    };








    // -----------------------right side command buttons ------------------------

    function showProgressCardCmd(card){
        hideCmdPrompt();
        populateCmdPromptCmds(ProgressCardCommand, [card]);
        showCmdPrompt();

    }



    function showFishTokenInfo(tokenType) {
        //hideCmdPrompt();
        console.log(tokenType);
        if (tokenType == Enum.fishToken.BOOT){
            swal({
                title: "Boot Token",
                text: "Click other player to give away the boot!",
                type: "info",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Cool!",
                closeOnConfirm: true,
            });
            //populateCmdPromptCmds(FishTokenCommand.Boot, [tokenType]);
        }
        else {
            hideCmdPrompt();
            let opts = Object.values(Enum.fishEvent);
            let cmds = new Array(opts.length).fill("spendFishToken");
            populateCmdPromptOptions(opts, cmds);
            showCmdPrompt();
            /**
             swal({
                    html: true,
                    title: "Fish Token",
                    text: "Hey, you can use fish tokens to do a lot of things!<br>2 fish - move robber off board (click robber)<br>3 fish - steal resource card (click the player you want to steal from)<br>4 fish - take a resource from bank (click bank icon)<br>5 fish - build road<br>7 fish - draw development card!",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Cool!",
                    closeOnConfirm: true,
                })*/
        }
    }



    function showDrawCardPrompt(cmd) {
        console.log(cmd);
        generateDrawCardPrompt(cmd);
    }

    function showDiscardCardPrompt(cmd) {
        console.log(cmd);
        generateDiscardCardPrompt(cmd);
    }


    function showMetropolis(e) {
        let metroType = $(e.target).attr('data-type');
        let building = DATA.getMatch().Metropolis[metroType];
        if (building){
            let $map =  $('.map');
            let $v = $map.find('.vertex[data-id=' + building.position + ']').eq(0);
            // $v.addClass('ctrl-clicked');
            highlightVertex($v);
        }
    }


    function notifyUserToMoveThief(thiefList) {
        let thieves;
        if (thiefList == 1) thieves = thiefList[0];
        else thieves = "robber or pirate";
        swal({
                title: "Now you can move " + thieves,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Cool!",
                closeOnConfirm: true,
        });

        app.ongoingCmd = "moveThief";
        app.ongoingCmdData = thiefList;
        clearHighlightedVertices();
    }


function notifyUserToDrawProgressCard(types) {
    let cards = "";
    cards += types[0];
    for (let i = 1; i < types.length; i++){
        cards += ", ";
        cards += types[i];    
    }
    
    swal({
        title: "You can draw " + cards +" progress card",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Cool!",
        cancelButtonText: "No thanks",
        closeOnConfirm: true,
        closeOnCancel: true
    }, function (isConfirm) {
        if (isConfirm) {
            _.forEach(types, function (progressCardtype) {
                Commands.drawOneProgressCard(progressCardtype);
            })
        }
    });

}



function notifyUserToStealCard(playersToStealFrom) {
    if (playersToStealFrom.length == 0) return;
    
    let playersToSteal = "";
    playersToSteal += playersToStealFrom[0].name;

    for (let i = 1; i < playersToStealFrom.length; i++){
        playersToSteal += " or ";
        playersToSteal += playersToStealFrom[i].name;
    }

    swal({
        title: "Steal Card",
        text: "You can steal a resource card from " + playersToSteal +". Click the player you want to steal from!",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "XD",
        cancelButtonText: "I am a nice guy.",
        closeOnConfirm: true,
        closeOnCancel: true
    }, function (isConfirm) {
        if (isConfirm) {
            app.ongoingCmd = "stealCard";
            app.ongoingCmdData = playersToStealFrom;
        }
    });

}

function notifyUserToDiscardProgressCard() {
    swal({
            title: "Discard Progress Card" ,
            text: "You can have at most 4 progress cards, click one card to discard",
            type: "info",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            closeOnConfirm: true,
        });
    app.ongoingCmd = "discardOneProgressCard";

}

function notifyUserBarbarianAction() {
    app.barbarianResult = true;
    let result = DATA.getMatch().barbarianResult.result;
    let action = Enum.BarbarianAction[result];
    swal({
        title: result,
        text: action
        //TODO Emol
        /*
         for players not in their turn limit them to the following commands only - app.barbarianResult == true; (line 1238)
         2 cases:
         1. if DATA.getMatch().barbarianResult.result = "CATAN_WIN_TIE" ->  drawOneProgressCard;
         2. if DATA.getMatch().barbarianResult.result = "CATAN_LOSE" ->  chooseCityToBePillaged
         then automatically ends their turn.
         Note: if current player receives these 2 result, he need to following the instruction and do the corresponding action first.
         Fix:
         1. DATA.getMatch().barbarianResult should be null after barbarian restart. In Dice.js(server) line 79

         */
    });

    switch (result){
        case Enum.BarbarianResult.CATAN_LOSE:
            //choose one city to be pillaged
            app.ongoingCmd = "chooseCityToBePillaged";
    }
}

