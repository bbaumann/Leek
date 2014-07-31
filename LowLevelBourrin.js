//--------------------------------
//------- Code de base -----------
//--------------------------------
global zeWeapon;
global turn = 1;
turn ++;
//IA Casque
global lastHelmetTurn = -4;
if (turn >= 2 and (turn - lastHelmetTurn >= 4) )
{
	var res = useChip(CHIP_HELMET, getLeek()); //4TP	
	if (res == USE_SUCCESS)
	{
		lastHelmetTurn = turn;
	}
}

// On récupère l'ennemi le plus proche
var enemy = getNearestEnemy();

// On avance vers l'ennemi
var pmUsed = 1;
while (pmUsed > 0 and getCellDistance(getCell(), getCell(enemy)) > 2)
{
	pmUsed = moveToward(enemy,1);
}
pmUsed = 1;
while (pmUsed > 0 and getCellDistance(getCell(), getCell(enemy)) < 2)
{
	pmUsed = moveAwayFrom(enemy,1);
}

if (getLife()/getTotalLife() <= 0.2 and getLife(enemy) > 30)
{
	useChip(CHIP_BANDAGE,getLeek());
}

//Choose Weapon
if (getCellDistance(getCell(), getCell(enemy)) < 2)
{
	zeWeapon = WEAPON_PISTOL;
}
else
{
	zeWeapon = WEAPON_DOUBLE_GUN;
}

// On prend le pistolet
if (getWeapon() != zeWeapon)
	setWeapon(zeWeapon); // Attention : coûte 1 PT

var shootTP = 4;
if (getWeapon() == WEAPON_PISTOL)
	shootTP = 3;
// On essaye de lui tirer dessus
var res = USE_SUCCESS;
while (getTP() >= shootTP and (res == USE_SUCCESS or res == USE_FAILED) )
{
	res = useWeapon(enemy);
}

res = USE_SUCCESS;
while (getTP() >= 3 and (res == USE_SUCCESS or res == USE_FAILED) )
{
	res = useChip(CHIP_SPARK, enemy);
}
if (getLife()/getTotalLife() <= 0.2 and getLife(enemy) > 30)
{
	useChip(CHIP_BANDAGE,getLeek());
}

res = USE_SUCCESS;
while (getTP() >= 2 and (res == USE_SUCCESS or res == USE_FAILED) )
{
	res = useChip(CHIP_PEBBLE, enemy);
}

res = USE_SUCCESS;
while (getTP() >= 2 and (res == USE_SUCCESS or res == USE_FAILED) )
{
	res = useChip(CHIP_SHOCK, enemy);
}

if (getTotalLife() - getLife() != 0)
{
	useChip(CHIP_BANDAGE,getLeek());
}
