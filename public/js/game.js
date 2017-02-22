var idcount = 0;

function start()
{
   document.getElementById( "populate" ).addEventListener(
      "click", populate_base_game, false );
}

window.addEventListener( "load", start, false );


function populate_base_game(){
   var game_map = document.getElementById("game");
   var height = 50;
   var space_between_hex_top = 170;
   var space_between = 220;
   for(var i = 0;i < 19; i++){
      var newNode = document.createElement( "div" );
      newNode.setAttribute("id","hex"+i);

      if(i >= 0 && i <=2){
         newNode.setAttribute("class","hexagon");
         newNode.style.top = height+space_between_hex_top*0+"px";
         newNode.style.left = 500+i*space_between+"px";
      }
      else if(i >= 3 && i <= 6){
         newNode.setAttribute("class","hexagon");
         newNode.style.top = height+space_between_hex_top*1+"px";
         newNode.style.left = 400+(i-3)*space_between+"px";
      }
      else if(i>=7 && i<=11){
         newNode.setAttribute("class","hexagon");
         newNode.style.top = height+space_between_hex_top*2+"px";
         newNode.style.left = 300+(i-7)*space_between+"px";

      }
      else if( i >= 12 && i <= 15){
         newNode.setAttribute("class","hexagon");
         newNode.style.top = height+space_between_hex_top*3+"px";
         newNode.style.left = 400+(i-12)*space_between+"px";

      }
      else{
         newNode.setAttribute("class","hexagon");
         newNode.style.top = height+space_between_hex_top*4+"px";
         newNode.style.left = 500+(i-16)*space_between+"px";
      }
      game_map.appendChild(newNode);
   }
}