global lastDripTurn = -5;
global lastHelmetTurn = -4;
global lastCureTurn = -2;
global lastBandageTurn = 0;
global lastMotivationTurn = -3;
global lastSteroidTurn = -4;
global lastProteinTurn = -3;

function canUseDrip()
{
	return getTP() >= getChipCost(CHIP_DRIP) and getTurn() - lastDripTurn >=getChipCooldown(CHIP_DRIP);
}
function canUseCure()
{
	return getTP() >=getChipCost(CHIP_CURE) and getTurn() - lastCureTurn >=getChipCooldown(CHIP_CURE);
}
function canUseBandage()
{
	return getTP() >=getChipCost(CHIP_BANDAGE) and getTurn() - lastBandageTurn >= getChipCooldown(CHIP_BANDAGE);
}
function canUseMotivation()
{
	return getTP() >=getChipCost(CHIP_MOTIVATION) and getTurn() - lastMotivationTurn >=getChipCooldown(CHIP_MOTIVATION);
}
function canUseProtein()
{
	return getTP() >=getChipCost(CHIP_PROTEIN) and getTurn() - lastProteinTurn >=getChipCooldown(CHIP_PROTEIN);
}
function canUseSteroid()
{
	return getTP() >=getChipCost(CHIP_STEROID) and getTurn() - lastProteinTurn >=getChipCooldown(CHIP_STEROID);
}
function canHeal()
{
	return canUseBandage() or canUseCure() or canUseDrip();
}
function canBoost()
{
	return canUseSteroid() or canUseProtein() or canUseMotivation();
}


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

function LaunchChip(chip, leek, cell, maxTPtoUse)
{
	var res;
	if (leek != null)
		res=useChip(chip,leek);
	else if (cell != null)
		res = useChipOnCell(chip, cell);
	debug(getChipName(chip) + " : "+res);
	if(res==USE_SUCCESS or res==USE_FAILED)
	{
		maxTPtoUse -= getChipCost(chip);
		if (res == USE_SUCCESS)
		{
			if (chip == CHIP_BANDAGE)
				lastBandageTurn = getTurn();
			else if (chip == CHIP_CURE)
				lastCureTurn = getTurn();
			else if (chip == CHIP_DRIP)
				lastDripTurn = getTurn();
			else if (chip == CHIP_HELMET)
				lastHelmetTurn = getTurn();
			else if (chip == CHIP_MOTIVATION)
				lastMotivationTurn = getTurn();
			else if (chip == CHIP_STEROID)
				lastSteroidTurn = getTurn();
			else if (chip == CHIP_PROTEIN)
				lastProteinTurn = getTurn();
		}
	}
	return maxTPtoUse;
}

function SelfBoosterTurn(maxTPtoUse)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("SelfBoosterTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	if (maxTPtoUse >=4)
	{
		if (maxTPtoUse >= 7)
		{
			LaunchChip(CHIP_STRETCHING, getLeek(),null,getTP()); //3TP
		}
		LaunchChip(CHIP_HELMET, getLeek(),null,getTP()); //4TP	
	}
}

function BoosterTurn(maxTPtoUse,leek)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("BoosterTurn ("+getName(leek)+") : " + maxTPtoUse+"/"+getTP()+"TP et "+getLife(leek)+"/"+getTotalLife(leek)+"HP" );
	
	var res = 1; //SUCCESS
	if (maxTPtoUse >= 6 and getCorrectDistance(leek) <= 4 and leek != getLeek())
	{
		maxTPtoUse = LaunchChip(CHIP_STEROID,leek,null,maxTPtoUse);
	}
	res = 1; //SUCCESS
	if (maxTPtoUse >= 3 and getCorrectDistance(leek) <= 5)
	{
		maxTPtoUse = LaunchChip(CHIP_MOTIVATION,leek,null,maxTPtoUse);
	}
	res = 1; //SUCCESS
	if (maxTPtoUse >= 3 and getCorrectDistance(leek) <= 4 and leek != getLeek())
	{
		maxTPtoUse = LaunchChip(CHIP_PROTEIN,leek,null,maxTPtoUse);
	}
	
}

