// This file contains some helper functions needed by both
// chat/messaging.js and model/message.js

var _               = require('underscore');
var _s              = require('underscore.string');
var asyncReplace    = require('async-replace');
var fs              = require('fs');
var crypto          = require('crypto');
// var usage           = require('usage');



// contains functions we are exporting, h stands for helper
var _h = module.exports = {};



// save drawing to an image file on-disk
function saveDrawingToDisk(dataURL, callback){
    callback = _.isFunction(callback) ? callback : function(){};
    if (!dataURL) { callback(false); return; }
    var regex = /^data:.+\/(.+);base64,(.*)$/;
    var matches = dataURL.match(regex);
    if (!_.isArray(matches) || !matches[1] || !matches[2]){
        console.log('Invalid dataURL:', dataURL);
        callback(false); return;
    }
    var ext = 'png';
    var data = matches[2];
    var buffer = new Buffer(data, 'base64');
    var random_string = (Date.now() + Math.random()).toString();
    var filename = crypto.createHash('md5').update(random_string).digest('hex');
    var filepath = '/drawings/' + filename + '.' + ext;
    fs.writeFile('./public' + filepath, buffer, function(err){
        if (err) { console.log('save drawing to disk err', err); callback(false); return; }
        callback(filepath);
    });
}

// return the index of the message that is sent before a certain time, using binary search
function indexOfMessageBefore(arr, time) {
    'use strict';
    var minIndex = 0;
    var maxIndex = arr.length - 1;
    var currentIndex;
    var currentElement;
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = arr[currentIndex];
        if (currentElement.sent < time) minIndex = currentIndex + 1;
        else if (currentElement.sent > time) maxIndex = currentIndex - 1;
        else return currentIndex;
    }
    return currentIndex;
};

// convert to radian
function toRadians(n){
    return n * (Math.PI / 180);
}


