include("Lib.Main");

global zeWeapon = WEAPON_MAGNUM;

// On récupère l'ennemi le plus proche
var enemy = getNearestEnemy();

var _canFinish = canFinish(enemy);
var _isWeak = isWeak(enemy);

if (getTurn() == 1)
{
	var res = useChip(CHIP_MOTIVATION, getLeek());
	if (res == USE_SUCCESS)
	{
		useChip(CHIP_HELMET, getLeek());
	}
	else
	{
		useChip(CHIP_MOTIVATION, getLeek());
		useChip(CHIP_PROTEIN, getLeek());
	}
	
}
if (getTurn() == 2)
{
	if (isMotivated())
	{
		useChip(CHIP_STEROID, getLeek());
		useChip(CHIP_PROTEIN, getLeek());		
	}
	else
	{
		useChip(CHIP_STEROID, getLeek());
	}
}

debug("Weak : "+ _isWeak+", BoostLevel : "+ getBoostLevel()+", Life : "+getLife()/getTotalLife()+", Enemy Life : "+getLife(enemy)/getTotalLife(enemy));

//1.Heal si situation critique
if ((getLife()/getTotalLife() <= 0.2
		&& !_canFinish
	) || (
		getLife()/getTotalLife() <= 0.3
		&& !_canFinish
		&& getBoostLevel() < 2
		&& !_isWeak
		)
	)
{
	var res = useChip(CHIP_CURE,getLeek());
	if (res == USE_FAILED)
		useChip(CHIP_CURE,getLeek());
}

//2. Casque dès qu'on peut 
if (getTurn() >= 5
	&& getCurrentCooldown(CHIP_HELMET) == 0
	&& !_canFinish
	&& !_isWeak
	&& !isInoffensive(enemy))
{
	var res = useChip(CHIP_HELMET, getLeek()); //4TP
	if (res == USE_FAILED)
		useChip(CHIP_HELMET, getLeek()); //4TP
}

var oldCell = getCell();
// On avance vers l'ennemi
var pmUsed = 1;
while (pmUsed > 0 && getCellDistance(getCell(), getCell(enemy)) > 2)
{
	if (checkLoS(getCell(), getCell(enemy))
		&& getCellDistance(getCell(), getCell(enemy)) <= STUFFS[zeWeapon][STUFF_SCOPE][STUFF_SCOPE_MAX])
		break;
	pmUsed = moveToward(enemy,1);
}
pmUsed = 1;
while (pmUsed > 0 && getCellDistance(getCell(), getCell(enemy)) < 2 )
{
	pmUsed = moveAwayFrom(enemy,1);
}
var isBlocked = (getCell() == oldCell && getCellDistance(getCell(), getCell(enemy)) == 1);

if (!_canFinish
	&& !_isWeak
	&& getBoostLevel() == 0)
{
	if (getTP() == 9)
	{
		useChip(CHIP_STEROID, getLeek()); //6
		useChip(CHIP_PROTEIN, getLeek()); //3
	}
	else if (getTP() == 8)
	{
		var res = useChip(CHIP_MOTIVATION, getLeek()); //3 -1
		if (res == USE_SUCCESS)
			useChip(CHIP_STEROID, getLeek()); // 6
		else
			useChip(CHIP_PROTEIN, getLeek()); //3
	}
	else
	{
		useChip(CHIP_STEROID, getLeek());
	}	
}

//Choose Weapon
if (isBlocked)
{
	zeWeapon = WEAPON_MAGNUM;
}
else if (getCellDistance(getCell(),getCell(getNearestEnemy())) <= 7 
		&&(getTP() >= 9 || getTP() <=5))
{
	zeWeapon = WEAPON_DOUBLE_GUN;
}

// On prend le pistolet
if (getWeapon() != zeWeapon)
	setWeapon(zeWeapon); // Attention : coûte 1 PT

// On essaye de lui tirer dessus
var res = USE_SUCCESS;
while (res == USE_SUCCESS || res == USE_FAILED && getWeapon() == zeWeapon)
{
	res = useWeapon(enemy);
	debug(res);
}

res = USE_SUCCESS;
while (getTP() >= 3 && (res == USE_SUCCESS || res == USE_FAILED) )
{
	res = useChip(CHIP_SPARK, enemy);
}

//Choose Weapon
if (getCellDistance(getCell(),getCell(enemy)) <= 9 && !isBlocked)
{
	zeWeapon = WEAPON_DOUBLE_GUN;
	if (getWeapon() != zeWeapon)
		setWeapon(zeWeapon); // Attention : coûte 1 PT
}

res = USE_SUCCESS;
while (getTP() >= 2 && (res == USE_SUCCESS || res == USE_FAILED) )
{
	res = useChip(CHIP_PEBBLE, enemy);
}

if (getTotalLife() - getLife() != 0 && getTP() >= 2)
{
	if (getTotalLife() - getLife() > 35)
		useChip(CHIP_CURE,getLeek());
	useChip(CHIP_BANDAGE,getLeek());
}

useChip(CHIP_MOTIVATION, getLeek());
moveToward(enemy);
