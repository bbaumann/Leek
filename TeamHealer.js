//IA Casque
function RunAwayInX(difX, myCellx, myCelly, offset)
{
if(difX > 0)
return getCellFromXY(myCellx+offset, myCelly);
else
return getCellFromXY(myCellx-offset, myCelly);
}
function RunAwayInY(difY, myCellx, myCelly, offset)
{
if(difY > 0)
return getCellFromXY(myCellx, myCelly+offset);
else
return getCellFromXY(myCellx, myCelly-offset);
}

function RunAwayInParallel(cellTRAF, offset)
{
var myCell = getCell();
var myCellx = getCellX(myCell);
var myCelly = getCellY(myCell);
var cellTRAFx = getCellX(cellTRAF);
var cellTRAFy = getCellY(cellTRAF);
var difX = myCellx - cellTRAFx;
var difY = myCelly - cellTRAFy;
if(abs(difX) < abs(difY))//run away in x first if better
{
var resultx = RunAwayInX(difX, myCellx, myCelly, offset);
if(resultx != null)//else out of range => change axis
return resultx;
}
var resulty = RunAwayInY(difY, myCellx, myCelly, offset);
if(resulty != null)//else out of range => change axis
return resulty;
if(abs(difX) >= abs(difY))//change axis et on n'a pas fait x
{
var resultx = RunAwayInX(difX, myCellx, myCelly, offset);
if(resultx != null)//else out of range => change axis
return resultx;
}
//Ici on est dans un coin
return null;
}

function getCorrectDistance(enemyCell) {
	return getCellDistance(getCell(), enemyCell);
}

function SelfBoosterTurn(maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("BoosterTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	if (maxTPtoUse >=4)
	{
		if (maxTPtoUse >= 7)
		{
			useChip(CHIP_STRETCHING, getLeek()); //3TP
		}
		useChip(CHIP_HELMET, getLeek()); //4TP	
	}
}

function BoosterTurn(maxTPtoUse,leek)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("BoosterTurn ("+getName(leek)+") : " + maxTPtoUse+"/"+getTP()+"TP et "+getLife(leek)+"/"+getTotalLife(leek)+"HP" );
	
	var res = 1; //SUCCESS
	if (maxTPtoUse >= 3 and getCorrectDistance(leek) <= 4)
	{
		res = useChip(CHIP_PROTEIN, leek);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse -= 3;
	}
	res = 1; //SUCCESS
	if (maxTPtoUse >= 3 and getCorrectDistance(leek) <= 5)
	{
		res = useChip(CHIP_MOTIVATION, leek);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse -= 3;
	}
}

function DamageTurn(enemy,maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("DamageTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	debug("Enemy Life : " + getLife(enemy) +"/"+getTotalLife(enemy));
	
	var res = 1; //SUCCESS
	//0. Boost Damage
	if (maxTPtoUse >=5)
	{
		res = useChip(CHIP_PROTEIN,getLeek()); //3PT
		debug("CHIP_PROTEIN : "+res);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse = maxTPtoUse -3;
	}
	res = 1; //SUCCESS
	//1. On tire tant qu'on peut
	while (maxTPtoUse >=3 and (res ==USE_SUCCESS or res == USE_FAILED))
	{
		res = useWeapon(enemy); //3PT
		debug("Pistol : "+res);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse -= 3;
	}
	res =1; //SUCCESS
	//2. Etincelle tant qu'on peut
	while (maxTPtoUse >=3 and (res ==USE_SUCCESS or res == USE_FAILED))
	{
		res= useChip(CHIP_SPARK,enemy); //3PT
		debug("CHIP_SPARK : "+res);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse -= 3;
	}
	res =1; //SUCCESS
	//3. Caillou
	if (maxTPtoUse >=2)
	{
		res = useChip(CHIP_PEBBLE,enemy); //2PT
		debug("CHIP_PEBBLE : "+res);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse = maxTPtoUse -2;
	}
	res =1; //SUCCESS
	//4. Eclair
	while (maxTPtoUse >=2 and (res ==USE_SUCCESS or res == USE_FAILED))
	{
		res = useChip(CHIP_SHOCK,enemy); //2PT
		debug("CHIP_SHOCK : "+res);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse = maxTPtoUse -2;
	}	
}


function HealTurn(maxTPtoUse, leek)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("HealTurn ("+getName(leek)+") : " + maxTPtoUse+"/"+getTP()+"TP et "+getLife(leek)+"/"+getTotalLife(leek)+"HP" );
	var hpLost = getTotalLife(leek) - getLife(leek);
	
	var res = 1; //SUCCESS
 	if (maxTPtoUse >=4 and hpLost > 40)
	{
		res = useChip(CHIP_CURE,leek); //4TP
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse = maxTPtoUse -4;
	}
	res =1; //SUCCESS
	if (maxTPtoUse >=2  and getLife(leek) != getTotalLife(leek))
	{
		res = useChip(CHIP_BANDAGE,leek); //2TP
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse = maxTPtoUse -2;
	}
}