// fake users array
var fake_users = ["placidheart","shakevein","switch_thrill","poor_collar","next_sky","peeptrail","cheap_tray","printrail","uppity_self","yawnspoon","floatsnake","leave_salt","delay_game","cuddlymagic","silly_test","stiffneedle","uneven_skin","crushice","faxgrowth","sealmusic","mandad","hateeggs","taboobeggar","chief_army","versedbears","purplecart","causenerve","huskytoad","kaputharbor","spicy_song","sweepburst","revisehumor","causebee","brakegrip","pumped_bone","soreplants","flat_toad","jazzy_garden","curve_loaf","goknot","launch_yarn","helpbulb","priceycobweb","crash_metal","female_sock","unused_join","faultymitten","shake_border","drunkstitch","plucky_giants","irate_design","rebelsponge","hidehumor","ride_drum","lean_street","listen_comb","remove_thing","superb_smash","ritzyshoes","barestream","spingrass","buzzsheet","slaysmile","stir_school","render_plough","ultra_honey","dryincome","fancy_boot","rigidzinc","windybasin","cloudy_shape","better_flight","noisy_clock","brash_bit","grubby_drug","staintable","gripstick","tall_end","elitecoast","slowactor","homely_anger","leaparm","narrow_eye","trite_anger","nesthose","upbeat_chalk","exciteguide","bumpyrail","dampsugar","flowerrate","smellyhouse","park_hook","bow_pest","speedsquare","saveerror","handface","mushy_end","roughpaint","fivetooth","blow_place","loadwood","wrong_fight","attain_minute","reignnoise","wash_ticket","tradeocean","fresh_sail","fight_patch","ragged_idea","broadlinen","thank_meal","tradecars","forgetsnakes","join_arm","salty_turkey","pay_range","sortlimit","plainkettle","grubby_writer","sing_tank","jumpy_coal","accept_street","femaleground","changerose","tickle_scale","nine_print","squash_babies","glowcow","handle_vessel","floatvan","slimy_expert","spicystop","little_hair","desertfeet","modelwinter","lightlace","holdbottle","divide_verse","shutgun","milkmark","earthyhour","twist_spy","sneaky_home","own_pump","spoil_rod","runriver","caringsystem","follow_drawer","jazzy_finger","smellysteel","witty_deer","grumpyhorses","hungry_nut","serve_linen","dependtongue","nail_amount","mean_end","eager_kettle","seewaves","blacklight","brainylake","supercake","shear_profit","bright_scent","sleepyparty","bewing","clearloss","scrublead","hurtseed","listfeast","trustgoat","oddkick","report_hammer","shaggyparty","ridtax","abjectglove","fine_fog","be_trip","stainbeggar","yellow_top","strikefriend","betterpies","planstream","raspyvein","upbeat_boys","salty_finger","jolly_wheel","shop_whip","extend_cough","calmpain","trick_laugh","tangyhole","x-rayglass","super_note","revisebat","dampjump","sharpapples","strike_lumber","nosy_badge","behaveminute","secretfoot","gatherdoll","poisedday","drain_fire","gaping_bells","dreambrass","pushy_house","busy_snail","six_shelf","oafishmetal","steepcats","likehorses","darkwriter","inlay_fight","cuddly_thrill","end_story","flingact","ready_bit","hurt_zinc","coil_detail","daffy_smoke","fail_patch","battleshow","poised_heat","mushyroute","jumpycast","early_eye","dullbucket","spooky_ear","parkbait","heal_title","knottyrake","lefttoes","objectbrush","short_monkey","bored_scale","sore_show","rubmatch","springthumb","swiftteeth","happypail","presssmash","aback_board","clingship","time_soup","judge_zebra","share_meat","govern_beef","uppity_regret","beat_spade","easy_thumb","rhymepear","direct_needle","drag_rake","superb_frogs","adevent","lying_need","raggedinsect","copyknot","brake_cook","heady_tiger","dear_park","busy_action","relax_book","dampcakes","odd_death","print_pie","overtpies","grind_base","lean_trick","minorincome","tame_cord","clever_stove","budget_leg","husky_group","sighriddle","tell_horn","blue_things","teasepocket","latefamily","turnnut","itchbabies","easy_minute","assureiron","smile_shop","rare_nut","kickband","cooingwhip","priceymonth","bangstew","pray_sheep","dropmice","robustamount","brushcord","secure_celery","absentwall","fierce_body","glowberry","fluffywax","manball","greasy_cart","quietlaugh","chase_wood","pop_twist","earnteeth","nutty_reason","unique_school","tease_wool","fearlimit","rainypin","wishtalk","stitch_need","killpie","scarce_tax","sloppy_frogs","royal_smell","payshop","glossytray","sordid_gold","witty_view","wittysnakes","assist_blow","frame_war","race_fork","jadedevent","agree_list","foamy_sugar","flimsy_water","floatmonkey","poor_tax","chillyhole","loud_record","sleepy_bee","hurt_able","stingystory","worrycanvas","ignoreturkey","fuzzyneck","spray_orange","bubblebeast","safe_icicle","nullsmash","meddle_size","five_frame","dependfruit","trite_place","copy_desire","brainy_beds","cravenstone","wholeevent","listhouses","brief_dime","spicy_table","pricklinen","lightthrone","screw_need","melt_snail","print_sky","fatseat","attendevent","badhorn","sordid_rain","jokeiron","handcolor","relaxspace","matterfifth","charge_insect","joyousnews","quirky_dinner","wringsack","juggleedge","dripcub","shearerror","lightrain","rural_lunch","pedal_bag","needyteeth","truepage","squash_pain","kindlybeggar","unableriver","phone_veil","busygrowth","wander_mask","nimble_zoo","tidynet","scaryloaf","fat_church","living_birth","knock_tramp","rapid_basin","manbox","wearkite","trashypaste","buzz_pear","legalducks","stitch_iron","filthy_can","faded_mouth","versed_bears","tense_park","knownscene","jadedcurve","fainthen","gusty_roof","clap_clouds","wry_system","tripself","pointthing","pass_sugar","rustic_joke","tamefeet","becomecub","ablaze_plough","funny_wind","public_ducks","hold_class","savory_throne","somberbomb","dream_wood","win_coach","lewdsnakes","weavebutton","kneel_tent","smoggystraw","tame_space","meekmeal","soggy_waves","stiff_grass","spendcakes","bawdygrowth","open_thread","stormywealth","chubbyeye","saltycrook","keen_angle","borrowshape","jokecattle","stick_finger","tieday","pickcrib","callpet","press_back","feelrecord","sting_wash","splitguide","tumble_arm","inlay_cook","warm_yard","whippull","grow_shock","bawdyrobin","commonline","tawdrycast","delay_order","frypaper","zestyrecord","mugpen","hauntboat","fancypull","feelbells","foamycredit","decide_act","erectfight","lie_battle","sneak_veil","late_start","dealcurve","hammerclouds","coolcast","placid_rake","ajar_cork","furryheat","tumble_spoon","thinbushes","guardsnail","guess_quill","wink_cow","chiefquiver","supplycrib","adviseliquid","tawdryskin","relax_throat","giveburst","lean_heart","assurewhip","windysilver","pushygun","show_banana","stalepail","burstday","absentexpert","marry_war","tutor_straw","last_design","greenocean","weary_nest","hardring","handyact","coverkick","foamy_match","neat_ground","boreprose","divert_fish","creeptree","white_cloud","pink_spade","clean_gun","digdrug","eightdesign","damphat","cost_regret","spread_stream","extendwrist","abruptseed","help_credit","tight_star","budget_mass","dirtymatch","listenboats","vanish_icicle","hardnorth","sharpbubble","unable_bell","purple_giants","fax_heart","sweepgrowth","tangyangle","handynews","light_hook","obey_jewel","whip_mother","grindwheel","halfcord","rushroll","lively_sponge","mushyleaf","secretdrop","faded_rub","stupid_love","misty_ink","misty_memory","melted_face","smoke_show","lovely_jar","alive_canvas","lively_lake","blushrain","alike_doll","icyporter","blink_kitty","gustystamp","clumsy_ship","daredock","shinewish","eagerprice","packwindow","cheatfear","settleyak","paltry_eyes","wobblepet","mistytax","cast_look","sling_gold","lose_space","wave_flesh","black_beggar","curlwrench","washelbow","speed_range","knowsound","plainwhip","stufftown","wave_police","polite_brass","poisedturn","know_writer","branchfuel","pushysense","planteyes","fire_hour","sign_pets","cross_size","pilot_twig","cruelbait","skinnymass","deeppear","plain_dress","blink_paper","pushyland","future_desire","hatelumber","ridehope","lifted_potato","rulemarble","truebears","ablazeprint","fouryard","detect_cave","tested_beef","acridcircle","normalwriter","rigidorder","deeply_hat","eageralley","trickybaby","teachrule","pausesilk","eagercord","prettycable","paltryanswer","safewing","reason_neck","attainjewel","doubt_parcel","roll_paste","tackyalley","lively_tree","testedcollar","unique_whip","boastbranch","spottyfowl","grab_flavor","pay_flower","eatsoap","silenttemper","salty_spade","bless_walk","sore_smash","grubbysuit","checksense","joke_roof","fresh_toy","runsound","murderpocket","obey_cable","homely_food","tamekitty","smellycoat","workrock","proveprose","updateevent","thickbone","prickleg","cutevan","poke_water","freesalt","knownboat","lovingrod","preach_father","yummy_chalk","writeinsect","lean_hand","cuddlyfowl","judge_shame","hide_mother","secure_boys","feeble_reason","smartbeggar","keptcattle","tamewalk","coldshoe","blind_laugh","meddleleg","young_spade","ownpocket","wet_design","unitetax","drive_peace","richtable","smash_kiss","wrapbit","awful_front","dropmeat","small_range","sealhall","poisedfather","selldirt","clammy_spy","juicy_slip","ask_marble","intendapples","third_screw","tutorshow","funnystore","startwar","juicygoat","talkarch","zesty_game","frail_crib","curl_flame","acrid_patch","two_bone","updatewheel","gratis_bit","lickcurve","puttrains","fatrate","grease_drug","acidpigs","cry_bead","bind_care","bleach_basin","actedlove","spiffyeggs","fadedmove","budgetzephyr","report_wind","wind_bear","plugcrook","gazefarm","crackharbor","superblist","x-ray_spade","ablazecable","gifted_shade","nastylow","fillmother","obeyparcel","petite_man","helpcork","funny_sofa","bare_trees","screw_hat","evenhumor","craven_hole","peck_blade","manage_bushes","desertcheese","first_camp","harsh_snake","formbutton","whirl_friend","pedalsleep","tastebikes","macho_snails","greasy_floor","seektrip","lickloaf","muddle_linen","sweet_beetle","teach_rabbit","liftedart","wavethroat","sketchhope","attackfeast","fairhour","solid_muscle","marry_flame","stainowl","drumcurve","youngfield","snatch_low","pack_base","scare_note","adoptthroat","opentub","awfultruck","swearalley","testedsuit","quaintclocks","absurdcomb","wantscarf","jumpypet","quitcanvas","swim_cactus","chiefpets","swear_van","feeble_bell","thirdlow","cruel_park","pleadwindow","combwriter","snatch_hill","winedge","press_year","ahead_butter","bright_nerve","riseberry","broad_fall","groan_heart","divewax","harshcrowd","crazypump","tread_yam","little_rifle","ignore_mother","tipmask","headywhip","grabname","burlyyard","gazekitty","bidhammer","firsttrip","firesoap","itchycanvas","racialcan","informbrick","craveneffect","heady_basket","slap_shade","bombsugar","boildetail","readycomb","buyfish","wrydress","nastyspy","kindlybase","groovyword","forego_stitch","muteeyes","dapper_shelf","superbfield","goodrose","draberror","finestage","rotten_market","greedy_beast","gratissquare","nimble_sand","shake_friend","smellywrench","breaksmile","framesheet","fuzzyclocks","milk_paint","shrugbrain","scream_queen","lush_dime","suit_branch","grateporter","hot_paste","keenearth","alertroot","mutescene","tacitwomen","editedmilk","right_car","graybeds","weak_button","blind_verse","overt_berry","handyeffect","warm_quartz","book_work","enter_board","blow_shade","swift_chance","spread_profit","landcrate","clear_duck","taboo_woman","repeatturn","wishowner","inform_whip","poised_answer","jogwound","swearfather","dressstone","nosy_soup","simpleview","stare_plate","assessnumber","mixedattack","lying_sugar","stuffdonkey","carve_dolls","hurryhammer","dizzypush","goofyheat","two_chair","like_battle","curved_comb","fixedapples","jokegirls","untidycup","mistyfarm","tense_house","ripefather","aloofmom","trade_steel","naive_soup","clear_body","bawdylinen","ledhen","led_smash","longyarn","sad_harbor","addstring","bleedthumb","untidy_hole","lumpybird","attach_rail","milkyhand","bleedfoot","bookgold","rainroom","modernglove","lazylist","hammer_frog","sourflight","empty_coal","purple_snow","remindcrook","gaping_tree","crabbybottle","wave_roof","skinny_trucks","wash_tub","moanbrick","briefbase","shiver_system","smite_floor","plain_way","soothetable","happyvest","modelloss","burly_title","dull_lace","mighty_gun","cutsound","unlockice","print_shelf","tallhair","rattyblade","uniquelake","fairsuit","sawmetal","tritecap","yummy_dress","sweatflame","petiterose","dapper_coal","ritzyghost","jagged_snails","trainsort","yummy_beef","alert_soup","towplane","printpan","flashyrule","wreck_balls","knockdime","farcable","elitebears","work_kick","openrod","deeply_smoke","luckyfight","full_prison","meltedform","ruralyard","loud_voice","bakefall","clean_spy","cost_lock","awarerecord","teeny_talk","teach_bomb","pedalmagic","glossybee","wink_death","cut_credit","quitelbow","caringhot","hope_back","odd_use","sweeppigs","crash_hose","chilly_train","goofy_song","create_branch","good_alley","white_meal","wisepear","greasy_box","raspy_brain","like_toe","aboard_kitty","curl_jewel","melted_clocks","hollow_bead","seek_shop","snatchpump","silkyspade","racialflavor","sturdy_zipper","sour_door","adaptscale","run_weight","cycle_stick","cycle_debt","verify_toys","chop_coal","endurebike","alikesock","adviserule","lock_hammer","matter_cars","dizzy_apples","lewd_bottle","target_feast","newgeese","causedrum","draft_turkey","burystep","soft_music","cool_women","untidy_space","rare_rate","lazy_rat","lively_water","noisy_salt","messy_snail","ajar_church","clean_bells","fixed_end","joyouscough","labelwrist","sort_mice","chew_crush","raise_boat","crabby_army","little_bear","longfang","brief_bone","clumsydonkey","smash_plants","quaintcow","white_limit","sniffstew","arrestorder","calmcork","weakcows","trickycanvas","plughammer","spread_snails","clap_glass","land_dirt","occur_market","meltbomb","sawcherry","workfaucet","drink_eggnog","cruellocket","moor_turn","yawnlight","attach_color","wave_pig","proudpowder","stiff_shoes","stupid_kick","polish_boy","cough_basin","squeak_weight","makelake","creep_move","pour_pencil","spiffyfog","tabooburn","trashysoap","refuse_knife","amusedtaste","buildrain","thrustcause","shutincome","raise_animal","send_memory","liftedbath","livekettle","scaryhammer","switchwriter","paltryyam","hurtword","tart_space","solid_pain","callriddle","sneakyjewel","devisepest","soak_train","crush_can","groovyforce","tacit_cable","tasty_silk","branch_paste","long_swing","mate_sheet","true_cup","suffer_bite","unrulyrhythm","crabby_winter","punish_aunt","brush_grape","silent_ink","mug_scale","meltdrawer","speak_rest","alivearm","twistprofit","tested_beam","dependsound","trashydress","royalshade","arisecord","illneck","quick_finger","marryqueen","markrub","zany_birth","flyrings","trick_money","sprout_mask","jogpark","laughslope","amuseminute","rapidnews","wigglysummer","needoil","curve_body","supplypizzas","wisehealth","gamysystem","whirl_band","cageytrucks","wander_police","induce_change","red_anger","drinkparent","funnygrowth","cutecoal","happenpie","naivelead","beatoven","fixed_babies","coach_middle","null_expert","better_girl","floatcow","meatycrib","wed_bee","curve_jam","laughloss","tartlinen","hot_title","poke_babies","supersea","begbirth","trade_ticket","findlove","faultyspring","ready_pail","weary_dolls","tearskate","thrive_bomb","betteredge","polite_card","fancy_stream","praypump","hammerhands","cute_waste","lowly_trade","flashnoise","excitesea","five_coast","occurship","ultra_brass","treathorses","little_donkey","square_cars","selectgirl","dizzyfang","four_step","sloppycoil","prove_sort","march_wool","speedcows","show_desk","overdotime","dearfarm","murky_bear","rapid_shoe","marry_seed","besetrain","normal_crack","rank_goose","filthyview","squeal_stone","provecub","ultrastar","hidedoctor","catchcast","hardtent","acceptoffice","unify_pull","cruelroof","buy_beds","abackwrist","stepmoon","dullsteam","nimble_clouds","learn_ice","clumsypen","adviseprint","ovalgoose","studycloth","prefer_sheep","sturdystew","elated_rail","stopguitar","wedspoon","simple_vest","purple_rod","pourheat","brush_earth","bestwood","stuffsmile","scaredrule","insurepolish","shygrape","springkick","equal_bun","dealflock","rescue_trees","turnwood","marryfriend","sense_fifth","smashbooks","pat_train","soreboard","strikeoil","furryflock","coil_basket","remind_end","bend_effect","toughbone","white_prose","scorchshelf","emptybrain","bet_pipe","settledrink","polite_coast","sneakstew","sackpot","superb_trees","geterror","frame_swing","irate_sand","learnstem","feed_food","allow_lip","petitedrink","kill_cellar","lastorange","trotactor","formcomb","hangview","march_song","steady_parent","slip_frogs","swanky_beam","untidy_wire","hopshake","melttrick","wailsmoke","spread_angle","paddle_self","godly_toes","niftylip","screwlow","ajar_pail","batsnails","livingskate","spin_crayon","acid_love","happen_soup","rustic_hair","latecat","squareshirt","form_memory","eveneye","cut_motion","lonelycomb","sweethouse","youngcobweb","shyroot","sigh_bee","chubby_sleep","leave_drug","sealskate","meltedact","hollow_prose","wateryhour","rightclouds","set_match","lie_reason","obtainturn","hold_stem","fence_wheel","dustychair","rapid_cactus","narrowsmile","squeal_turn","dustcelery","decaybell","amuse_copper","wait_babies","campfowl","robust_hose","scaryblow","plantzebra","employlinen","cure_guide","crytheory","madly_teeth","mugiron","lumpyflower","lively_death","scorch_sail","point_stick","makekitty","sore_month","jam_swim","signal_wrist","printoven","plead_crush","silentfriend","proud_grade","careeyes","redtail","high_sense","sharpfinger","clean_farm","wantsock","tawdry_blade","kindly_tramp","salty_house","excusewalk","tumblerun","gratecable","reduce_teeth","sick_sand","reducehammer","darkmint","deepteam","deep_actor","sing_parcel","jaggedgroup","upbeatvan","adoptbomb","shinesleep","jokewalk","boxoffice","gusty_sock","fastenline","signtent","raspywave","bluetheory","needuncle","patcrayon","ajarloaf","simplerate","tan_air","lightstream","breedbody","noisyswim","ripe_legs","yellowpoint","marchcloth","marry_edge","notice_alley","smokezephyr","dustywash","ban_ants","manageeggnog","plantdock","stay_bells","stroke_coast","strap_look","fastlunch","repair_truck","fair_dog","hit_bird","hotpot","equal_mass","arise_thumb","loosepigs","bloody_error","steepfather","tense_voyage","lethalfight","groansnakes","squarethrill","brainypaper","largeaunt","cooing_father","dream_vein","sawdegree","start_rest","tricky_shop","fold_tax","wring_horn","walkdoor","curlymitten","irate_skin","bigspy","shinyiron","fierce_ticket","praymagic","ridesponge","bearborder","mellow_faucet","mateidea","rock_train","saw_zipper","carve_verse","seemlyfifth","wetschool","meaty_design","obtainrhythm","costscrew","form_spy","speak_middle","ensureanswer","thinbooks","sordid_love","ratty_birth","head_board","soggy_marble","plucky_loaf","measly_horse","fastdebt","watchfloor","tutornumber","kissmusic","curlypencil","cut_copper","quirky_spot","abaft_glue","chunkytiger","detectcave","prefer_word","nicetwist","slip_trucks","quitgeese","woozyring","trickwren","unruly_gold","guessbottle","nifty_skin","future_cat","tippigs","roomy_teeth","meaty_celery","readyhouses","dreary_grass","ruddybike","wiseboard","updatesort","dryspace","paybed","stare_slave","orangelake","ownspot","wittymist","warytrade","wry_soda","cleanroot","sharp_degree","pullhope","empty_bat","slit_kiss","mine_quill","puny_waste","ruinring","pinkthrone","askbikes","sleepy_wool","knockring","sick_price","heapsun","wail_pipe","head_fold","obtain_sugar","plancave","talkthrone","employrule","push_men","racewheel","drip_pull","feartongue","shoeyard","reject_camera","fivecrack","longsheet","load_game","report_girl","flycrush","long_sponge","obtainstar","followcakes","beam_button","toughedge","wacky_coat","hotlunch","near_talk","quaintgoose","deep_maid","stiff_rain","raggedscrew","lumpy_rat","obtainbadge","searchcattle","reducemusic","carve_clover","enduremarble","travel_pot","rural_seat","intend_range","divertdock","drink_smile","wickedwood","grinmice","creepyboat","phone_hole","pushy_zoo","wish_person","boring_sand","amused_nose","cool_rabbit","gentle_yarn","arise_jar","turn_jail","stale_drum","cruel_mice","matedegree","sneezebubble","fancyjump","wring_clover","quack_zebra","tap_dust","attainspot","broad_apple","put_finger","senseforce","groovy_bottle","bad_town","bindbooks","cold_nerve","oddreward","elatedself","shop_father","pilotfather","usedsneeze","eagerthumb","coachapples","cloudy_dogs","torpid_stem","waryfifth","listpoison","lock_pets","spiffy_pig","pleasewriter","wooden_aunt","clearboys","young_pocket","filejoin","milkspy","sweep_book","lovingwrist","puffysummer","thawlawyer","screamsystem","groan_skin","poised_dogs","glow_zephyr","abrupt_page","slimysoda","shinybirth","paste_toes","silly_toes","change_shirt","roll_rings","set_shock","famous_degree","begin_walk","earthybadge","firstrule","ill_writer","windy_grass","even_move","torpid_idea","pinkverse","call_stew","expand_crime","bluestone","fleesummer","ahead_mouth","drown_curve","serve_coast","busy_waste","employ_bushes","wicked_note","shut_crayon","search_view","one_basin","tacitevent","admit_ear","sordid_lip","uphold_pan","sneak_breath","waitmatch","squeakair","roomyburst","sink_branch","staredad","coilnorth","shareborder","unite_stem","half_guide","hold_tail","classy_yoke","beam_bit","famousattack","smooth_voyage","acidic_skin","permitpain","amusedforce","awake_fruit","dive_force","squash_reward","chargepatch","petitewire","fetchpaste","travel_fan","cut_pan","tameshade","mere_zephyr","silly_string","feel_income","clearskin","zestybat","tacky_act","sourcanvas","formburst","burst_time","wash_week","zipfloor","easycloud","cravenslope","chartedge","buyable","forego_month","empty_mouth","advise_cover","four_crow","sudden_pump","lushbutton","review_judge","clumsygroup","framesalt","own_clover","brush_jeans","stingyicicle","bentzipper","purpleburn","crazy_seat","happen_power","judge_desire","cause_boy","sordid_hair","warybikes","smash_tub","lose_war","nappylinen","relate_lace","redriver","orangeharbor","good_music","guardbead","fade_brake","dress_curve","unify_knot","hurry_stitch","bleach_trucks","halfvest","stupidsugar","share_club","heatbears","copy_burst","right_profit","fix_money","groovytest","crysea","rottenmatch","dreamshow","nest_fly","steer_angle","dressspring","drain_hammer","weave_toes","flimsy_verse","pullclub","homely_coast","hoverquartz","crabbychange","chasebody","shrinkwinter","innateapple","dark_match","careeggnog","faultymonkey","zestyplanes","dusty_kettle","sneeze_shock","softtooth","spelllook","sharp_lamp","legal_pest","screwroof","dusty_kite","heat_rock","steep_knot","obese_plant","superb_voice","dirty_dogs","subletknife","help_school","tart_kite","stingyslave","fast_snake","pumpedrun","entertoys","tallroad","shake_duck","lead_grape","swanky_part","extendlawyer","whole_prison","cuterings","stinksleep","zonked_test","buybear","dance_value","watchweek","bubblehole","pausepin","abaftworm","violetwar","far_jam","pricey_print","faintspot","exotic_rice","last_friend","tacky_robin","fancyplanes","win_thumb","rare_prison","sneakydegree","strapbells","mere_door","jagged_cat","unique_cloth","packbat","soggyhat","hand_balls","directlunch","halfburst","stampgirls","march_voyage","cycle_thrill","square_train","roll_table","accept_desk","moldyscale","logoil","known_town","dapper_hand","shoeday","abrupt_cannon","tie_lunch","messytoe","settle_hands","busystore","referyear","led_heat","visitlumber","sable_scale","small_cook","lumpy_income","payshake","lying_yarn","stroke_trucks","obtain_prose","joinfowl","blow_stick","null_fold","setnet","rich_hot","sketchbite","calm_basin","flood_skin","rob_flesh","admit_girls","realday","wirycelery","please_blade","blushedge","ugly_moon","zonked_pencil","admit_toys","full_base","love_drug","hushedoffer","sturdyfan","weigh_voyage","faint_egg","provebadge","hammer_duck","rescuegrip","trustcub","repair_rest","kind_heat","petite_nerve","breezy_goose","fool_sort","relyoffice","utter_toes","sound_plant","purplecare","wreck_writer","quickkiss","landbirth","winkfang","gliblead","lyingroll","biteact","nastychess","cyclestep","plead_error","elated_linen","burly_spy","tourinsect","beginroot","saltyverse","bid_place","flashybrake","foamymonkey","mixed_place","cut_nation","obtainbeef","grayberry","sulky_ground","slide_person","farhook","wear_apple","greetyarn","switchrain","name_day","knotty_match","tour_salt","eager_system","nine_tank","dear_hands","fear_sofa","bestyak","new_pipe","squarestream","shave_boat","first_front","mixedballs","soak_trail","preachplot","exoticcherry","ultrashame","public_basin","boringship","loudmagic","break_look","dull_ticket","silent_trucks","bad_ring","soothe_field","carry_balls","spotty_mask","vulgarline","stride_fall","carryzephyr","shakycollar","slim_celery","tight_book","able_bears","godlyapple","silent_able","nailoil","belong_pies","bitter_yard","chargeanswer","readyflesh","batkick","staresnails","full_book","tumblemouth","stupid_hot","chief_worm","snatch_prose","sow_watch","muddlecrack","miss_waste","silentson","true_slope","square_profit","ablazepies","markspot","arrive_zebra","eight_cat","shaky_army","handypush","string_jeans","slap_wax","bitesoup","furry_circle","dizzytooth","gamy_waves","tastymarble","switchfruit","prickanswer","safemonth","dull_pie","dropsmell","suck_cable","ripe_bridge","waryboard","tastemove","wrong_sense","squarebeggar","brave_offer","clearspy","scoldcomb","lively_blow","rejectpizzas","lavish_house","hungry_bee","sassyclouds","hearnest","fancy_pest","renderpipe","uglyclass","same_army","sickpail","moan_cattle","measlyguitar","simple_low","petiteswim","lush_wound","jokebirds","directlead","slipsack","tastycrate","aloofpoint","vulgarcar","tamepower","cute_trick","hoc_rings","tricky_zoo","guard_smile","drop_voice","earlyart","travelnote","sweet_ring","wisepen","wave_ear","tastybushes","blackfall","waveseat","annoy_throne","royalcat","rinse_pies","point_horses","dusty_roll","sow_waves","creep_debt","lamehot","unusedtail","touch_fly","lean_eye","awakefact","grin_sack","luckymoney","filthy_patch","frameanswer","mere_guitar","fair_camp","slow_soap","depend_sister","cageymeal","vulgar_beam","mellowcrime","jumpyidea","absentslope","upsetsilk","matureberry","ripeapple","switchkitty","good_wealth","wittyhook","true_eyes","guessjar","untidy_love","leanbears","slowclover","suit_store","husky_ant","level_hen","nodtwist","testy_help","moldychin","wooden_cheese","halfwrist","soft_tin","grubby_sign","ugly_word","abaftowner","sore_clover","red_news","pushy_hall","lumpyeggnog","start_locket","tameducks","tacky_grade","snatchrings","breezy_house","happen_floor","tiredrhythm","reducelaugh","excuse_sign","trust_hose","right_pump","cool_grip","little_show","careghost","landducks","glibyarn","induce_crime","stitch_soup","cut_record","light_idea","oafish_celery","glibfamily","x-ray_family","bore_name","defineslip","thrive_beds","wittycat","sharpline","stopshirt","sick_river","tap_fish","silentpig","nest_spring","holdsmoke","beamspade","upset_zinc","aback_hate","blotcopy","seemlydoor","murderthing","new_glass","deep_group","furry_leaf","livelyhall","neat_truck","scarceuse","create_wealth","handy_cow","giant_water","modernwork","holdrun","cheerfear","murkyboy","steepcredit","dusty_word","twomeat","clothelevel","emptyorange","lose_locket","trashy_banana","untidyfront","tearletter","spookyinsect","left_blood","tug_back","lockrock","needycoast","faint_jelly","milk_fruit","paintminute","whirl_hate","melt_cake","ten_error","tacitnoise","fierce_smash","maledogs","sordid_pain","upbeatwinter","avoid_sleep","wanderfear","cleverneedle","findhouses","modify_week","modify_verse","vagueplanes","punchdrink","rapidroom","superfeast","bleedtheory","trite_guide","lastpies","first_pickle","noteincome","guesskick","closedkiss","moveteam","paleshock","zoomwaste","win_lunch","reportchess","violet_slope","gather_duck","murder_lumber","whinedoor","murkyfire","vexlegs","bitterbridge","devise_owner","subletvein","cling_chairs","tacky_coast","wirysheep","zonked_bat","tawdry_class","bow_oil","lovelyyoke","pushknee","smile_heat","rankline","bad_shoe","sow_insect","untidyharbor","spit_eyes","awake_giants","gazechance","flakyleaf","creepykiss","preset_rabbit","rank_spot","minor_riddle","dresstree","rush_reward","patgroup","sourcorn","purple_ducks","jam_home","bump_wood","tie_road","dead_harbor","pumpbirds","phobicsmoke","marrybabies","jumphook","alike_jam","trashywax","fastballs","scrape_note","bleach_brush","sore_tiger","leap_slave","handyard","jolly_snail","equal_father","tell_circle","mentorbottle","sillyboard","weepjewel","wastestage","acid_credit","shut_mitten","null_error","employfeet","insure_foot","obtain_help","zip_silk","afraidsack","bringarmy","wander_street","three_frogs","youngpigs","eat_pickle","gabby_school","levelbead","flashyshame","shaky_ear","curemass","burlycrime","griphour","heal_lumber","husky_hand","addact","sweetcherry","soggy_frame","giftedquince","ritzyclover","rob_skate","frail_turkey","glue_thrill","rigidhorn","melted_collar","mushy_spark","beg_star","vaguebubble","tinydeer","tap_army","settle_locket","deeply_grain","copy_metal","greaseanger","sneak_able","inducethrill","pat_turkey","vastnerve","leapnorth","puffy_birds","ultra_bridge","fancygame","meanscrew","damage_cows","sedate_wool","guardtray","scoldbells","uppity_join","givewash","scared_soap","steer_bat","keenduck","signal_scent","foamy_bean","drabnorth","madly_road","keepcloth","loose_tongue","fluffy_pocket","windyshame","new_cannon","squash_form","breed_zinc","bringhoney","flap_chain","carvecircle","obeyeggnog","rinsepoison","provestream","sad_scarf","wild_cause","tumble_garden","agreefrog","smoothnote","tart_clam","aware_person","pourhealth","tame_shoe","hunt_dog","lavish_able","attack_flesh","gifted_joke","goofydime","grate_finger","bet_robin","face_jewel","polite_orange","versed_heart","greencrib","fadeground","icyrest","minor_taste","polishdrop","bang_bed","steal_expert","brokendad","soft_wool","enduretaste","gojump","icky_chairs","absentaction","briefstop","mate_sponge","pinchfront","right_price","tallmetal","grumpyoffer","retire_camp","blue_crowd","remind_feast","acridtable","uppity_growth","rapidtitle","priceyshake","bendclass","worrynorth","stuff_back","note_sky","steadyslave","stingband","inventstory","bluepower","excite_bulb","foolform","earthydime","mute_men","pour_plants","fancy_mass","twogiants","freeable","rapidsize","gray_mass","dry_boat","close_kick","dear_jelly","happyhand","bright_key","designstep","neatdog","jumpy_patch","learn_end","shutgoose","behaveticket","force_marble","hit_father","deal_hope","seemly_trade","unruly_bells","rightshoes","spicymark","jagged_recess","malemouth","chilly_coil","savoryqueen","nosywire","sick_ink","tienail","wantharbor","lively_clouds","four_sort","carry_amount","force_cows","elated_writer","wash_engine","crossboy","popbadge","raspytrip","lovingstew","alight_duck","freeact","wigglycoal","scrubtitle","blindhat","innatekiss","jail_berry","repeat_scene","kaput_birds","robustfloor","ride_pain","futurejeans","colortown","slidecable","wittyfield","reign_guitar","scrubpaste","huge_join","brokencoach","banhands","recordtray","gentlehorn","brush_drop","tawdry_skin","acrid_pencil","dosize","tiny_suit","famous_sea","drab_wave","needlake","pedalbirds","strapsong","trothour","happy_line","unusedmarble","doubt_death","telldrug","classycow","foregomark","go_cars","itchyneed","heattruck","upset_rake","rottenamount","untidycoach","spot_breath","wendplate","closed_spring","lasthope","sick_ground","crushboard","dailydime","cold_frogs","creepy_stamp","malehead","cravenpatch","keentrees","settlesongs","suffer_arm","repeat_chance","measlykick","dam_street","proudquince","teenyfeet","checkpart","marry_fact","greasyanger","quirkysnakes","plant_kick","spell_floor","grubby_card","elite_number","keenanger","searchcord","acrid_table","narrow_cart","know_woman","putwood","proud_ball","abide_trucks","elitemonkey","brashtrucks","remain_cap","macho_drink","mugedge","alert_chin","aloofnight","freezebadge","breezywound","thrustoven","rural_sponge","youngshoe","attach_ticket","overdo_walk","feardesire","grabthread","untidy_voice","meltduck","broad_frogs","greasedoll","heap_range","wigglywar","harm_plough","enlistshirt","drop_cart","smoke_poison","headyanswer","shockthing","watchcloth","crawlpot","orderscarf","ablelip","abruptfuel","race_silk","green_fire","yellcellar","tour_orange","madlybooks","bolt_back","dry_queen","guard_wrench","muteclub","able_air","level_van","tirecrack","famous_mind","easyspark","lewd_yoke","tear_snow","stain_place","meanbag","shrink_bat","black_grape","clip_note","puny_beetle","boredbooks","braverifle","narrow_wrist","brash_ray","fencegirl","bowlunch","targetjar","treadmaid","ablazeleaf","harass_coast","softbottle","cruel_temper","raise_table","verify_fuel","jokeray","jumppear","zip_boat","juggle_wing","many_son","sketchmen","common_trees","halfriddle","light_plane","assureleg","advise_locket","flaky_back","noisybaby","become_summer","dragpear","fourwheel","widelevel","zippy_nest","gray_spoon","bitestory","buy_thrill","angrycover","meatywine","cute_finger","pincharm","madly_answer","stiffsalt","public_stream","mourn_egg","findpig","knot_fork","wet_dust","quick_growth","rainhill","swing_truck","tipchess","fastboats","empty_veil","watch_polish","burn_toad","peel_park","vast_north","offerdrug","spread_recess","sharpzipper","fiercefifth","cast_copper","dive_face","buzz_lake","skip_alley","lock_spring","faded_basket","branchweek","book_crate","occurstraw","savepull","cold_arm","clumsyneed","overdoegg","measlykitten","zonkedducks","drawfloor","zonked_brake","swing_taste","gohouse","gaudy_credit","buildicicle","hurt_cap","filthy_fear","owe_cup","raise_credit","sorestage","mellow_thumb","machoclub","plucky_women","cravenable","leavecopper","bleed_grade","sackboot","wild_curve","tense_cloth","utter_bun","keptpet","arguedrawer","cleverorder","jadedtime","furrycopper","stingy_event","half_record","smelly_beam","drag_land","waitbite","strongperson","five_verse","rabid_rings","paddlecrow","sparkwash","givelamp","pat_silver","wait_voyage","pinelunch","violet_stone","whiptoad","stride_stage","funny_fight","x-raygold","laugh_touch","tight_pin","kiss_oven","exist_bun","usefulbag","pressbrush","copydrawer","ownday","plucky_friend","eat_things","happen_corn","nosy_eyes","racialamount","meregoose","messy_mark","borrow_flock","dizzy_view","direct_flock","strongstove","doubtrub","light_wine","point_camp","stiff_women","drag_need","joinrun","bomb_blood","filthytouch","stifffinger","spareflock","wendcover","zip_wrench","rushband","cause_alley","flapball","blow_side","sulky_slip","largebeef","upsetlow","yellow_paint","touch_rat","dancerose","unable_spoon","tricky_skin","polish_church","water_power","sipexpert","crazymarble","orange_mice","nastypin","purpleseed","aback_silk","realplate","wooden_lunch","clear_ocean","wearysize","relax_juice","review_time","give_flag","stand_hate","lowlygoat","ultra_steel","faxuncle","elfin_food","knot_list","waitface","brieflove","dividecakes","breakpark","awfulmind","sproutfrogs","wring_beggar","deal_skate","violeteggs","wigglychange","loudstep","nasty_friend","pinepeace","bleach_flame","eager_rail","amucksmash","spiffyvein","paddle_prose","gabby_alley","poursteel","yummy_face","face_route","chubbywax","throwtank","triteknife","unusedkitten","amuck_art","flat_hate","pretty_sea","laugh_chance","spillbomb","elitefarm","tan_pail","caresail","ruralthread","screw_grade","wacky_water","smite_prison","rabid_school","furrywater","flapboats","judge_act","shut_ship","tearteeth","earlytrade","vulgarpotato","savorymother","dapperlight","full_grade","nuttycloth","divide_jail","fourmove","tidy_iron","bake_knife","breakhorses","target_roll","rhymeclover","fluffyplane","misty_tiger","drown_record","cagey_thrill","griplinen","smooth_ink","mentorpush","black_note","bore_net","aheadwire","tease_cable","thawclover","bang_pump","milk_donkey","jumpypower","ride_stick","bright_cough","feeblewrench","drumnation","fence_girls","ahead_house","ripe_jewel","pinchsun","endland","flap_turn","relatehook","queue_lawyer","beginriddle","icyfoot","jailwrench","stick_effect","giantvoyage","swiftrule","admire_house","curlbrake","secretscene","endure_walk","solvecurve","punyadvice","jaggedlead","pray_food","lowexpert","simple_stamp","map_glue","joyous_watch","rigidmask","little_fowl","pilot_smoke","crushsteam","inputdust","luckyhope","steerweek","advise_grade","rusticwomen","file_voyage","shiver_elbow","feeblefinger","step_bat","quaintsuit","calm_kitty","four_sun","permit_plane","aloofcredit","hate_able","hover_monkey","lively_answer","bowclover","fierce_ghost","dress_oil","divide_cover","petite_hat","pale_card","itchy_coal","knitbook","ragged_skin","meek_ticket","wipeapple","clammylawyer","breezyreward","swell_honey","excusemom","vulgarrock","vanishflame","aback_pencil","half_clam","supply_yak","avoidboard","carry_fowl","robust_border","reportlinen","overt_lumber","shyclover","mixed_cast","harshbead","elitefang","niftywork","yawnkitten","alive_harbor","jadedhole","absurd_money","floodcopper","make_trick","smell_dad","remind_grape","sneakmonkey","best_ducks","lovelysong","dustmice","meltedman","ritzyunit","closedbadge","iratedogs","glossy_yard","slit_drawer","hurry_vessel","wrap_snake","injectship","foregopaper","tinyfang","loudtwig","needy_cause","common_yak","racialburst","fold_chalk","gapingstory","forbid_animal","stupid_birth","maturebike","uglydebt","groovy_slope","warmvase","buildgrip","flimsyrecess","brief_boats","bleachcrack","untidytrip","sassy_star","paste_judge","handyreward","serve_boy","crawl_crowd","poised_sister","slidejoke","spooky_pest","boilfinger","skipactor","crawl_cream","smoggy_bikes","flash_arm","royalpage","thrustbag","expect_stem","jolly_hair","testy_vein","nine_police","yellowroom","lavish_eyes","tensecrown","fiercecave","curly_shake","huntunit","ad_beggar","halfcopper","fold_clouds","brainy_beef","clap_music","slitpoint","spring_ant","relate_quince","string_copper","royal_rod","belong_finger","trybutter","bind_pipe","solid_blood","tastelegs","meanroute","bruise_death","uphold_bird","nifty_edge","crack_pear","smash_uncle","awake_bat","dare_heart","insurecause","disarmducks","relate_drug","blowbee","solid_door","smartfather","icy_blade","coughclock","likedock","tawdrybanana","lush_houses","untidyorange","strivemiddle","bust_field","briefqueen","dropbrush","crabby_poison","kisshole","darksongs","stormy_clock","hurtslip","plainsun","secondqueen","fit_steam","loose_pear","tiequince","crack_story","spreaddeer","remove_thumb","bolt_leaf","drivemom","tripbrake","merefact","be_verse","firstclock","draft_coast","misspizzas","minorpot","sendmilk","saltyyak","crabby_spy","grey_order","back_river","largepan","badthumb","gratis_pizzas","sell_trip","admireedge","sharp_van","ickyjeans","rhyme_class","whole_push","ill_rub","cheap_grade","kill_nail","alerttrick","vexrun","decayground","retire_twist","bubbleflight","grubbyperson","afraidwire","best_fly","signjelly","homelyshock","marketskate","force_square","pinch_regret","agree_fly","pack_ball","paltry_quiet","forego_guide","stupid_babies","jadedtoad","madly_rub","draftgarden","doublemarble","slowhill","minorlegs","curlysleet","greatdad","speak_pigs","shoot_size","itchybears","lowly_square","proud_rose","dropgroup","nod_blade","savory_metal","gentleballs","illtime","stamp_back","round_bear","bumpyshirt","whine_silk","assurequill","fatfrogs","caring_cattle","fine_advice","bloody_women","buryzipper","pat_move","heap_key","hover_chalk","assesssteel","tart_family","tidyangle","bentlist","hopetail","spiffy_winter","checktrade","warnhole","rotten_match","red_boats","stingy_battle","overtwealth","trotbody","mushy_card","earntrade","silent_pizzas","daffyexpert","jugglecows","lazy_bears","acid_pocket","useful_jewel","loud_baby","hardfinger","likeangle","heap_mom","healrun","sick_powder","secret_kite","number_voice","icy_minute","editednut","draingrip","signjewel","giantbun","blacksponge","sublet_hope","windy_bomb","wedroom","brokencats","rhyme_hair","stealhead","givebaby","spoilview","ensurelaugh","mendsystem","laugh_value","small_wine","milky_quiver","priceysmile","draw_fan","jolly_table","signalyak","angry_battle","icy_fall","sin_hot","teasesong","try_note","hook_fang","belongflock","wacky_button","near_band","plead_sleep","zip_ground","lendleaf","enjoy_water","suffer_hole","craven_pets","drain_laugh","bettercloth","boxapple","sorechin","fearwall","existrate","inventwish","odd_crime","blind_zoo","knit_effect","sad_cub","luckycrib","arrive_kite","avoidbelief","awake_part","gaze_bead","littletray","softwish","rinsepin","squeakquiver","overtroof","dependneed","hushed_fish","leftfloor","march_roll","quaintleg","warmcare","harass_sense","great_chin","drum_orange","wiggly_neck","alert_beds","launchmusic","bigwealth","attacktoe","shaky_ice","pastetaste","tired_coast","dusty_able","unablecircle","safe_birds","chasekick","teeny_table","fixed_hands","ten_lace","cover_twig","acidicperson","tastesnails","liftedhorses","unlockpickle","swing_border","kindly_mom","nice_horse","cloudy_leaf","meancard","clingclass","rocktouch","shoe_quilt","direct_game","quaintblade","clumsyyear","alive_writer","classyzephyr","frailchange","finecrown","early_elbow","rhyme_crib","barelawyer","updatepart","clever_hour","squeak_group","dust_view","whiteregret","harm_wheel","greasy_nail","irate_bee","poorstew","sassy_roof","trite_act","strap_music","flimsycircle","weave_teeth","double_boot","yellvan","divertwoman","cooing_cars","trashytank","thank_laugh","jail_dolls","wacky_pear","place_rat","savorystage","yell_chalk","worrypaint","intend_brass","richevent","small_rate","stitch_tree","floatpower","sweetrain","null_drawer","zonkedcry","misty_blade","wiseballs","curvedlaugh","adqueen","chart_park","racialdetail","ban_able","bawdysystem","wipe_bulb","thinktime","new_home","test_cry","hide_bells","keep_slope","strive_cakes","designfaucet","dare_poison","buildpotato","squash_iron","unused_salt","slimy_cannon","tastyuse","damp_thumb","hollowwinter","warm_orange","chooseballs","sorebirds","loudsilk","icy_sneeze","shiverliquid","choose_wash","wendharbor","five_sound","largevan","scream_degree","rigid_brain","arise_stick","lend_doll","paltry_shop","petite_farmer","level_plate","hoverquill","sweet_plane","bawdy_month","measly_number","strokecough","faintfeast","warm_stick","assist_unit","looseneck","spare_body","stiff_credit","sendbeast","allowmoon","fry_tax","dustman","dapper_ducks","petiteair","fit_cake","grateact","besetmice","stain_turkey","emptyfinger","spiffy_cloth","good_thrill","poorelbow","tense_system","neatmine","shake_iron","forcesea","come_teeth","shademom","serve_fact","easyfork","steal_error","cuddly_money","bent_wine","fixthing","grindpowder","paddledeath","put_ship","wrap_pin","sew_father","pour_hole","allowburn","smashslope","enlist_quill","grate_spring","saltyroof","bringsense","elfinslip","vastgame","crush_peace","blindmiddle","measly_metal","shoot_harbor","petite_horses","unruly_feet","banslip","itchy_kitty","ruddy_pets","punyanimal","assure_join","brownarch","wide_pen","wrapghost","gaze_police","fadedteam","belong_beef","alightsea","knowball","hurryhorn","crazy_spot","shinyshade","uppity_father","innatefrog","versedtrees","awake_uncle","fetch_shame","jazzy_turn","mixed_hour","seecherry","leftflesh","allowedge","fluffy_snow","readyprofit","forbidtoad","bumpson","empty_watch","spottychain","risk_trip","yellowpowder","dampstove","grindmind","lavish_road","wacky_uncle","fixed_owl","wearsort","bust_pen","screwfood","useful_cloth","mugadvice","sedatesand","full_name","induce_throne","lethal_land","hoc_zipper","amuckapples","snatch_wool","bowjeans","wantplate","sloppyquiver","sad_care","pushcats","crabbycrush","roomyreward","kaput_owl","modelclass","overt_belief","better_shelf","elitechair","early_sugar","obtainscarf","pumpcloth","pushy_fruit","exceed_screw","tough_geese","shrillelbow","kneelwomen","gapingshelf","sticky_way","meaty_lamp","nail_value","earnslope","useful_reason","usedrock","moorpickle","sable_bomb","occur_copy","sweetshop","retirepush","alert_place","ready_shock","blot_curve","leave_farm","jam_cheese","vast_mark","equal_wind","stinkwrist","commonmask","unify_lace","pushy_fight","assess_friend","boilfork","elated_lace","tall_frame","tough_change","slip_drum","zestyback","browncream","wildminute","crabby_crayon","hollowjuice","removekettle","one_robin","tacittalk","cuddlysofa","classy_pin","hook_rule","relax_maid","cure_geese","abaftpaste","clammysneeze","greycrush","attach_spark","bust_bath","uglysteam","stiffcoat","silent_fruit","stare_cow","shoot_glue","little_fight","smallgirl","fold_whip","juicybeggar","ill_giants","sloppy_grip","selecttalk","sneaky_music","gifted_laugh","lumpyneck","yellcars","signalmask","nappy_spring","foamy_aunt","assisteggnog","savorypaste","heattrail","clingside","highwindow","eatstick","shootgiants","meek_shelf","strokejam","big_chain","solid_mice","attackheat","appear_low","uppitywatch","lean_yak","copy_pot","zany_rub","crazyglue","huskypot","cooing_camp","noisyfowl","misty_flavor","soundlawyer","wreckgame","stitchtail","minor_jail","battlecast","goofytub","stopstory","prayzebra","wishrabbit","mature_heart","mere_zipper","forbid_knee","drearyplay","lucky_beam","prefer_goose","alikefowl","prickleaf","weareye","aloof_wave","betterlead","bleed_stove","dark_paper","remindvessel","occurcast","strokejoke","used_music","squeak_heat","kindly_burn","stamp_lift","shop_muscle","sablecherry","pinkbeef","filthy_rain","feelpower","dirtyform","mature_basket","bat_animal","nippylegs","wobblemuscle","foamyart","cheer_harbor","trade_arm","placefather","brown_chain","tensemilk","plant_form","meanjump","slow_plough","slitoil","erectkitty","dapper_clock","skinny_hate","launch_week","boringowl","keepsheet","waterygoat","borrowmaid","squeakthumb","hand_garden","tiredmoon","hitflower","ignorehot","bawdybody","gifted_stone","super_blade","relybeast","absurd_list","crosstrip","shootsnow","markedregret","arisedoctor","dreary_profit","equalpark","sniffband","slingteeth","mutechain","splitglue","abaft_cup","inputanimal","tensedogs","launchyak","daffystamp","utter_reason","decidesilver","short_coal","runnerve","feeblesail","witty_pipe","return_eye","tumblefifth","tinylevel","rid_town","shaky_ghost","nest_sand","argue_cat","brownrat","amuck_blood","glibtable","tensnail","annoyball","delaywaste","manparent","buryquill","sweatplace","zippy_book","enter_show","odd_lumber","ripesuit","carrytrucks","huntbirds","unique_doctor","foregodeer","ablescrew","coldmom","plug_sister","tallwind","futuremoney","advise_bridge","nasty_oil","hugebeetle","hop_family","gaudy_bee","scared_linen","stainframe","long_mouth","prickmonkey","lamefloor","write_system","banstreet","meddle_cough","branch_change","taboo_offer","admire_books","dirtynet","rural_street","cut_pickle","preachcoal","flap_trade","flap_battle","wooden_jeans","cooing_income","tacit_banana","acrid_star","curvedeggnog","fade_crayon","brown_garden","overdomint","tawdry_men","seemlywax","retire_year","punishstep","dear_top","wildpets","stayclover","devisemist","matchhorses","nutty_class","equal_box","flycan","brake_ball","openbee","robustquartz","join_alarm","slimstory","flashbeast","politemove","backwheel","windyfarmer","fancy_town","short_motion","shear_hat","hugeerror","mushytin","abacknail","shyfowl","jadedfly","gratis_baby","pastmusic","dearbat","pickcorn","quack_rod","tiny_paste","jumpboot","cute_blade","wipe_apple","pluckywrench","subletengine","like_sleet","beatkiss","proud_flame","sneaky_rat","marked_wish","twist_cook","sink_music","stroke_shoe","employwash","ratty_swim","brightsponge","cheapword","quickhouses","full_seed","clammy_shop","fasten_mist","tasty_floor","murkypet","safe_nut","plucky_word","groovy_able","stickman","longtrick","mellowland","fix_plot","settlenerve","fluffyboats","clammyvan","high_tongue","zany_pet","spotty_trail","jog_wire","sore_nation","glue_desire","trap_hot","second_sticks","wishsound","wildhook","stay_board","answernet","rate_coil","step_frog","zipquiet","marchpaint","sling_bike","bless_clouds","cry_burn","clipvalue","painthose","shop_guitar","wearyfloor","wed_cars","waterback","smellyvoyage","leanant","tame_island","fixbrass","sore_mass","untidy_farm","bangdock","brief_father","force_fall","filescene","filelip","sipcause","modifypocket","steer_wool","pushycrow","fancykettle","testsnow","drain_island","bruisecamera","fadesneeze","drycrack","detail_anger","throw_cook","steadybee","gaudybutter","design_porter","frameeffect","tender_branch","damagebells","stay_point","bleedplant","leanpie","lewdsmell","gentle_lawyer","hungry_patch","useful_tongue","brash_elbow","uniquehorse","ensure_train","punykite","settle_chalk","tie_motion","woozydoctor","shoecrime","wrap_clam","utter_pickle","exist_bean","bury_plant","curved_bed","sawbite","kiss_offer","singrobin","frycrow","deeprabbit","blush_lace","secret_basin","seek_snails","rescuebead","wary_recess","bigfinger","fixed_whip","tan_voice","rigid_beetle","detailchange","loadpie","readydolls","wrappan","bomb_pets","hidestick","lick_bed","ablebaby","fastcork","reallawyer","wild_value","icyend","white_door","sneakyshake","glowblade","wait_cave","hotbeef","branchloss","grow_chance","shapegun","relate_alarm","brokenhen","nosyskin","drum_wall","snow_eye","tour_badge","superprint","tart_ice","afraid_coast","racialmove","alertnest","acridhole","brake_parent","punch_pull","ridesheet","earlywinter","tart_pet","empty_top","busy_sheep","savoryflesh","obese_grass","play_brass","trust_form","watch_trail","happenpart","reason_pail","dullpark","malebridge","choke_offer","mistylight","stupid_person","dusty_hat","oafishuse","dependlow","brown_circle","punishcrib","cheapgoose","admit_place","clap_potato","sassy_health","heap_noise","exoticgrape","add_line","watery_heart","chunkyharbor","chasepark","happy_dock","madlynews","unitepan","harmowl","tickle_moon","alertcollar","twotaste","dare_grape","robust_cake","green_rabbit","kindlybook","bang_bell","warn_shop","unable_chain","punchveil","attainsalt","nastyseat","fool_shade","treatpin","pretty_girl","stare_roof","beset_belief","greasycrayon","broken_basin","plan_ants","faint_map","deartrees","adopt_blood","logsteam","slit_flame","unlock_watch","deeplychange","copy_zebra","cravenclover","hang_collar","afraidfold","comerhythm","settle_wood","meltcars","drainpaint","thirdcomb","assurejar","silly_lawyer","jailbox","make_ground","silentengine","fair_parent","meaty_bun","cloudy_banana","rightbirth","obesesnow","burybikes","hurryinsect","pinchslip","equalcoat","costforce","supplynorth","thanktray","bomb_seed","hop_bait","curlcows","dearblade","irategirls","murkyicicle","short_alarm","land_rock","loose_fan","tow_fear","sip_jump","storepen","woozyfarm","milkwealth","read_route","wearword","faxsnakes","fastentin","twist_sleet","fresh_cable","wary_waves","blind_trees","warm_crime","cruelbeds","looseisland","help_cars","sordidquiver","shinycrayon","melt_team","yawn_rule","growpickle","cruel_moon","bare_slip","relate_limit","smoothplay","bitehope","scrape_sponge","aloofcrib","greedy_stone","gathertouch","sable_bells","longcrib","bomb_rings","singtub","untidyway","joyousspot","bluecheese","slimyattack","popdoll","curvy_land","sealsteel","sinkriddle","tracebrick","weighhall","chew_fowl","decide_sun","sinkrabbit","numbertaste","sloppy_island","jumpy_tub","unruly_house","harasspan","sublet_frog","intendjudge","tacitdetail","bleed_sock","awfulvein","mixed_wing","hook_owner","walkkettle","kindflame","pastebike","erect_letter","beginvoyage","square_mitten","annoyway","referrod","retire_copy","rush_brake","first_toad","decaychain","sweetroad","mourntrade","breakback","unique_beggar","wander_burn","stick_home","thickcable","iratehammer","shakyvoyage","cooing_wool","devise_chair","lush_liquid","closed_step","splitmagic","doublebun","creepyback","hit_key","film_spoon","levellook","proudbomb","branch_goat","updatecoach","leap_fuel","detail_crayon","firstwool","lightbrake","enduresalt","tastecats","watch_angle","slowburn","first_line","hover_police","put_lumber","lastlove","hurryday","sownews","simplenail","dry_point","hold_turkey","borrowsneeze","cute_sand","sad_star","knotty_breath","robust_home","tense_sofa","steady_birds","left_bears","versedpail","stuffcrib","ten_team","paint_pot","rebelsnow","admitbreath","innatesmell","slidelevel","teachbrick","legal_grass","eightyear","tourboats","curltoad","judge_trees","pokefloor","fill_nest","supply_war","farspade","rinse_lake","love_parcel","itch_debt","blue_yard","smartcare","read_song","used_art","bareowl","failcar","sublet_beds","poisedowner","trite_slope","locate_dinner","quirky_bread","bury_dinner","happyant","real_able","usebomb","itch_hair","heady_legs","alivecare","violettoad","store_burn","modern_form","saw_bag","pale_war","acidhair","torpidsmash","teachhen","reply_able","brashbite","zonkedkitten","informthread","cryelbow","fry_shoe","swankyhose","stepbread","open_sound","sightrucks","hurtsign","trade_honey","fail_fang","drunkcows","messyboat","plan_parent","costcrook","cute_floor","dragcrack","invitesnake","murkybread","mute_grass","suckbait","shootfinger","decide_rule","tap_moon","spitwash","slimy_skate","two_leaf","grubbywaves","shavenumber","wholecherry","firststart","rural_name","sloppy_eye","ablazeself","bravejeans","manage_smash","phonewash","planjuice","cutarmy","updatepower","hate_hole","causeguide","drive_sense","tutorneck","youngjoke","tame_beds","phonetray","marry_cream","ragged_quiet","unusedactor","plain_club","dearexpert","suffer_temper","quaintkitty","mistytray","quackcent","dailybeetle","need_chin","markedzipper","nippyfifth","work_tail","flow_anger","male_cover","zonked_net","chartalarm","pasttrick","lame_bridge","roomy_spy","towbox","noticebook","rapid_ice","throw_quince","hollowable","forcegun","sufferclover","drab_copy","judge_system","dream_help","scold_ants","stinghome","thrustscarf","askdegree","pleadbreath","spicymonth","sour_island","logrule","petiteheat","pump_sack","snow_form","busy_person","gamy_hot","assurewar","ad_fuel","heapattack","keep_bat","fearroad","dustyyam","dam_light","presetegg","seesilk","refer_linen","avoid_hands","jumpy_scale","leave_dogs","jugglehook","wailmatch","nearsmoke","sootheball","reducestage","draindetail","solidplate","begin_boys","stingydad","stupidbasin","tamesea","torpidjuice","hum_pot","shave_camp","designwave","crushuncle","presetrabbit","harass_fear","swell_songs","x-raywash","wiggly_breath","orange_turn","smoggy_shoe","reduce_tooth","sablefield","paltrypull","needysort","cooingrun","illthread","racenation","excuse_ant","hurt_feast","jog_tiger","becomepail","versedcelery","hardfall","bust_wealth","learnyam","nestreason","learn_paste","scareddust","nestfather","jumpy_stage","yawn_coil","startcattle","log_man","curvedrule","spoilchalk","sudden_worm","pinkrail","workdoor","calm_sleet","start_hat","belong_story","spooky_parcel","fixedbreath","itchygroup","paddlewool","black_crown","dullnoise","expandglue","scrub_ice","lowly_honey","bear_throat","repeattooth","obesetrucks","furrybreath","stuffcrime","wearcar","coil_sister","chewrate","hitshame","ruddyowner","afford_potato","offenddebt","mixed_train","assessarm","moldy_sofa","tangy_care","quietprose","hollowstep","hungryson","tread_flavor","meek_clam","dustybooks","peel_mass","kickrecess","clingsugar","dry_recess","wacky_gold","one_grain","cyclesense","mature_minute","sassy_motion","measly_trees","versed_crack","ridstamp","reachroot","spring_quince","bake_look","sore_cough","keep_star","abide_cars","curlypaint","cloudy_zinc","proud_flavor","passlake","rock_ray","snotty_quartz","sighstop","lend_level","mourn_curve","detectquill","peellook","invitefire","chew_babies","thinbait","tellmist","curvedtwist","curvedbase","acidicsnakes","disarmbag","racialtrip","run_mask","woozy_ant","keen_clam","camp_eggs","brightcars","livelydetail","chew_party","loosefinger","crazyfang","far_able","suitbee","pumpdrop","grind_trail","milky_toe","mere_tent","famous_yard","copy_bait","fight_wall","quietnet","twoswing","sneaky_work","repairwalk","emptypush","shut_bear","yummymom","gabby_nose","drive_sack","tourclocks","admitgrip","wryslip","nullapple","arise_grape","detectsuit","sweat_apple","shear_celery","advisewash","afraidbushes","trustdonkey","taboosort","assessglove","tendercord","damflag","tenderpot","thinbell","writepot","wise_hook","drainlunch","exoticsize","shrinkcork","saw_dinner","used_ice","relax_cakes","signbrake","palecard","delay_shock","windy_lace","tapaunt","reduce_riddle","deargate","step_waves","chartmother","see_lock","pumped_pipe","press_coal","open_oven","mourn_food","followsponge","aback_able","irateshop","cleanjoke","sedaterecord","grumpyswim","overdobrick","breakriddle","meltfaucet","speak_hot","gather_cap","kickbath","direct_ear","afford_engine","blackapple","handy_spark","exceed_wall","hushedbulb","male_beds","smooth_scene","adopt_pies","learnamount","kindprint","arriveship","charge_flame","rainy_dock","lean_turn","trap_horses","absurdwalk","mellow_fan","suffer_quilt","solveflavor","postshirt","knitspot","mixvein","warmcats","chunkyvest","mute_mice","floodkettle","load_chance","knitburn","paleorange","obtain_breath","large_farm","inventveil","lowsnake","talkbone","create_mind","stalestring","leap_crow","easy_duck","punyturn","sinklunch","book_stew","clean_hall","cutedrop","smash_club","stalewine","hug_bike","nicechairs","plainpet","manplants","drabknee","createshoe","creepyflag","earnwine","far_glue","rigid_middle","droppark","watch_desk","overdo_slave","wobblehoney","kissbasin","dance_string","ready_ground","sowsound","tutor_mist","briefbee","race_police","rubrice","wondernest","aboardsleep","rulesong","abideshock","drearyband","unevenveil","revisepipe","giddywriter","pleasebasin","soothebasket","bite_dog","teenywork","slimycrayon","tart_fang","grubbyroll","grind_clam","wake_use","fence_able","roomyend","breakroll","last_weight","aheadsmash","eightdad","sable_string","share_town","busybelief","violetbeam","fadedsnow","happen_kite","wrapjewel","cleancast","jail_north","flimsy_action","last_hat","rigid_finger","charge_turn","livewing","book_riddle","smellylove","weave_bird","crazyfruit","brief_mice","right_sister","dirtyturn","rot_cable","postrabbit","cycle_rifle","triteoffice","joke_van","tap_kite","brakemouth","lonelysheep","shrugprice","grumpywish","chilly_dolls","changezoo","chart_join","pumpedwind","borrow_bath","testrest","suit_wool","sable_voyage","wise_flock","open_rifle","silkyaction","thin_profit","stiff_year","bathe_point","forcerod","read_dog","set_basin","sort_ear","fewdog","spooky_nest","spottywomen","erect_news","cutehome","water_chairs","stupid_coil","tacit_trip","swift_wish","beatbasin","share_clock","insurecredit","oafish_spade","expect_kitty","even_push","drown_wish","dailyvest","yelldebt","heal_uncle","one_debt","stormy_side","rarerifle","build_burst","lend_flavor","mend_boot","quitpan","slim_kite","warmstem","guess_event","pokemeat","poisedeye","sitsnakes","phobic_cup","remove_stew","phobicpush","lowcable","testy_shoe","happydeer","stingy_mother","wide_hill","nippy_tent","spendroad","post_ticket","mix_skate","damp_wealth","begin_burn","soft_spark","bitterbite","sleepyanger","freefang","begnation","paltry_sea","sassysnake","matureboy","dream_rifle","rainydog","tip_face","slimyguitar","lowsong","grubby_expert","sellfarmer","plantspade","chartpig","solvetoe","realegg","knockjelly","launchrule","hopquill","tickle_jewel","fill_recess","ratefan","affordsquare","dare_wall","copyclub","directfrog","cloudybait","lickpoint","abruptcelery","gray_throat","brokendrum","invent_person","slinkfowl","machosponge","meetblood","enlist_door","glow_engine","pause_turn","buy_animal","mixed_kite","untidyevent","hunttax","opentrade","flimsy_dime","machoburst","bet_basin","fancy_hen","secretfather","lovely_shop","detailbreath","teenyalley","windy_temper","somber_humor","weartub","full_anger","carrycrate","knit_slave","vulgar_cord","chillyhorn","mushyants","purple_yoke","endurecoal","permitsense","meatybed","decidetrail","clearmusic","macho_copy","screwbutton","talk_shame","desert_kiss","dustyrhythm","wildscarf","truebutter","desertrhythm","sigh_boats","hopewindow","enter_girl","knotform","braveshoe","rustic_locket","snatchfruit","superb_basket","mixed_cord","early_flesh","placid_bubble","mature_base","hushedcat","yummysoup","speedshow","sublet_book","alikesnakes","orderwall","dampdeer","hop_mask","clapwren","plead_bread","backrhythm","versed_woman","jazzydegree","grumpy_tray","highspring","secure_cup","kept_boat","unablepickle","printgrain","annoy_soda","tacit_girls","tired_low","dusty_cloth","public_neck","stay_paint","hateprice","raciallight","swanky_kitten","harassskirt","skipcrack","camp_coach","sensegiants","furrybrain","twist_milk","jadedbean","messyword","settle_polish","taste_self","clumsy_soap","preferknee","upholdmask","stormyocean","nod_idea","flakysummer","seekstamp","clearplanes","unruly_moon","exotic_health","sneezerule","sixidea","bat_mark","deadmap","input_fact","reduce_sun","gaze_bread","left_touch","jagged_cry","eight_crime","returnriver","kiss_hen","tutorrecord","sticky_room","tie_oven","label_locket","keeploss","hit_light","listenbirth","alightbabies","spot_men","firedust","spiky_tail","inject_bread","ready_guitar","smellback","queue_bucket","smoothsky","patshame","cruelbomb","coilcast","manage_bean","wind_man","cutefifth","tallprison","bet_cat","clear_vest","give_brick","fixbath","sail_zephyr","seemly_women","ableship","exceed_mint","informring","realground","switch_owl","repairbell","scarcewrist","water_silk","erect_cap","batcoat","stingytouch","raise_sneeze","rainbag","jumpystamp","stitchmark","forbid_feast","shop_cats","flowtrail","renderpigs","winrifle","meltgold","spreadcattle","silentgate","awake_zoo","windtin","end_toes","tiredapples","dropbucket","inventcamera","travelstick","break_screw","stitchsnakes","jaded_answer","kneel_grade","royalpaper","wear_sock","narrowturkey","x-ray_garden","wrap_clouds","rate_finger","thrust_brake","betfork","brawnyplot","ratehill","roomyschool","attainmonkey","spare_paper","spooky_silk","narrow_slip","flathat","amuse_month","bid_tin","sendplant","rebel_stream","late_plot","faultyprison","whipheart","fastgrowth","gratedirt","blesspoint","nippy_day","posthall","fivepaint","unable_eyes","selectcows","suddensummer","fit_berry","nearsoup","drab_minute","wishwater","leanweight","kaputdrain","calmpush","reach_system","split_story","rudecloth","mellow_mitten","notebrass","spookyroad","groovy_sleet","soothe_rose","sort_income","hot_duck","lumpyticket","fixed_watch","curvesteam","blesscamp","advise_zoo","peckhat","pushy_quill","govern_box","wander_walk","findtrucks","smallrifle","polish_pencil","stoproad","tawdrydesk","march_news","rushdrink","plainjam","behavehammer","nappycough","wigglyrock","fatrhythm","usefulstone","fewline","bake_owner","nimble_sock","spark_legs","carvesnails","delay_limit","scary_title","detect_trick","ninesoup","reign_arm","tan_cats","warm_edge","mixed_balls","dull_gold","gaudy_clocks","flowfloor","chiefsnakes","smashcellar","drablegs","roundsun","admireprison","beset_fold","stringhope","blush_tail","acceptdesk","steer_watch","steady_cloud","markbeef","desertsoup","aloof_print","elfinoil","rigid_cows","shiver_point","locatenight","lickdoll","sparehate","touch_button","left_berry","warm_spring","hope_wind","publicroll","low_music","strike_horn","offendwaves","return_blade","narrowstreet","reportpower","laughcircle","hollowthrone","deadneck","crackray","wet_dolls","fryarm","sedate_copper","white_level","usefulscale","nippytwist","alikeplanes","tacky_swim","hope_club","nail_stage","speak_crack","fetchink","squealbox","vastair","beat_sound","wave_bell","knotfarm","little_robin","camp_belief","attacksnake","shareskate","bitterbat","quietbait","grindsense","lethal_road","expand_smash","second_ear","hungrybrass","irateuncle","grindjoin","dirtydrum","tour_ice","illtwig","lowlybone","travel_north","repeat_base","racialreward","load_field","sow_elbow","stuff_throat","lively_smell","lush_salt","spotstraw","causecobweb","sound_train","greetbelief","backfarmer","pick_farmer","steal_week","pickboot","sturdy_credit","equal_group","missgrass","pleasestick","zip_chess","detect_knee","provescale","acidbird","flee_skate","screwroll","equalrhythm","messyteeth","snatch_form","huskymouth","smash_copper","highbread","delay_wave","lovelycrow","emptyjoin","murder_mass","somberbattle","desertcream","bawdy_throne","accepttaste","snatch_floor","wickedhouses","fence_price","untidylawyer","meltloss","send_cast","samebead","living_place","wash_dog","ruralshirt","awfullight","rubapples","sableprint","itchhead","exceed_fog","scarycare","obese_uncle","soredebt","orderbean","sweep_war","clotheriver","livingwoman","moorknife","speakduck","swanky_songs","fastenwish","phobicstep","quaintscarf","kneel_form","manadvice","paint_sticks","bleachdesign","clear_sock","frailrest","mutejump","testy_hammer","shearuse","moldysleet","crabby_soup","longplanes","milkpolice","blowrobin"];