function DamageTurn(enemy,maxTPtoUse)
{
	if (getWeapon() != WEAPON_MAGNUM)
		setWeapon(WEAPON_MAGNUM); // Attention : coûte 1 PT

	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("DamageTurn : " + maxTPtoUse+"/"+getTP()+"TP");
	debug("Enemy Life : " + getLife(enemy) +"/"+getTotalLife(enemy));
	
	//0. Boost Damage
	if (maxTPtoUse >=5)
	{
		maxTPtoUse = LaunchChip(CHIP_MOTIVATION,getLeek(),null,maxTPtoUse);
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
	/*while (maxTPtoUse >=3 and used)
	{
		var tmp = maxTPtoUse;
		maxTPtoUse = LaunchChip(CHIP_SPARK,enemy,maxTPtoUse,3);
		used = (tmp != maxTPtoUse);
	}*/
	
	//3. Caillou
	if (maxTPtoUse >=2)
	{
		maxTPtoUse = LaunchChip(CHIP_PEBBLE,enemy,null,maxTPtoUse);
	}
	used = true;
	//4. Eclair
	/*while (maxTPtoUse >=2 and used)
	{
		var tmp = maxTPtoUse;
		maxTPtoUse = LaunchChip(CHIP_SHOCK,enemy,maxTPtoUse,2);
		used = (tmp != maxTPtoUse);
	}*/	
}


function HealTurn(maxTPtoUse, leek)
{
	if (maxTPtoUse > getTP())
		maxTPtoUse = getTP();
	debug("HealTurn ("+getName(leek)+") : " + maxTPtoUse+"/"+getTP()+"TP et "+getLife(leek)+"/"+getTotalLife(leek)+"HP" );
	var hpLost = getTotalLife(leek) - getLife(leek);
	
	var res = 1; //SUCCESS
 	if (maxTPtoUse >=4 and hpLost > 60)
	{
		maxTPtoUse = LaunchChip(CHIP_CURE,leek,null,maxTPtoUse);
	}
	res =1; //SUCCESS
	if (maxTPtoUse >=2  and getLife(leek) != getTotalLife(leek))
	{
		maxTPtoUse = LaunchChip(CHIP_BANDAGE,leek,null,maxTPtoUse);
	}
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

function getMinPVEnemy() {
    var i;
    var enemy = getNearestEnemy();
	var minPV = 0;
    var tabEnemies = getAliveEnemies();
    for (i=0; i< count(tabEnemies); i++)
    {
		if (getLife(tabEnemies[i]) < minPV)
		{
			enemy = tabEnemies[i];
			minPV = getLife(enemy);
		}
    }
    return enemy;
}


function PVLost(leek)
{
	return getTotalLife(leek) - getLife(leek);
}

//Fonctions pour DRIP

function getLostHPLeeks(tab) {
    var res = [];
    for (var i=0; i< count(tab); i++)
    {
		if (PVLost(tab[i]) > 0)
		{
			push(res, tab[i]);
		}
    }
    return res;
}

function filterDistance(tab,distanceMax)
{
	var res = [];
	for (var i = 0; i< count(tab);i++)
	{
		if (getCellDistance(getCell(), getCell(tab[i])) <= distanceMax)
		{
			push(res,tab[i]);
		}
	}
	return res;
}

function estimateHeal(leek,cell)
{
	var distanceFromImpact = getCellDistance(cell, getCell(leek));
	if (distanceFromImpact > 2)
		return 0;
	//else
	var hp = min(90,PVLost(leek));
	var efficiency = [1,0.75,0.5];
	if (leek == getLeek())
		return hp *0.5;
	//else
	return hp * efficiency[distanceFromImpact];
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
	
	say(sentences[randInt(0, count(sentences))]);
	maxTPtoUse--;
}

var enemy = getMinPVEnemy();
	
//0. On booste l'agilité dès que possible
if (getTurn() > 2)
{
	LaunchChip(CHIP_STRETCHING, getLeek(),null,getTP());
}

var hpLost = getTotalLife() - getLife();

if (getTurn() >= 2 and (getTurn() - lastHelmetTurn >= 4))
{
	SelfBoosterTurn(getTP());
}
if (
	((getTurn() - lastHelmetTurn == 1) and hpLost > 80)
	or ((getTurn() - lastHelmetTurn == 3) and hpLost > 140)
	or (hpLost > 300)
	)
{
	HealTurn(getTP(),getLeek());
}

//1. On soigne qui on peut
var toGo = getNearestAlly();
if (count(getAliveAllies()) <=2)
{
	//On n'est plus beaucoup, on va tapper aussi
	toGo =enemy;
}
if (canHeal() or canBoost())
{
	debug("canUseDrip : "+canUseDrip());
	//1.5 On tente le heal de masse
	if (canUseDrip())
	{	
		var allies = filterDistance(getLostHPLeeks(getAliveAllies()),10);
		debug("Wounded Allies :"+join(allies, ", "));
		var enemies = filterDistance(getLostHPLeeks(getAliveEnemies()),10);
		
		var cells = [];
		
		//Toutes les cellules candidates
		for (var i=0;i<count(allies);i++)
		{
			var x = getCellX(getCell(allies[i]));
			var y = getCellY(getCell(allies[i]));
			for (var dx =-2; dx<=2;dx++)
			{
				for (var dy =-2; abs(dx)+abs(dy) <=2;dy++)
				{
					var cell = getCellFromXY(x+dx, y+dy);
					if (cell != null and !inArray(cells, cell))
						push(cells,cell);
				}
			}
		}
		
		var zeCell = null;
		var maxEfficiency = 0;
		var nbTarget = 0;
		for (var i =0; i< count(cells);i++)
		{
			var nt = 0;
			var s = 0;
			for (var j =0;j<count(allies);j++)
			{
				var ds = estimateHeal(allies[j],cells[i]);
				s += ds;
				if (ds >0)
				{
					nt++;
				}
			}
			
			for (var j =0;j<count(enemies);j++)
			{
				s-=estimateHeal(enemies[j],cells[i]);
			}
			if (s > maxEfficiency)
			{
				zeCell = cells[i];
				maxEfficiency = s;
				nbTarget = nt;
			}
		}
		if (zeCell != null)
			debug("Optim Cell ("+getCellX(zeCell)+","+getCellY(zeCell)+"), estimation "+maxEfficiency+", nbTargets : "+nbTarget);
		else
			debug("No cell reachable to heal allies");
		if (zeCell != null
			and maxEfficiency > 50
			and (nbTarget >= 2 or (maxEfficiency > 80 and !canUseCure())))
		{
			var pmUsed = 1;
			while (pmUsed > 0 and getCellDistance(getCell(), zeCell) <=1)
			{
				pmUsed = moveAwayFromCell(zeCell);
			}
			while (pmUsed > 0 and getCellDistance(getCell(), zeCell) > 2)
			{
				pmUsed = moveTowardCell(zeCell);
			}
			LaunchChip(CHIP_DRIP,null,zeCell,getTP());
		}
	}
	
	var nbAllies = count(getAliveAllies());
	var except = [];
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
		if (ally != null and (getCorrectDistance(ally) -getMP() <= 6))
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
			if (ally == null or PVLost(ally) == 0)
			{
				debug("Nobody lost PV, moving toward enemy.");
				break;
			}
			debug("Cannot reach "+getName(ally)+". Moving to the next wounded ally.");
			push(except, ally);
		}	
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
	if (distance <= 8)
	{
		if (hpLost >50 and getLife(enemy)> 50)
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

if (getTurn() < 2 and (getTurn() - lastHelmetTurn >= 4))
{
	SelfBoosterTurn(getTP());
}

if (canBoost())
{
	//Utile si on n'a pas pu booster le gars voulu
	BoosterTurn(getTP(),getNearestAlly());
}
//Si jamais on peut
LaunchChip(CHIP_MOTIVATION, getLeek(),null,getTP());
LaunchChip(CHIP_STRETCHING, getLeek(),null,getTP());

if (getMP() > 0 and getNearestAlly() != null and getCorrectDistance(getNearestAlly()) <= 1)
	moveAwayFrom(getNearestAlly(),1);

DoNothing(getTP());

debug("life");
debug(getLife());
