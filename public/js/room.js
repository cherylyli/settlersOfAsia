
// set up environment
$(document).ready(function(){
    var evt = $.Event('imready');

    // Fetch my data from server
    $get('/mydata', function(data){

        // if not logged in, redirect to login
        if (!data) return window.location.href = '/login';
        evt.myObj = data;

        // show page
        $(window).trigger(evt);
    });
});





// upon environment set up
$(window).on('imready', function(im){

    $("button").attr('disabled', 'disabled').click(function () {
        //Commands.exec(CommandName.rollDice, CommandsData.rollDice());
        let input1 = parseInt($("input[name='input1']").val());
        let input2 = parseInt($("input[name='input2']").val());
        Commands.exec(CommandName.buildEstablishment, CommandsData.buildEstablishment(input1, 1));
    });
    //test



    let CircularJSON = window.CircularJSON;

    window.myObj = im.myObj;
    //console.log(window.myObj);
    let roomId = window.location.pathname.split("/").pop();

    // parse a fake room data just for test
    var room = window.room = CircularJSON.parse('{"id":"a","state":"Full","owner":"Emol2","users":{"Emol2":{"name":"Emol2","color":"RED","VP":0,"resourcesAndCommodities":{"Lumber":0,"Brick":0,"Grain":0,"Ore":0,"Wool":0,"Gold":2,"Cloth":0,"Coin":0,"Paper":0},"progressCards":[],"progressCardsCnt":0,"buildings":{},"roads":[],"ships":[],"harbors":[],"knights":[],"cityImprovement":{"trade":0,"politics":0,"science":0},"tradeRatio":{"Lumber":4,"Brick":4,"Grain":4,"Ore":4,"Wool":4,"Cloth":4,"Coin":4,"Paper":4},"longestRoad":0,"cityWallNum":0,"maxSafeCardNum":7,"match":{"scenario":{"data":{"hexTileNum":37,"mainIsland":[1,2,3,5,6,7,8,11,12,13,14,18,19,20],"smallIslands":[16,23,29,30,31,32,33,28,22,35,36,37],"hexTypeForMain":{"Desert":0,"GoldField":0,"Field":3,"Hills":2,"Mountains":2,"Pasture":4,"Forest":3},"hexTypeForIslands":{"Sea":4,"Desert":0,"GoldField":2,"Field":1,"Hills":2,"Mountains":2,"Pasture":1,"Forest":0},"NumTokenForMain":{"2":1,"3":1,"4":1,"5":2,"6":2,"8":2,"9":1,"10":2,"11":2,"12":0},"NumTokenForIslands":{"2":0,"3":1,"4":2,"5":1,"6":0,"8":1,"9":1,"10":1,"11":0,"12":1}}},"players":"~users","playersToTakeTurn":["Emol4","Emol1"],"currentPlayer":"Emol3","map":{"hexTileNum":37,"hexTiles":[{"id":1,"row":1,"posInRow":1,"type":"Hills","productionNum":10,"visible":true,"edge":{"TopRight":[2,3],"Right":[3,13],"BottomRight":[12,13],"BottomLeft":[11,12],"Left":[1,11],"TopLeft":[1,2]},"vertices":{"Top":2,"TopLeft":1,"BottomLeft":11,"Bottom":12,"BottomRight":13,"TopRight":3},"blockedByRobber":false},{"id":2,"row":1,"posInRow":2,"type":"Field","productionNum":11,"visible":true,"edge":{"TopRight":[4,5],"Right":[5,15],"BottomRight":[14,15],"BottomLeft":[13,14],"Left":[3,13],"TopLeft":[3,4]},"vertices":{"Top":4,"TopLeft":3,"BottomLeft":13,"Bottom":14,"BottomRight":15,"TopRight":5},"blockedByRobber":false},{"id":3,"row":1,"posInRow":3,"type":"Hills","productionNum":11,"visible":true,"edge":{"TopRight":[6,7],"Right":[7,17],"BottomRight":[16,17],"BottomLeft":[15,16],"Left":[5,15],"TopLeft":[5,6]},"vertices":{"Top":6,"TopLeft":5,"BottomLeft":15,"Bottom":16,"BottomRight":17,"TopRight":7},"blockedByRobber":false},{"id":4,"row":1,"posInRow":4,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[8,9],"Right":[9,19],"BottomRight":[18,19],"BottomLeft":[17,18],"Left":[7,17],"TopLeft":[7,8]},"vertices":{"Top":8,"TopLeft":7,"BottomLeft":17,"Bottom":18,"BottomRight":19,"TopRight":9},"blockedByRobber":false},{"id":5,"row":2,"posInRow":1,"type":"Forest","productionNum":6,"visible":true,"edge":{"TopRight":[11,12],"Right":[12,24],"BottomRight":[23,24],"BottomLeft":[22,23],"Left":[10,22],"TopLeft":[10,11]},"vertices":{"Top":11,"TopLeft":10,"BottomLeft":22,"Bottom":23,"BottomRight":24,"TopRight":12},"blockedByRobber":false},{"id":6,"row":2,"posInRow":2,"type":"Forest","productionNum":3,"visible":true,"edge":{"TopRight":[13,14],"Right":[14,26],"BottomRight":[25,26],"BottomLeft":[24,25],"Left":[12,24],"TopLeft":[12,13]},"vertices":{"Top":13,"TopLeft":12,"BottomLeft":24,"Bottom":25,"BottomRight":26,"TopRight":14},"blockedByRobber":false},{"id":7,"row":2,"posInRow":3,"type":"Field","productionNum":2,"visible":true,"edge":{"TopRight":[15,16],"Right":[16,28],"BottomRight":[27,28],"BottomLeft":[26,27],"Left":[14,26],"TopLeft":[14,15]},"vertices":{"Top":15,"TopLeft":14,"BottomLeft":26,"Bottom":27,"BottomRight":28,"TopRight":16},"blockedByRobber":false},{"id":8,"row":2,"posInRow":4,"type":"Pasture","productionNum":6,"visible":true,"edge":{"TopRight":[17,18],"Right":[18,30],"BottomRight":[29,30],"BottomLeft":[28,29],"Left":[16,28],"TopLeft":[16,17]},"vertices":{"Top":17,"TopLeft":16,"BottomLeft":28,"Bottom":29,"BottomRight":30,"TopRight":18},"blockedByRobber":false},{"id":9,"row":2,"posInRow":5,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[19,20],"Right":[20,32],"BottomRight":[31,32],"BottomLeft":[30,31],"Left":[18,30],"TopLeft":[18,19]},"vertices":{"Top":19,"TopLeft":18,"BottomLeft":30,"Bottom":31,"BottomRight":32,"TopRight":20},"blockedByRobber":false},{"id":10,"row":3,"posInRow":1,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[22,23],"Right":[23,37],"BottomRight":[36,37],"BottomLeft":[35,36],"Left":[21,35],"TopLeft":[21,22]},"vertices":{"Top":22,"TopLeft":21,"BottomLeft":35,"Bottom":36,"BottomRight":37,"TopRight":23},"blockedByRobber":false},{"id":11,"row":3,"posInRow":2,"type":"Forest","productionNum":5,"visible":true,"edge":{"TopRight":[24,25],"Right":[25,39],"BottomRight":[38,39],"BottomLeft":[37,38],"Left":[23,37],"TopLeft":[23,24]},"vertices":{"Top":24,"TopLeft":23,"BottomLeft":37,"Bottom":38,"BottomRight":39,"TopRight":25},"blockedByRobber":false},{"id":12,"row":3,"posInRow":3,"type":"Mountains","productionNum":9,"visible":true,"edge":{"TopRight":[26,27],"Right":[27,41],"BottomRight":[40,41],"BottomLeft":[39,40],"Left":[25,39],"TopLeft":[25,26]},"vertices":{"Top":26,"TopLeft":25,"BottomLeft":39,"Bottom":40,"BottomRight":41,"TopRight":27},"blockedByRobber":false},{"id":13,"row":3,"posInRow":4,"type":"Field","productionNum":8,"visible":true,"edge":{"TopRight":[28,29],"Right":[29,43],"BottomRight":[42,43],"BottomLeft":[41,42],"Left":[27,41],"TopLeft":[27,28]},"vertices":{"Top":28,"TopLeft":27,"BottomLeft":41,"Bottom":42,"BottomRight":43,"TopRight":29},"blockedByRobber":false},{"id":14,"row":3,"posInRow":5,"type":"Mountains","productionNum":8,"visible":true,"edge":{"TopRight":[30,31],"Right":[31,45],"BottomRight":[44,45],"BottomLeft":[43,44],"Left":[29,43],"TopLeft":[29,30]},"vertices":{"Top":30,"TopLeft":29,"BottomLeft":43,"Bottom":44,"BottomRight":45,"TopRight":31},"blockedByRobber":false},{"id":15,"row":3,"posInRow":6,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[32,33],"Right":[33,47],"BottomRight":[46,47],"BottomLeft":[45,46],"Left":[31,45],"TopLeft":[31,32]},"vertices":{"Top":32,"TopLeft":31,"BottomLeft":45,"Bottom":46,"BottomRight":47,"TopRight":33},"blockedByRobber":false},{"id":16,"row":4,"posInRow":1,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[35,36],"Right":[36,51],"BottomRight":[50,51],"BottomLeft":[49,50],"Left":[34,49],"TopLeft":[34,35]},"vertices":{"Top":35,"TopLeft":34,"BottomLeft":49,"Bottom":50,"BottomRight":51,"TopRight":36},"blockedByRobber":false},{"id":17,"row":4,"posInRow":2,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[37,38],"Right":[38,53],"BottomRight":[52,53],"BottomLeft":[51,52],"Left":[36,51],"TopLeft":[36,37]},"vertices":{"Top":37,"TopLeft":36,"BottomLeft":51,"Bottom":52,"BottomRight":53,"TopRight":38},"blockedByRobber":false},{"id":18,"row":4,"posInRow":3,"type":"Pasture","productionNum":4,"visible":true,"edge":{"TopRight":[39,40],"Right":[40,55],"BottomRight":[54,55],"BottomLeft":[53,54],"Left":[38,53],"TopLeft":[38,39]},"vertices":{"Top":39,"TopLeft":38,"BottomLeft":53,"Bottom":54,"BottomRight":55,"TopRight":40},"blockedByRobber":false},{"id":19,"row":4,"posInRow":4,"type":"Pasture","productionNum":5,"visible":true,"edge":{"TopRight":[41,42],"Right":[42,57],"BottomRight":[56,57],"BottomLeft":[55,56],"Left":[40,55],"TopLeft":[40,41]},"vertices":{"Top":41,"TopLeft":40,"BottomLeft":55,"Bottom":56,"BottomRight":57,"TopRight":42},"blockedByRobber":false},{"id":20,"row":4,"posInRow":5,"type":"Pasture","productionNum":10,"visible":true,"edge":{"TopRight":[43,44],"Right":[44,59],"BottomRight":[58,59],"BottomLeft":[57,58],"Left":[42,57],"TopLeft":[42,43]},"vertices":{"Top":43,"TopLeft":42,"BottomLeft":57,"Bottom":58,"BottomRight":59,"TopRight":44},"blockedByRobber":false},{"id":21,"row":4,"posInRow":6,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[45,46],"Right":[46,61],"BottomRight":[60,61],"BottomLeft":[59,60],"Left":[44,59],"TopLeft":[44,45]},"vertices":{"Top":45,"TopLeft":44,"BottomLeft":59,"Bottom":60,"BottomRight":61,"TopRight":46},"blockedByRobber":false},{"id":22,"row":4,"posInRow":7,"type":"Pasture","productionNum":5,"visible":true,"edge":{"TopRight":[47,48],"Right":[48,63],"BottomRight":[62,63],"BottomLeft":[61,62],"Left":[46,61],"TopLeft":[46,47]},"vertices":{"Top":47,"TopLeft":46,"BottomLeft":61,"Bottom":62,"BottomRight":63,"TopRight":48},"blockedByRobber":false},{"id":23,"row":5,"posInRow":1,"type":"GoldField","productionNum":3,"visible":true,"edge":{"TopRight":[51,52],"Right":[52,66],"BottomRight":[65,66],"BottomLeft":[64,65],"Left":[50,64],"TopLeft":[50,51]},"vertices":{"Top":51,"TopLeft":50,"BottomLeft":64,"Bottom":65,"BottomRight":66,"TopRight":52},"blockedByRobber":false},{"id":24,"row":5,"posInRow":2,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[53,54],"Right":[54,68],"BottomRight":[67,68],"BottomLeft":[66,67],"Left":[52,66],"TopLeft":[52,53]},"vertices":{"Top":53,"TopLeft":52,"BottomLeft":66,"Bottom":67,"BottomRight":68,"TopRight":54},"blockedByRobber":false},{"id":25,"row":5,"posInRow":3,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[55,56],"Right":[56,70],"BottomRight":[69,70],"BottomLeft":[68,69],"Left":[54,68],"TopLeft":[54,55]},"vertices":{"Top":55,"TopLeft":54,"BottomLeft":68,"Bottom":69,"BottomRight":70,"TopRight":56},"blockedByRobber":false},{"id":26,"row":5,"posInRow":4,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[57,58],"Right":[58,72],"BottomRight":[71,72],"BottomLeft":[70,71],"Left":[56,70],"TopLeft":[56,57]},"vertices":{"Top":57,"TopLeft":56,"BottomLeft":70,"Bottom":71,"BottomRight":72,"TopRight":58},"blockedByRobber":false},{"id":27,"row":5,"posInRow":5,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[59,60],"Right":[60,74],"BottomRight":[73,74],"BottomLeft":[72,73],"Left":[58,72],"TopLeft":[58,59]},"vertices":{"Top":59,"TopLeft":58,"BottomLeft":72,"Bottom":73,"BottomRight":74,"TopRight":60},"blockedByRobber":false},{"id":28,"row":5,"posInRow":6,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[61,62],"Right":[62,76],"BottomRight":[75,76],"BottomLeft":[74,75],"Left":[60,74],"TopLeft":[60,61]},"vertices":{"Top":61,"TopLeft":60,"BottomLeft":74,"Bottom":75,"BottomRight":76,"TopRight":62},"blockedByRobber":false},{"id":29,"row":6,"posInRow":1,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[66,67],"Right":[67,79],"BottomRight":[78,79],"BottomLeft":[77,78],"Left":[65,77],"TopLeft":[65,66]},"vertices":{"Top":66,"TopLeft":65,"BottomLeft":77,"Bottom":78,"BottomRight":79,"TopRight":67},"blockedByRobber":false},{"id":30,"row":6,"posInRow":2,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[68,69],"Right":[69,81],"BottomRight":[80,81],"BottomLeft":[79,80],"Left":[67,79],"TopLeft":[67,68]},"vertices":{"Top":68,"TopLeft":67,"BottomLeft":79,"Bottom":80,"BottomRight":81,"TopRight":69},"blockedByRobber":false},{"id":31,"row":6,"posInRow":3,"type":"GoldField","productionNum":8,"visible":true,"edge":{"TopRight":[70,71],"Right":[71,83],"BottomRight":[82,83],"BottomLeft":[81,82],"Left":[69,81],"TopLeft":[69,70]},"vertices":{"Top":70,"TopLeft":69,"BottomLeft":81,"Bottom":82,"BottomRight":83,"TopRight":71},"blockedByRobber":false},{"id":32,"row":6,"posInRow":4,"type":"Hills","productionNum":9,"visible":true,"edge":{"TopRight":[72,73],"Right":[73,85],"BottomRight":[84,85],"BottomLeft":[83,84],"Left":[71,83],"TopLeft":[71,72]},"vertices":{"Top":72,"TopLeft":71,"BottomLeft":83,"Bottom":84,"BottomRight":85,"TopRight":73},"blockedByRobber":false},{"id":33,"row":6,"posInRow":5,"type":"Hills","productionNum":4,"visible":true,"edge":{"TopRight":[74,75],"Right":[75,87],"BottomRight":[86,87],"BottomLeft":[85,86],"Left":[73,85],"TopLeft":[73,74]},"vertices":{"Top":74,"TopLeft":73,"BottomLeft":85,"Bottom":86,"BottomRight":87,"TopRight":75},"blockedByRobber":false},{"id":34,"row":7,"posInRow":1,"type":"Sea","productionNum":"1","visible":true,"edge":{"TopRight":[79,80],"Right":[80,90],"BottomRight":[89,90],"BottomLeft":[88,89],"Left":[78,88],"TopLeft":[78,79]},"vertices":{"Top":79,"TopLeft":78,"BottomLeft":88,"Bottom":89,"BottomRight":90,"TopRight":80},"blockedByRobber":false},{"id":35,"row":7,"posInRow":2,"type":"Field","productionNum":4,"visible":true,"edge":{"TopRight":[81,82],"Right":[82,92],"BottomRight":[91,92],"BottomLeft":[90,91],"Left":[80,90],"TopLeft":[80,81]},"vertices":{"Top":81,"TopLeft":80,"BottomLeft":90,"Bottom":91,"BottomRight":92,"TopRight":82},"blockedByRobber":false},{"id":36,"row":7,"posInRow":3,"type":"Mountains","productionNum":10,"visible":true,"edge":{"TopRight":[83,84],"Right":[84,94],"BottomRight":[93,94],"BottomLeft":[92,93],"Left":[82,92],"TopLeft":[82,83]},"vertices":{"Top":83,"TopLeft":82,"BottomLeft":92,"Bottom":93,"BottomRight":94,"TopRight":84},"blockedByRobber":false},{"id":37,"row":7,"posInRow":4,"type":"Mountains","productionNum":12,"visible":true,"edge":{"TopRight":null,"Right":null,"BottomRight":null,"BottomLeft":null,"Left":null,"TopLeft":null},"vertices":{"Top":85,"TopLeft":84,"BottomLeft":94,"Bottom":95,"BottomRight":96,"TopRight":86},"blockedByRobber":false}],"vertexInfo":[],"edgeInfo":{},"hexTileInfo":[],"piratePositon":1,"robborPositon":2,"verticesToHex":[[],[[1,"TopLeft"]],[[1,"Top"]],[[1,"TopRight"],[2,"TopLeft"]],[[2,"Top"]],[[2,"TopRight"],[3,"TopLeft"]],[[3,"Top"]],[[3,"TopRight"],[4,"TopLeft"]],[[4,"Top"]],[[4,"TopRight"]],[[5,"TopLeft"]],[[1,"BottomLeft"],[5,"Top"]],[[1,"Bottom"],[5,"TopRight"],[6,"TopLeft"]],[[1,"BottomRight"],[2,"BottomLeft"],[6,"Top"]],[[2,"Bottom"],[6,"TopRight"],[7,"TopLeft"]],[[2,"BottomRight"],[3,"BottomLeft"],[7,"Top"]],[[3,"Bottom"],[7,"TopRight"],[8,"TopLeft"]],[[3,"BottomRight"],[4,"BottomLeft"],[8,"Top"]],[[4,"Bottom"],[8,"TopRight"],[9,"TopLeft"]],[[4,"BottomRight"],[9,"Top"]],[[9,"TopRight"]],[[10,"TopLeft"]],[[5,"BottomLeft"],[10,"Top"]],[[5,"Bottom"],[10,"TopRight"],[11,"TopLeft"]],[[5,"BottomRight"],[6,"BottomLeft"],[11,"Top"]],[[6,"Bottom"],[11,"TopRight"],[12,"TopLeft"]],[[6,"BottomRight"],[7,"BottomLeft"],[12,"Top"]],[[7,"Bottom"],[12,"TopRight"],[13,"TopLeft"]],[[7,"BottomRight"],[8,"BottomLeft"],[13,"Top"]],[[8,"Bottom"],[13,"TopRight"],[14,"TopLeft"]],[[8,"BottomRight"],[9,"BottomLeft"],[14,"Top"]],[[9,"Bottom"],[14,"TopRight"],[15,"TopLeft"]],[[9,"BottomRight"],[15,"Top"]],[[15,"TopRight"]],[[16,"TopLeft"]],[[10,"BottomLeft"],[16,"Top"]],[[10,"Bottom"],[16,"TopRight"],[17,"TopLeft"]],[[10,"BottomRight"],[11,"BottomLeft"],[17,"Top"]],[[11,"Bottom"],[17,"TopRight"],[18,"TopLeft"]],[[11,"BottomRight"],[12,"BottomLeft"],[18,"Top"]],[[12,"Bottom"],[18,"TopRight"],[19,"TopLeft"]],[[12,"BottomRight"],[13,"BottomLeft"],[19,"Top"]],[[13,"Bottom"],[19,"TopRight"],[20,"TopLeft"]],[[13,"BottomRight"],[14,"BottomLeft"],[20,"Top"]],[[14,"Bottom"],[20,"TopRight"],[21,"TopLeft"]],[[14,"BottomRight"],[15,"BottomLeft"],[21,"Top"]],[[15,"Bottom"],[21,"TopRight"],[22,"TopLeft"]],[[15,"BottomRight"],[22,"Top"]],[[22,"TopRight"]],[[16,"BottomLeft"]],[[16,"Bottom"],[23,"TopLeft"]],[[16,"BottomRight"],[17,"BottomLeft"],[23,"Top"]],[[17,"Bottom"],[23,"TopRight"],[24,"TopLeft"]],[[17,"BottomRight"],[18,"BottomLeft"],[24,"Top"]],[[18,"Bottom"],[24,"TopRight"],[25,"TopLeft"]],[[18,"BottomRight"],[19,"BottomLeft"],[25,"Top"]],[[19,"Bottom"],[25,"TopRight"],[26,"TopLeft"]],[[19,"BottomRight"],[20,"BottomLeft"],[26,"Top"]],[[20,"Bottom"],[26,"TopRight"],[27,"TopLeft"]],[[20,"BottomRight"],[21,"BottomLeft"],[27,"Top"]],[[21,"Bottom"],[27,"TopRight"],[28,"TopLeft"]],[[21,"BottomRight"],[22,"BottomLeft"],[28,"Top"]],[[22,"Bottom"],[28,"TopRight"]],[[22,"BottomRight"]],[[23,"BottomLeft"]],[[23,"Bottom"],[29,"TopLeft"]],[[23,"BottomRight"],[24,"BottomLeft"],[29,"Top"]],[[24,"Bottom"],[29,"TopRight"],[30,"TopLeft"]],[[24,"BottomRight"],[25,"BottomLeft"],[30,"Top"]],[[25,"Bottom"],[30,"TopRight"],[31,"TopLeft"]],[[25,"BottomRight"],[26,"BottomLeft"],[31,"Top"]],[[26,"Bottom"],[31,"TopRight"],[32,"TopLeft"]],[[26,"BottomRight"],[27,"BottomLeft"],[32,"Top"]],[[27,"Bottom"],[32,"TopRight"],[33,"TopLeft"]],[[27,"BottomRight"],[28,"BottomLeft"],[33,"Top"]],[[28,"Bottom"],[33,"TopRight"]],[[28,"BottomRight"]],[[29,"BottomLeft"]],[[29,"Bottom"],[34,"TopLeft"]],[[29,"BottomRight"],[30,"BottomLeft"],[34,"Top"]],[[30,"Bottom"],[34,"TopRight"],[35,"TopLeft"]],[[30,"BottomRight"],[31,"BottomLeft"],[35,"Top"]],[[31,"Bottom"],[35,"TopRight"],[36,"TopLeft"]],[[31,"BottomRight"],[32,"BottomLeft"],[36,"Top"]],[[32,"Bottom"],[36,"TopRight"],[37,"TopLeft"]],[[32,"BottomRight"],[33,"BottomLeft"],[37,"Top"]],[[33,"Bottom"],[37,"TopRight"]],[[33,"BottomRight"]],[[34,"BottomLeft"]],[[34,"Bottom"]],[[34,"BottomRight"],[35,"BottomLeft"]],[[35,"Bottom"]],[[35,"BottomRight"],[36,"BottomLeft"]],[[36,"Bottom"]],[[36,"BottomRight"],[37,"BottomLeft"]],[[37,"Bottom"]],[[37,"BottomRight"]],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],"numTokenToHexTiles":[[],[],[7],[6,23],[18,35,33],[19,11,22],[5,8],[],[14,13,31],[12,32],[20,1,36],[2,3],[37]],"row":[4,5,6,7,6,5,4]},"dice":{"eventDie":"Ship","yellowDie":6,"redDie":6,"productionDiceSet":false},"diceRolled":false,"bank":{"match":"~users~Emol2~match"},"longestRoad":0,"phase":"SetupRoundOne"}},"Emol3":{"name":"Emol3","color":"YELLOW","VP":0,"resourcesAndCommodities":{"Lumber":0,"Brick":0,"Grain":0,"Ore":0,"Wool":0,"Gold":2,"Cloth":0,"Coin":0,"Paper":0},"progressCards":[],"progressCardsCnt":0,"buildings":{},"roads":[],"ships":[],"harbors":[],"knights":[],"cityImprovement":{"trade":0,"politics":0,"science":0},"tradeRatio":{"Lumber":4,"Brick":4,"Grain":4,"Ore":4,"Wool":4,"Cloth":4,"Coin":4,"Paper":4},"longestRoad":0,"cityWallNum":0,"maxSafeCardNum":7,"match":"~users~Emol2~match"},"Emol4":{"name":"Emol4","color":"GREEN","VP":0,"resourcesAndCommodities":{"Lumber":0,"Brick":0,"Grain":0,"Ore":0,"Wool":0,"Gold":2,"Cloth":0,"Coin":0,"Paper":0},"progressCards":[],"progressCardsCnt":0,"buildings":{},"roads":[],"ships":[],"harbors":[],"knights":[],"cityImprovement":{"trade":0,"politics":0,"science":0},"tradeRatio":{"Lumber":4,"Brick":4,"Grain":4,"Ore":4,"Wool":4,"Cloth":4,"Coin":4,"Paper":4},"longestRoad":0,"cityWallNum":0,"maxSafeCardNum":7,"match":"~users~Emol2~match"},"Emol1":{"name":"Emol1","color":"ORANGE","VP":0,"resourcesAndCommodities":{"Lumber":0,"Brick":0,"Grain":0,"Ore":0,"Wool":0,"Gold":2,"Cloth":0,"Coin":0,"Paper":0},"progressCards":[],"progressCardsCnt":0,"buildings":{},"roads":[],"ships":[],"harbors":[],"knights":[],"cityImprovement":{"trade":0,"politics":0,"science":0},"tradeRatio":{"Lumber":4,"Brick":4,"Grain":4,"Ore":4,"Wool":4,"Cloth":4,"Coin":4,"Paper":4},"longestRoad":0,"cityWallNum":0,"maxSafeCardNum":7,"match":"~users~Emol2~match"}},"match":"~users~Emol2~match","gameScenario":"Heading For New Shores"}');
    
    // template for user
    var fakeUser = window.fakeUser = {
        resourcesAndCommodities: {"Lumber":0,"Brick":0,"Grain":0,"Ore":0,"Wool":0,"Gold":2,"Cloth":0,"Coin":0,"Paper":0}
    };

    // on page load, join room
    sock.emit('JOIN_ROOM', roomId);

    //test data
    //for now, assume player choose this map
    let mapConfig = {'scenario':'Heading For New Shores'};
    sock.emit('MAP_CONFIG', mapConfig);

    // when sock disconnects and reconnects, join room again
    sock.on('reconnect', function(){
        sock.emit('JOIN_ROOM', roomId);
    });

    // upon successfully joined room, server will send back a message
    sock.on('JOIN_ROOM_SUCCESS', function(msg){
        let room = CircularJSON.parse(msg);
        app.room = room;
        // app.setMy();
        console.log(room);
    });


    sock.on('NEW_PLAYER_JOINED', function (msg) {
       //alert('NEW_PLAYER_JOINED');
       //change ui
    });

    sock.on('GAME_START', function (msg) {
        alert('Game start');
        //entry point for max's code

    });

   sock.on('TAKE_TURN', function (msg) {
        alert('Take turn');
        $("button").removeAttr('disabled');
    })

    
    




    // ----------------------------- View Layer ----------------------------- //

    var app = window.app = new Vue({
        el: '#page',
        data: {
            me: myObj,
            my: fakeUser,
            room: room,
            logs: [
                { user: null, action: 'The game starts.' },
                { user: 'Yuan', action: 'places a city.' },
                { user: 'jack', action: 'places a road.' }             
            ]
        },
        mounted: function(){
            $('body').showV();
            adjustUI();
            console.log('mounted');
        },
        updated: function(){
            console.log('updated');
            adjustUI();
        },
        filters: {
            capitalize: beautify.capitalize
        },
        methods: {
            // make 'my' point to my object inside users
            setMy: function(){
                var my = this.room.users[myObj.username];
                if (my) this.my = my;
            },
            // save match
            save: function(){
                Toast.show('Saved!');
            },

            // continue previously saved match
            open: function(){
                Toast.show('Open');
            },

            // quit match
            quit: function(){
                Toast.show('Match ended!');
            },

            // append to log
            log: function(user, action){
                this.logs.push({ user, action });
                NextTick(function(){
                    $('#log').scrollTop($('#log')[0].scrollHeight);
                });
            }
        }
    });

    // adjust UI when resize screen
    function adjustUI(){
        // adjust system log height
        $('#log').outerHeight($('#right-screen').height() - $('#users').outerHeight() - $('#match-opts').outerHeight());
    }
    $(window).resize(adjustUI);















    //game stuff, maybe move to another js file later
    //here are just tests, call the functions when the certain button is pressed.
    //sock.emit('rollDice', roomId);









    //sock.emit('LOL');



});