// fake users hashtable (username -> true)
var fake_users_set = _.object(fake_users, Array.apply(null, new Array(fake_users.length)).map(function(){ return true; }));






// ======================== Functions that we export ========================


// sort an array of elements in alphabetic order, then convert it to comma separated string
_h.arrayToString = function(arr){
    if (!arr) return '';
    arr = _.compact(arr);
    return arr.sort().join(",");
};


// Convert comma separated string to array
_h.stringToArr = function(str){
    return str.split(',');
};


// return the latest 30 messages before a certain time
_h.takeBefore = function(arr, time){
    var limit = 15;
    if (!time) return _.last(arr, limit); // if limit is undefined, return last 20 from array
    var end = indexOfMessageBefore(arr, time);
    var start = end - limit;
    if (end < 0) end = 0;
    if (start < 0) start = 0;
    return arr.slice(start, end);
};


// return all participants except himself, if all participants are himself, return [himself]
_h.getOthers = function(participants, himself){
    var others = _.without(participants, himself);
    if (_.isEmpty(others)) {
        others = [himself];
    }
    return others;
};


// the picture representating the convo is different for every participant in the convo
// ex: in a convo of A and B, A will see B's pic as the representative pic of the convo,
// and B will see A's pic as the representative pic of the convo
_h.getConvoRep = function(others, callback){
    // in 1v1 convo, simply return the pic of the other person
    if (others.length == 1) {
        GetUserPublic(others[0], function(userData){
            if (userData) callback(_.pick(userData, ['profile_pic', 'level', 'tag']));
            else callback(false);
        });
    }
    // in group convo, return a group pic
    else {
        callback({
            profile_pic: '/images/group_chat2.png',
            level: 0,
            tag: ''
        });
    }
};


