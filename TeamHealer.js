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

function getCorrectDistance(enemy) {
	return getCellDistance(getCell(), getCell(enemy));
}

function LaunchChip(chip, leek, maxTPtoUse, TP)
{
	var res=useChip(chip,leek);
	debug(getChipName(chip) + " : "+res);
	if(res==USE_SUCCESS or res==USE_FAILED)
		maxTPtoUse -= TP;
	
	return maxTPtoUse;
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
	if (maxTPtoUse >= 3 and getCorrectDistance(leek) <= 4 and leek != getLeek())
	{
		maxTPtoUse = LaunchChip(CHIP_PROTEIN,leek,maxTPtoUse,3);
	}
	res = 1; //SUCCESS
	if (maxTPtoUse >= 3 and getCorrectDistance(leek) <= 5)
	{
		maxTPtoUse = LaunchChip(CHIP_MOTIVATION,leek,maxTPtoUse,3);
	}
}

function DamageTurn(enemy,maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("DamageTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	debug("Enemy Life : " + getLife(enemy) +"/"+getTotalLife(enemy));
	
	//0. Boost Damage
	if (maxTPtoUse >=5)
	{
		maxTPtoUse = LaunchChip(CHIP_MOTIVATION,getLeek(),maxTPtoUse,3);
	}
	var res = USE_SUCCESS; //SUCCESS
	//1. On tire tant qu'on peut
	while (maxTPtoUse >=3 and (res ==USE_SUCCESS or res == USE_FAILED))
	{
		res = useWeapon(enemy); //3PT
		debug("Pistol : "+res);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse -= 3;
	}
	var used =true; //SUCCESS
	//2. Etincelle tant qu'on peut
	while (maxTPtoUse >=3 and used)
	{
		var tmp = maxTPtoUse;
		maxTPtoUse = LaunchChip(CHIP_SPARK,enemy,maxTPtoUse,3);
		used = (tmp != maxTPtoUse);
	}
	
	//3. Caillou
	if (maxTPtoUse >=2)
	{
		maxTPtoUse = LaunchChip(CHIP_PEBBLE,enemy,maxTPtoUse,2);
	}
	used = true;
	//4. Eclair
	while (maxTPtoUse >=2 and used)
	{
		var tmp = maxTPtoUse;
		maxTPtoUse = LaunchChip(CHIP_SHOCK,enemy,maxTPtoUse,2);
		used = (tmp != maxTPtoUse);
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
		maxTPtoUse = LaunchChip(CHIP_CURE,leek,maxTPtoUse,4);
	}
	res =1; //SUCCESS
	if (maxTPtoUse >=2  and getLife(leek) != getTotalLife(leek))
	{
		maxTPtoUse = LaunchChip(CHIP_BANDAGE,leek,maxTPtoUse,2);
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
	"Je compte jusqu'à 3 et après paf pastèque!",
	"Ce sprint part en couille",
	"La bave du poivron n'atteint pas le blanc du poireau",
	"Touche pas à mon pot'iron!",
	"Atchoum!",
	"Mais qu'allait-il donc faire dans ce potager?!",
	"Aujourd'hui, corvée de courses. J'ai sursauté et failli hurler dans la rue	en pensant que quelqu'un était en train de me toucher les fesses. Le coupable était un poireau qui dépassait de mon cabas. VDM. GNIARK GNIARK GNIARK",
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
	var maxPVLost = 0;
    var tabAllies = getAliveAllies();
    for (i=0; i< count(tabAllies); i++)
    {
		if (inArray(except, tabAllies[i]))
		{
		}
		else
		{
			if (PVLost(tabAllies[i]) > maxPVLost)
			{
				ally = tabAllies[i];
				maxPVLost = PVLost(ally);
			}
		}
    }
    return ally;
}


//--------------------------------
//------- Code de base -----------
//--------------------------------

var enemy = getNearestEnemy();

if (getWeapon() == null)
	setWeapon(WEAPON_MAGNUM); // Attention : coûte 1 PT
	
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
else if ((modulo == 3 and hpLost > 70) || (modulo != 2 and hpLost > 100))
{
	HealTurn(getTP(),getLeek());
}

//1. On soigne qui on peut
var nbAllies = count(getAliveAllies());
var except = [];
var toGo = enemy;
while(count(except) != nbAllies)
{
	var ally = getMaxLostHPAlly(except);
	if (PVLost(ally) == 0)
	{
		ally = getNearestAlly();
		debug("Considering Buffing "+getName(ally)+" (lost "+PVLost(ally)+"HP)");
	}
	else
	{
		if (count(except) == 0)
		{
			//C'est le gars qui a perdu le plus de HP, je dois aller vers lui à la fin.
			toGo = ally;
		}
		debug("Considering Healing "+getName(ally)+" (lost "+PVLost(ally)+"HP)");
	}
	if (getCorrectDistance(ally) -getMP() <= 6)
	{
		debug("Moving toward "+getName(ally));
		var boostOther = false;
		if (getCorrectDistance(ally) -getMP() == 6)
			boostOther =true;
		while (getCorrectDistance(ally) >= 4 and getMP() > 0)
		{
			if (boostOther)
			{
				var other = getNearestAlly();
				if (other != ally)
				{
					BoosterTurn(other,getTP());
				}
			}
			moveToward(ally,1);
		}
		HealTurn(getTP(),ally);
		BoosterTurn(getTP(),ally);
		if (PVLost(toGo) == 0)
		{
			toGo = enemy;
		}
		break;
	}
	else
	{
		if (PVLost(ally) == 0)
		{
			debug("Nobody lost PV, moving toward enemy.");
			break;
		}
		debug("Cannot reach "+getName(ally)+". Moving to the next wounded ally.");
		push(except, ally);
	}	
}

var enemyCell = getCell(enemy);
var flee = false;
var distance = 99;
var pmUsed = 999;
while (pmUsed > 0 and getTP() >=2 and flee == false)
{
	enemy = getNearestEnemy();
	enemyCell = getCell(enemy);
	distance = getCorrectDistance(enemy);
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
		if (getCorrectDistance(toGo) > 2 || isEnemy(toGo))
		{
			pmUsed = moveToward(toGo,1);
		}
		else
		{
			pmUsed = 0;
		}
	}
}
pmUsed = 1;
while ( (getCorrectDistance(toGo) > 2 or isEnemy(toGo)) and pmUsed >0)
{
	pmUsed = moveToward(toGo,1);
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

if (getMP() > 0 and getCorrectDistance(getNearestAlly()) <= 1)
	moveAwayFrom(getNearestAlly(),1);

DoNothing(getTP());

debug("life");
debug(getLife());
