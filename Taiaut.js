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

function canUse(chip)
{
	return (getTP() >= getChipCost(chip) and getCurrentCooldown(chip) == 0);
}

function LaunchChip(chip, leek, maxTPtoUse)
{
	var res= useChip(chip,leek);
	debug(getChipName(chip) + " : "+res);
	if(res==USE_SUCCESS or res==USE_FAILED)
		maxTPtoUse -= getChipCost(chip);
	
	return maxTPtoUse;
}

function boosterTurn(maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("BoosterTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	useChip(CHIP_ARMOR, getLeek()); //6TP	
	useChip(CHIP_HELMET, getLeek()); //4TP	
}

function DamageTurn(enemy,maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("DamageTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	debug("Enemy Life : " + getLife(enemy) +"/"+getTotalLife(enemy));
	
	//0. Boost Damage
	if (maxTPtoUse >=11)
	{
		maxTPtoUse = LaunchChip(CHIP_STEROID, getLeek(), maxTPtoUse);
	}	
	if (maxTPtoUse >=8)
	{
		maxTPtoUse = LaunchChip(CHIP_PROTEIN, getLeek(), maxTPtoUse);
	}
	var res = USE_SUCCESS; //SUCCESS
	//1. On tire tant qu'on peut
	while (maxTPtoUse >=5 and (res ==USE_SUCCESS or res == USE_FAILED))
	{
		res = useWeapon(enemy); //5PT
		debug("Pistol : "+res);
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse -= 5;
	}
}

function HealTurn(maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("HealTurn : " + maxTPtoUse+"/"+getTP()+"TP et "+getLife()+"/"+getTotalLife()+"HP" );
	var hpLost = getTotalLife() - getLife();
 	if (maxTPtoUse >=4 and hpLost > 140)
	{
		maxTPtoUse = LaunchChip(CHIP_CURE, getLeek(), maxTPtoUse);
	}
	if (maxTPtoUse >=2  and hpLost > 70)
	{
		maxTPtoUse = LaunchChip(CHIP_BANDAGE, getLeek(), maxTPtoUse);
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

//--------------------------------
//------- Code de base -----------
//--------------------------------


var hpLost = getTotalLife() - getLife();
// On récupère l'ennemi le plus proche
var enemy = getNearestEnemy();
if (getWeapon() == null)
	setWeapon(WEAPON_MAGNUM); // Attention : coûte 1 PT


moveToward(enemy,4);
//On lance toujours motivation et stretching
if (getLife(enemy)> 50)
{
	if (canUse(CHIP_MOTIVATION))
		useChip(CHIP_MOTIVATION, getLeek()); //3PT
	if (canUse(CHIP_STRETCHING))
		useChip(CHIP_STRETCHING, getLeek()); //3PT		
	boosterTurn(getTP());
	if (hpLost > 200)
	{
		HealTurn(getTP());
	}
}

var flee = false;
var distance = 99;
var pmUsed = 999;
while (pmUsed > 0 and getTP() >=2 and flee == false)
{
	distance = getCorrectDistance(enemy);
	debug(distance);
	if (distance <= 10)
	{
		DamageTurn(enemy,getTP());
		flee = true;
	}
	else
	{
		pmUsed = moveToward(enemy,1);
	}
}
if (flee)
{
	moveToward(enemy,4);
}
if (hpLost >50)
{
	HealTurn(getTP());
}

if (canUse(CHIP_STEROID))
{
	useChip(CHIP_STEROID, getLeek());
}
if (getTP() >= 3)
{
	useChip(CHIP_PROTEIN, getLeek());
	useChip(CHIP_STRETCHING, getLeek());
}

DoNothing(getTP());

debug("life");
debug(getLife());