// show how long ago a timestamp was
_h.timeAgo = function(date, ref_date, date_formats, time_units) {
  //Date Formats must be be ordered smallest -> largest and must end in a format with ceiling of null
  date_formats = date_formats || {
    past: [
      { ceiling: 60, text: "$seconds seconds ago" },
      { ceiling: 3600, text: "$minutes minutes ago" },
      { ceiling: 86400, text: "$hours hours ago" },
      { ceiling: 2629744, text: "$days days ago" },
      { ceiling: 31556926, text: "$months months ago" },
      { ceiling: null, text: "$years years ago" }
    ],
    future: [
      { ceiling: 60, text: "in $seconds seconds" },
      { ceiling: 3600, text: "in $minutes minutes" },
      { ceiling: 86400, text: "in $hours hours" },
      { ceiling: 2629744, text: "in $days days" },
      { ceiling: 31556926, text: "in $months months" },
      { ceiling: null, text: "in $years years" }
    ]
  };
  //Time units must be be ordered largest -> smallest
  time_units = time_units || [
    [31556926, 'years'],
    [2629744, 'months'],
    [86400, 'days'],
    [3600, 'hours'],
    [60, 'minutes'],
    [1, 'seconds']
  ];
  date = new Date(date); ref_date = ref_date ? new Date(ref_date) : new Date(); var seconds_difference = (ref_date - date) / 1000; var tense = 'past'; if (seconds_difference < 0) { tense = 'future'; seconds_difference = 0-seconds_difference; } function get_format() { for (var i=0; i<date_formats[tense].length; i++) { if (date_formats[tense][i].ceiling == null || seconds_difference <= date_formats[tense][i].ceiling) { return date_formats[tense][i]; } } return null; } function get_time_breakdown() { var seconds = seconds_difference; var breakdown = {}; for(var i=0; i<time_units.length; i++) { var occurences_of_unit = Math.floor(seconds / time_units[i][0]); seconds = seconds - (time_units[i][0] * occurences_of_unit); breakdown[time_units[i][1]] = occurences_of_unit; } return breakdown; } function render_date(date_format) { var breakdown = get_time_breakdown(); var time_ago_text = date_format.text.replace(/\$(\w+)/g, function() { return breakdown[arguments[1]]; }); return depluralize_time_ago_text(time_ago_text, breakdown); } function depluralize_time_ago_text(time_ago_text, breakdown) { for(var i in breakdown) { if (breakdown[i] == 1) { var regexp = new RegExp("\\b"+i+"\\b"); time_ago_text = time_ago_text.replace(regexp, function() { return arguments[0].replace(/s\b/g, ''); }); } } return time_ago_text; } return render_date(get_format());
};