function DoNothing(maxTPtoUse)
{
	debug("DoNothing : " + maxTPtoUse+"/"+getTP()+"TP");
	var sentences = ["Je veux une bière, sinon...",
	"Excusez-moi, c'est bien par là la garden party?",
	"Je l'aurai, je l'aurai!",
	"Crève pourriture de communiste!",
	"Tu as un morceau de patate là!",
	"Auto-destruction du poireau dans 25secondes",
	"Scotty!",
	"Accélération en cours, vitesse limite, 88Mph",
	"Hasta la vista baby",
	"La merveille, la merveille...non!",
	"Encore un coup de ton ISP",
	"Salut Beau Navet!",
	"On s'appelle on s'fait un pot au feu?",
	"Je vous donne jusqu'à 3 et après paf pastèque!",
	"Ce sprint part en couille",
	"La bave du poivron n'atteint pas le blanc du poireau",
	"Touche pas à mon pot'iron!",
	"Atchoum!",
	"Mais qu'allait-il donc faire dans ce potager?!",
	"Aujourd'hui, corvée de courses. J'ai sursauté et failli hurler dans la rue \r\n en pensant que quelqu'un était en train de me toucher les fesses. Le coupable était un poireau qui dépassait de mon cabas. VDM. \r\n GNIARK GNIARK GNIARK",
	"Gniark gniark gniark!",
	"PAF Pastèque!",
	"Oh! La belle prise!",
	"Si tu ne te laisse pas faire, je t'envoie fissa chez Géant Vert!"];
	while (maxTPtoUse >=1)
	{
		say(sentences[randInt(0, count(sentences))]);
		maxTPtoUse--;
	}
}

function PVLost(leek)
{
	return getTotalLife(leek) - getLife(leek);
}

function getMaxLostHPAlly(except) {
    var i;
    var ally = getNearestAlly();
    var tabAllies = getAliveAllies();
    for (i=0; i< count(tabAllies); i++)
    {
		if (inArray(except, tabAllies[i]))
		{
		}
		else
		{
			if (PVLost(tabAllies[i]) > PVLost(ally))
			{
				ally = tabAllies[i];
			}
		}
    }
    return ally;
}


//--------------------------------
//------- Code de base -----------
//--------------------------------

if (getWeapon() == -1)
	setWeapon(WEAPON_PISTOL); // Attention : coûte 1 PT
	
//0. On booste l'agilité dès que possible
if (getTurn() > 2)
{
	useChip(CHIP_STRETCHING, getLeek());
}

var hpLost = getTotalLife() - getLife();

//On se booste quand round % 4 = 2
var modulo = getTurn() % 4;
if (modulo ==2)
{
	SelfBoosterTurn(getTP());
}
else if ((modulo == 3 and hpLost > 70) || (modulo == 1 and hpLost > 100))
{
	HealTurn(getTP(),getLeek());
}

//1. On soigne qui on peut
var nbAllies = count(getAliveAllies());
var except = [];
while(count(except) != nbAllies)
{
	var ally = getMaxLostHPAlly(except);
	if (getCorrectDistance(ally) -getMP() <= 6)
	{
		var boostOther = false;
		if (getCorrectDistance(ally) -getMP() == 6)
			boostOther =true;
		while (getCorrectDistance(ally) >= 4)
		{
			if (boostOther)
			{
				var other = getNearestAlly();
				if (other != ally)
				{
					BoosterTurn(other,getTP());
				}
			}
			moveToward(ally);
		}
		HealTurn(getTP(),ally);
		BoosterTurn(getTP(),ally);
		break;
	}
	else
	{
		push(except, ally);
	}	
}
if (nbAllies == 0)
{
	var enemy = getNearestEnemy();
	
	moveToward(enemy,4);
	//Test, on lance toujours motivation
	
	var enemyCell = getCell(enemy);
	var flee = false;
	var distance = 99;
	var pmUsed = 999;
	while (pmUsed > 0 and getTP() >=2 and flee == false)
	{
		distance = getCorrectDistance(enemyCell);
		debug(distance);
		if (distance <= 10)
		{
			if (hpLost >30 and getLife(enemy)> 50)
			{
				HealTurn(2,getLeek());
				DamageTurn(enemy,getTP());
				
			}
			else
			{
				DamageTurn(enemy,getTP());
			}
			flee = true;
		}
		else
		{
			pmUsed = moveToward(enemy,1);
		}
	}
	moveToward(enemy,4);
}

if (hpLost >50)
{
	HealTurn(getTP(),getLeek());
}
else if (hpLost > 10)
{
	HealTurn(2,getLeek());
}

if (getTurn() > 1 and getTP() >= 3)
{
	useChip(CHIP_STRETCHING, getLeek());
}

DoNothing(getTP());

debug("life");
debug(getLife());
