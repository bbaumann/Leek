include("Lib.Stuff");
//Lvl 0
function DoNothing(maxTPtoUse) {
	debug("DoNothing : " + maxTPtoUse + "/" + getTP() + "TP");
	var sentences = ["Je veux une bière, sinon...", "Excusez-moi, c'est bien par là la garden party?", "Je l'aurai, je l'aurai!", "Crève pourriture de communiste!", "Tu as un morceau de patate là!", "Auto-destruction du poireau dans 25secondes", "Scotty!", "Accélération en cours, vitesse limite, 88Mph", "Hasta la vista baby", "La merveille, la merveille...non!", "Encore un coup de ton ISP", "Salut Beau Navet!", "On s'appelle on s'fait un pot au feu?", "Je vous donne jusqu'à 3 et après paf pastèque!", "Ce sprint part en couille", "La bave du poivron n'atteint pas le blanc du poireau", "Touche pas à mon pot'iron!", "Atchoum!", "Mais qu'allait-il donc faire dans ce potager?!", "Aujourd'hui, corvée de courses. J'ai sursauté et failli hurler dans la rue \r\n en pensant que quelqu'un était en train de me toucher les fesses. Le coupable était un poireau qui dépassait de mon cabas. VDM. \r\n GNIARK GNIARK GNIARK", "Gniark gniark gniark!", "PAF Pastèque!", "Oh! La belle prise!", "Si tu ne te laisse pas faire, je t'envoie fissa chez Géant Vert!"];

	say(sentences[randInt(0, count(sentences))]);
}

function getHPLost(leek)
{
	return getTotalLife(leek) - getLife(leek);
}
function getPercentHPLost(leek)
{
	return (getTotalLife(leek) - getLife(leek))/getTotalLife(leek);
}

//Lvl 5
function RunAwayInX(difX, myCellx, myCelly, offset) {
	if (difX > 0) return getCellFromXY(myCellx + offset, myCelly);
	else return getCellFromXY(myCellx - offset, myCelly);
}

function RunAwayInY(difY, myCellx, myCelly, offset) {
	if (difY > 0) return getCellFromXY(myCellx, myCelly + offset);
	else return getCellFromXY(myCellx, myCelly - offset);
}

function RunAwayInParallel(cellTRAF, offset) {
	var myCell = getCell();
	var myCellx = getCellX(myCell);
	var myCelly = getCellY(myCell);
	var cellTRAFx = getCellX(cellTRAF);
	var cellTRAFy = getCellY(cellTRAF);
	var difX = myCellx - cellTRAFx;
	var difY = myCelly - cellTRAFy;
	if (abs(difX) < abs(difY)) //run away in x first if better
	{
		var resultx = RunAwayInX(difX, myCellx, myCelly, offset);
		if (resultx != null) //else out of range => change axis
		return resultx;
	}
	var resulty = RunAwayInY(difY, myCellx, myCelly, offset);
	if (resulty != null) //else out of range => change axis
	return resulty;
	if (abs(difX) >= abs(difY)) //change axis et on n'a pas fait x
	{
		var resultx = RunAwayInX(difX, myCellx, myCelly, offset);
		if (resultx != null) //else out of range => change axis
		return resultx;
	}
	//Ici on est dans un coin
	return null;
}

//Lvl 21
///Renvoie true si on voie la case end depuis la case start
function checkLoS(start, end){
    var difX = getCellX(end) - getCellX(start);
    var difY = getCellY(end) - getCellY(start);
    
    var dist = round(getDistance(start, end));
    if (dist == 0)
		return true;
    var dx = difX/dist;
    var dy = difY/dist;

    for(var i=1;i<dist;i++){
        var cell = getCellFromXY(round(getCellX(start) + dx*i),
                        round(getCellY(start) + dy*i));
        if(!isEmptyCell(cell)) return false;
    }
    return true;
}

//Lvl 7
///Lance une chip sur un poireau ou une cellule et renvoie les TPs autorisés restants
function LaunchChip(chip, leek, cell, maxTPtoUse) {
	var res = -42;
	if (leek !=null)
		res = useChip(chip, leek);
	else if (cell != null)
		res = useChipOnCell(chip, cell);
	debug(getChipName(chip) + " : " + res);
	if (res == USE_SUCCESS or res == USE_FAILED) maxTPtoUse -= getChipCost(chip);
	return maxTPtoUse;
}

//Lvl 36
//Check if the chip is available
function canUse(chip)
{
	return (getTP() >= getChipCost(chip)
		&& getCurrentCooldown(chip) == 0);
}

//Lvl 36
//Check if the chip is available and if the cell we want to use it is correct
function canUseOnCell(chip,cell)
{
	var myCell = getCell();
	var distance = getCellDistance(myCell, cell);
	return (getTP() >= getChipCost(chip)
		&& getCurrentCooldown(chip) == 0
		&& distance <= getChipMaxScope(chip)
		&& distance >= getChipMinScope(chip)
		&& (chip == CHIP_SPARK || checkLoS(myCell,cell))
		);
}




global lastDamageTurn = 0;
global previousHp = getLife();
if (getLife() < previousHp)
	lastDamageTurn = getTurn();

function isInoffensive(leek)
{
	if (getAliveEnemiesCount() != 1)
		return false;
	return (getLeekType(leek) != 1
		and (getTurn() > 30 
			and getTurn() - lastDamageTurn >=10
			)
			);
}

function isMotivated()
{
	var res = getCurrentCooldown(CHIP_MOTIVATION) > 1;
	return res;
}

function isWeak(leek)
{
	return getAbsoluteShield(leek) == 0;
}

global baseForce = getForce();
///Plus on est boosté en force, plus on retourne haut.
function getBoostLevel()
{
	var currentForce = getForce();
	if (currentForce <= baseForce)
		return 0;
	if (currentForce -baseForce <= 50)
		return 1;
	if (currentForce - baseForce <=100)
		return 2;
	//else
	return 9000;
}

function getLeekType(leek)
{
	var force = getForce(leek);
	var agility = getAgility(leek);
	var diff = force -agility;
	if (diff > 50 and diff/(force+agility) > 0.5)
	{
		//50pt de plus en force et ça représente au moins 50% de ses points
		return 1;
	}
	else if (diff < -50 and -1*diff/(force + agility) > 0.5)
	{
		//50pt de plus en agilité et ça représente au moins 50% de ses points
		return -1;
	}
	//else
	//équilibré
	return 0;
}

function canFinish(leek)
{
	var zeWeapon = getWeapon();
	if (zeWeapon != null)
	{
		var hp = getLife(leek);
		var dmg = 0;
		var maxTP = getTP();
		
		while (maxTP >= STUFFS[zeWeapon][STUFF_COST])
		{
			dmg += estimateWeaponDamage(zeWeapon,leek);
			maxTP -=  STUFFS[zeWeapon][STUFF_COST];
		}
		if (maxTP >= 3)
		{
			dmg += estimateChipDamage(CHIP_SPARK,leek);
		}
		return dmg >= hp;
	}
	return false;
}