// convert milliseconds to X days, Y hours, Z seconds
_h.convertMS = function(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  // { d: d, h: h, m: m, s: s };
  return d + ' days, ' + h + ' hours, ' + m + ' minutes, ' + s + ' seconds';
};


// get date in a human-readable format
_h.getCurrentDate = function(){
    var date = new Date();
    return (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
        ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds());
};


// determine if an object contain isMember attribute, this is used to
// 1) determine a userData from cache is indeed from a legit user
// 2) determine if a socket is from a legit user
_h.member = function(data){
    return (data && data.member && data.username);
};

// determine if an user object is valid, aka, contains the minimum for being a user
_h.valid = function(data){
    return (data && data._id);
};

// determine is username starts with 'LameGuest'
_h.isLameGuest = function(username){
    return (username.indexOf('LameGuest') == 0);
};

// extract numbers from a string
_h.extractDigits = function(s){
    return String(s).replace(/[^0-9\.]/g, '');
};

_h.isValidEmail = function(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// check if phone follows the correct format, that is, COUNTRY_CODE-PHONE_NUMBER. Ex: canada is 1-514-574-9044
// this DOES NOT check if phone number is valid, for that, use the sms verification code method
_h.isCorrectPhone = function(phone){
    if (!phone || !_.isString(phone)) return false;
    if (phone.length <= 8) return false;
    if (phone.indexOf('-') < 0) return false;
    // make sure phone adhere the country-phone format
    var splits = phone.split('-');
    if (phone != splits[0] + '-' + splits[1]) return false;
    return true;
};

_h.isValidUserName = function (username) {
    var word              = /^[-a-z0-9_]{3,15}$/i; // between 3-15 characters
    var notAllPunctuation = /[^_-]/;
    return (
      (username.indexOf("lameguest") != 0)
      && word.test (username)
      && notAllPunctuation.test (username)
    );
};

_h.isValidPassword = function (password) {
    // max 100 chars, at least 1 non-whitespace
    var regExp = /\S/;
    return (regExp.test (password) && password.length < 100);
};

// get a random emotional word. LOL!
_h.randomEmotion = function(){
    return _.sample(['LOL!', 'Srsly.', 'ZOMFG!', 'Whoa!', 'Hot!', 'Sweet!', 'Really!',
    'OH! SNAP!', 'w00t!', 'Boioioioing.', 'Cow level pl0x.', 'SHOOP!', 'YARR!', 'SAUCY!',
    'OMGz.', 'R0FL!', 'Wat!', 'lel.', 'shizznizz!', 'Oooh, damn.', 'Hehe.']);
};

// determine if A blocked B (not used atm)
_h.blocked = function(A, B, callback){
  GetUser(A, function(data){ // unfortunately, if no cache exist for A.. we'll bypass validation
    if (data && _.contains(data.blocking, B)) {
      callback(true);
    }
    else {
      callback(false);
    }
  });
};

// generate a unique ID to the highest possible randomness
_h.uniqueId = function(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

// test if a user if online
_h.isOnline = function(userData){
  if (userData && !_.isEmpty(userData.socketId)) return true;
  else return false;
};

// trim ::ffff: in ip address
_h.cleanIP = function(ip){
  return _s.ltrim(ip, '::ffff:');
};

_h.IPv6 = function(ip){
  return '::ffff:' + _h.cleanIP(ip);
};

// pick a random fake user
_h.randomFakeUser = function(){
  return _.sample(fake_users);
};

// determine if user is fake
_h.isFakeUser = function(username){
  if (fake_users_set[username]) return true;
  else return false;
};

// remove all starting and ending line breaks
_h.trimLines = function(text){
    return text.replace(/^\n+|\n+$/g, '');
};

// replace multiple line breaks by 1 line break
_h.zipLines = function(text){
    return text.replace(/(\r\n|\r|\n){2,}/g, '$1\n');
};

_h.extractAndSaveDrawing = function(content, drawing, callback){

    // 'drawing' is a hashtable that maps the id in [preview]id[/preview] tag to its corresponding DataURL string
    //  so, for each drawing, we want to:
    //  1) save this data into an image file on-disk
    //  2) replace the [preview]id[/preview] tag by [draw]IMAGE_LOCATION[/draw]
    asyncReplace(content, /\[preview\](.*?)\[\/preview\]/g, function (match, id, offset, string, done){
        // when client sends a text containing [preview]id[/preview], but he has no actual drawing,
        // 'drawing' object will be undefined (client sends empty object {}, but POST request removes
        // attributes containing empty objects, hence 'drawing' attribute in req.body gets removed)
        // so in this case, we'll simply consider "[preview]id[/preview]" as plain text
        if (!drawing){
            done(null, match);
            return;
        }
        // here, "[preview]id[/preview]" may not be plain text, because drawing is defined
        saveDrawingToDisk(drawing[id], function(filepath){
            if (filepath) done(null, '[img]' + filepath + '[/img]');
            else done(null, match); // 1st parameter of done is err to be passed to the callback
        });
    }, callback);
};

_h.isValidAge = function(age){
    age = parseInt(age);
    if (!age) return;
    if (_.isNumber(age) && age >= 1 && age <= 70) return true;
    else return false;
};

_h.isValidGender = function(gender){
    if (gender == 'female' || gender == 'male') return true;
    else return false;
};

// round a number to certain decimals
_h.round = function(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// calculate distance between 2 coordinates (return in km)
_h.distance = function(x, y){
    if (!(_.isArray(x) && _.isArray(y) && x.length == 2 && y.length == 2)) {
        return 'Unknown';
    }
    var lon1 = x[0], lon2 = y[0], lat1 = x[1], lat2 = y[1];
    var R = 6371000; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2-lat1);
    var Δλ = toRadians(lon2-lon1);
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    var result = _h.round(d/1000, 2); // 2 decimals max
    if (result > 100) result = parseInt(result); // if distance > 100, round to unit
    return result + 'km';
};

// swap 2 elements of an array [a,b] -> [b,a], used atm for coordinates cuz geoip and mongo
// use different standard
_h.swap = function(x){
    return [x[1], x[0]];
};

// convert IP to [ longitude, latitude ], used in MongoDB database
_h.coordinates = function(ip){
    ip = _h.cleanIP(ip);
    var geo = geoip.lookup(ip);
    if (!geo || !_.isArray(geo.ll) || geo.ll.length != 2) {
        console.error('unable to lookup ip', ip);
        return [0, 0];
    }
    return _h.swap(geo.ll);
};

// get IP of a request object
_h.reqIp = function(req){
    return req.ip ||
    req.headers['x-forwarded-for'] ||
    (req.connection ? req.connection.remoteAddress : null) ||
    (req.socket ? req.socket.remoteAddress : null) ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// get IP of a socket object
_h.socketIP = function(socket){
    if (!socket) return null;
    var a = (socket.client && socket.client.request && socket.client.request.headers) ? socket.client.request.headers['x-forwarded-for'] : null;
    if (a) return a;
    var b = (socket.client && socket.client.conn) ? socket.client.conn.remoteAddress : null;
    if (b) return b;
    var c = (socket.conn) ? socket.conn.remoteAddress : null;
    if (c) return c;
    var d = (socket.request && socket.request.connection) ? socket.request.connection.remoteAddress : null;
    return d;
};

// wrapper for JSON.parse to catch exception
_h.toJSON = function(s){
    var result;
    if (s){
        try {
            result = JSON.parse(s);
        } catch(e) {
            console.error('_h.toJSON err:', s, arguments);
        }
    }
    return result;
};

// remove the ?_=timestamp in query string that I used in JQuery to
// counter IE caching GET request
_h.withoutQueryTime = function(s){
    return s.split('?_=')[0];
};

// check if it's a valid MongoDB objectID
_h.isValidObjectId = function(s){
    if (s.match(/^[0-9a-fA-F]{24}$/)) return true;
    else return false;
};

// Call fn once condition is satisfied. Use this instead of while to avoid blocking main thread
// Both parameters are functions.
_h.executeWhen = function(fn, condition){
    process.nextTick(function(){
        if (condition()) fn();
        else _h.executeWhen(fn, condition);
    });
}

// memory size of an object in bytes
_h.memorySize = function(object) {
    var objectList = [];
    var stack = [ object ];
    var bytes = 0;
    while ( stack.length ) {
        var value = stack.pop();
        if ( typeof value === 'boolean' ) {bytes += 4;}
        else if ( typeof value === 'string' ) {bytes += value.length * 2;}
        else if ( typeof value === 'number' ) { bytes += 8;}
        else if(typeof value === 'object' && objectList.indexOf( value ) === -1){
            objectList.push( value );
            for( var i in value ) stack.push( value[ i ] );
        }
    }
    return bytes;
};

// refresh the expiration time of a user's session
// (this affects how long the session and user cache last in redis)
_h.refreshSession = function(req, ttl){
    req.session.cookie.maxAge = ttl; // in ms
    req.session.save();
};

// print current memory/cpu usage (MIGHT BE CAUSING MEMORY LEAK!)
// _h.memoryUsage = function(id, cb){
//     cb = _.isFunction(cb) ? cb : function(){};
//     usage.lookup(process.pid, { keepHistory: true }, function(err, result) {
//         if (err) console.error('MEMORY USAGE err:', err);
//         console.log('\n-------------------');
//         if (id) {
//             console.log('ID:', id);
//         }
//         if (result){
//             if (result.memory) {
//               console.log('memory:', _h.round(result.memory/1000000, 2) + 'MB');
//             }
//             if (result.memoryInfo && result.memoryInfo.rss) {
//               console.log('rss:', _h.round(result.memoryInfo.rss/1000000, 2) + 'MB');
//             }
//             if (result.memoryInfo && result.memoryInfo.rss) {
//               console.log('vsize:', _h.round(result.memoryInfo.vsize/1000000, 2) + 'MB');
//             }
//             if (result.cpu) {
//               console.log('cpu:', result.cpu + '%');
//             }
//         }
//         console.log('-------------------\n');
//         cb();
//     });
// };


// Get geo from IP
_h.geo = function(ip){
    var geo = geoip.lookup(_h.cleanIP(ip));
    return geo || {};
};

// test if IP address is valid (IPv4 or IPv6)
_h.isValidIP = function(ip){
    if (!ip) return false;
    ip = String(ip);
    ip = _h.cleanIP(ip);
    if (ip.length < 7) return false;
    var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
    return expression.test(ip);
};