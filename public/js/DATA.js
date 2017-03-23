/**
 * Created by emol on 3/7/17.
 */
let DATA = {};
//DATA defines some helper getter functions

/**
 *
 * @return {Match}
 */
DATA.getMatch = function () {
    return app.room.match;
};

/**
 * @return {Player}
 */
DATA.getMyPlayer = function () {
    return DATA.getMatch().players[myObj.username];
};

DATA.getPlayer = function(username){
  return DATA.getMatch().players[username];
}

/**
 *
 * @return {Map}
 */
DATA.getMap = function () {
    return DATA.getMatch().map;
};

/**
 *
 * @param id {int}
 * @return {*}
 */
DATA.getHexTileById = function (id) {
    return DATA.getMap().getHexTileById(id);
};


//get raw form, so it's easier for debugging in console
//so in console, to log out an object, for example a match, just type: DATA.getMatchRaw()
_.each(Object.getOwnPropertyNames(DATA), function (fnName) {
    DATA[fnName + 'Raw'] = function () {
        return Raw(DATA[fnName]);
    }
});
