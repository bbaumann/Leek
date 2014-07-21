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

function boosterTurn(maxTPtoUse)
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

function DamageTurn(enemy,maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("DamageTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	debug("Enemy Life : " + getLife(enemy) +"/"+getTotalLife(enemy));
	//1. On tire tant qu'on peut
	var res = 1; //SUCCESS
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

function HealTurn(maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("HealTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	
	var res = 1; //SUCCESS
 	if (maxTPtoUse >=4 and getLife() != getTotalLife())
	{
		res = useChip(CHIP_CURE,getLeek()); //4TP
		if (res ==USE_SUCCESS or res == USE_FAILED)
			maxTPtoUse = maxTPtoUse -4;
	}
	res =1; //SUCCESS
	if (maxTPtoUse >=2  and getLife() != getTotalLife())
	{
		res = useChip(CHIP_BANDAGE,getLeek()); //2TP
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
	"Mais qu'allait-il donc faire dans ce potager?!"];
	while (maxTPtoUse >=1)
	{
		say(sentences[randInt(0, count(sentences))]);
		maxTPtoUse--;
	}
}

//--------------------------------
//------- Code de base -----------
//--------------------------------


// On récupère l'ennemi le plus proche
var enemy = getNearestEnemy();
if (getWeapon() == -1)
	setWeapon(WEAPON_PISTOL); // Attention : coûte 1 PT

//On se booste quand round % 4 = 2
var modulo = getTurn();
while (modulo >=4)
{
	modulo = modulo -4;
}
if (modulo ==2)
{
	boosterTurn(getTP());
	moveAwayFrom(enemy,2);
}
else
{
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
			if (getLife() <200 and getLife(enemy)> 30)
			{
				DamageTurn(enemy,6);
				HealTurn(2);
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
	if (flee)
	{
		var cell = RunAwayInParallel(enemyCell,2);
		moveTowardCell(cell);
		cell = RunAwayInParallel(enemyCell,2);
		moveTowardCell(cell);
	}
}
var hpLost = getTotalLife() - getLife();
if (hpLost >50)
{
	HealTurn(getTP());
}
else if (hpLost > 10)
{
	HealTurn(2);
}

if (getTurn() > 1 and getTP() >= 3)
{
	useChip(CHIP_STRETCHING, getLeek());
}

DoNothing(getTP());

debug("life");
debug(getLife());
