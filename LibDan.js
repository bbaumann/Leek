global myEnemy = 0;
global turn = -1;
turn++;

/**
* Use chips and get closer if necessary
*/
function useChipAndMoveIfNecessary(chipName, leek)
{
	var res = useChip(chipName, leek);
	for(var i = 0; i < 5; i++)
	{
		if(res != USE_INVALID_POSITION || getMP() == 0)
			break;
		moveToward(leek, 1);	
		res = useChip(chipName, leek);
	}
	
}

/**
* Return the minimum damage given your strength
* and your enemy protection
*/
function getWeaponPotentialDamages()
{
	var myLife = getLife();
	var enemyShieldAbs = getAbsoluteShield(myEnemy);
	var enemyShieldRel = getRelativeShield(myEnemy);
	var weapon = getWeapon();
	if(weapon == WEAPON_PISTOL)
		return 2*(15 * (1 + getForce()/100)*(1 - enemyShieldRel/100)- enemyShieldAbs);
	if(weapon == WEAPON_DOUBLE_GUN)
		return 2*((18 * (1 + getForce()/100)*(1 - enemyShieldRel/100)- enemyShieldAbs)
				+(5 * (1 + getForce()/100)*(1 - enemyShieldRel/100)- enemyShieldAbs));
	if(weapon == WEAPON_LASER)
		return (43 * (1 + getForce()/100)*(1 - enemyShieldRel/100)- enemyShieldAbs);
	if(weapon == WEAPON_GRENADE_LAUNCHER)
		return (45 * (1 + getForce()/100)*(1 - enemyShieldRel/100)- enemyShieldAbs);
}

/**
* Can I finish him now?
*/
function canFinishHim()
{
	var enemyLife = getLife(myEnemy);	
	return ((enemyLife - getWeaponPotentialDamages()) <= 10 || enemyLife <= 40);
}


/**
 * Fonction qui renvoie l'ennemi ayant la plus faible protection
 * @leek : tableau d'id de leek (aliveEnemies)
 */
function popLessProtectedLeek(@leeks)
{
	if(count(leeks) == 0) return null;
	var lessProtected = -1;
	for(var leek in leeks)
	{
		if(lessProtected == -1 
		|| getAbsoluteShield(lessProtected) >= getAbsoluteShield(leek))
			lessProtected = leek;
	}
	debug("less protected is " + getName(lessProtected) + " with " + getAbsoluteShield(lessProtected));
	removeElement(leeks, lessProtected);
	return lessProtected;
}

/**
 *  fonction qui crée un tableau avec toutes les cellules qui sont à entre distMin et distMax cellules de cell
 *  On s'assure bien que les cellules du centres sont biens en premier car elles font plus de dégâts
 *  Je retourne un tableau dont chaque éléments contient l'id de la cellule et le pourcentage de dégât (ou soin)
 *  qui sera appliqué à cette cellule
 */
function getListeCellEffet(cell, distMin, distMax)
{
    var listeCell = [];
    var x = getCellX(cell);
    var y = getCellY(cell);

    //on va faire que le cadran x positif et y positif et x >= y
    //ce qui représente 1/8 du repère
    //on va ensuite calculer par symétrie les 7 autres cadrans
    for( var i = distMin ; i <= distMax ; i++)
    {
        for( var j = distMin ; j <= i ; j++)
        {
            if(i + j >= distMin &&  i + j <= distMax)
            {       
                //si c'est le centre, les 4 cellules sont confondues,
                //il ne l'ajoute qu'une seule fois
                push(listeCell, [getCellFromXY(x + i, y + j), 50 * (2- ((i + j) / distMax))]);  

                //on ajoute les cellules des autres cadrans par symétrie
                if(i + j > 0)
                {
                    push(listeCell, [getCellFromXY(x - j, y + i), 50 * (2- ((i + j) / distMax))]);  
                    push(listeCell, [getCellFromXY(x - i, y - j), 50 * (2- ((i + j) / distMax))]);  
                    push(listeCell, [getCellFromXY(x + j, y - i), 50 * (2- ((i + j) / distMax))]); 
/////////////////////////////edit des cellules qui manquaient//////////////////////////////////
                    //j'évite les doublons
                    if( j > 0 && i != j)
                    {
                        push(listeCell, [getCellFromXY(x + j, y + i), 50 * (2- ((i + j) / distMax))]); 
                        push(listeCell, [getCellFromXY(x - i, y + j), 50 * (2- ((i + j) / distMax))]);  
                        push(listeCell, [getCellFromXY(x - j, y - i), 50 * (2- ((i + j) / distMax))]);  
                        push(listeCell, [getCellFromXY(x + i, y - j), 50 * (2- ((i + j) / distMax))]); 
                    }
                }
            }
        }
    }
    return listeCell;
}

/**
 *  fonction qui renvoie les ennemies atteignables
 *  pour la chip lightning
 */
function reachableEnemyForLightning()
{
	var enemies = getAliveEnemies();
	var reachable = [];
	for(var enemy in enemies)
	{
		debug("Reachable test for Chip " + getName(enemy));
		var attackCell = getClosestInlinePosition(getCell(enemy), 2, 6);
		var pathLength = getPathLength(getCell(), attackCell);
		if(pathLength <= getMP())
		{
			push(reachable, enemy);
			debug("Reachable for Chip " + getName(enemy));
		}
	}
	return reachable;
}

/**
 *  fonction qui renvoie les ennemies atteignables
 */
function reachableEnemyForWeapon()
{
	var enemies = getAliveEnemies();
	var reachable = [];
	for(var enemy in enemies)
	{
		var attackCell = getCellToUseWeapon(enemy);
		var pathLength = getPathLength(getCell(), attackCell);
		if(pathLength <= getMP())
			push(reachable, enemy);
	}
	return reachable;
}

function bestShootInZone(reachable, minZoneRange, maxZoneRange)
{
	var chosenEnemy = -1;
	var weigth = 0;
	for(var enemy in reachable)
	{
		var cellsHit = getListeCellEffet(getCell(enemy), minZoneRange, maxZoneRange);
		var weigthForThis = 0;
		for(var cellNb = 0; cellNb < count(cellsHit); cellNb ++)
		{
			var leekOnCell = getLeekOnCell(cellsHit[cellNb][0]);
			if(leekOnCell == -1 || leekOnCell == null) continue;
			if(isAlly(leekOnCell)) weigthForThis -= cellsHit[cellNb][1];
			else if (isEnemy(leekOnCell)) weigthForThis += cellsHit[cellNb][1];
		}
		debug("enemy " + getName(enemy) + " weigth " + weigthForThis);
		if(chosenEnemy == -1 || weigthForThis > weigth)
		{
			chosenEnemy = enemy;
			weigth = weigthForThis;
		}
	}
	return chosenEnemy;
}

/**
 * Fonction qui choisit la meilleure cible en fonction des dégats de zone
 * Le choix est pondéré par la distance
 */
function chooseEnemyForLightning()
{
	var reachable = reachableEnemyForLightning();
	var reachableCount = count(reachable);
	debug("chip reachable count " + reachableCount);
	if(reachableCount == 0) return null;
	if(reachableCount == 1) return reachable[0];
	return bestShootInZone(reachable, 0, 2);
}

/**
 * Fonction qui choisit la meilleure cible en fonction des dégats de zone
 * Le choix est pondéré par la distance
 */
function chooseEnemyForWeapon()
{
	var reachable = reachableEnemyForWeapon();
	var reachableCount = count(reachable);
	debug("reachable count " + reachableCount);
	if(reachableCount == 0) return null;
	if(reachableCount == 1) return reachable[0];
	return bestShootInZone(reachable, 0, 2);
}

function isCellBetter(i, cell, @closestCell, @minDist, minRange)
{
	if(cell != null && (isEmptyCell(cell) || getCell() == cell))
	{
		if(i >= minRange)// on a besoin de savoir si avant minRange, il y a un obstacle
		{
			var dist = getPathLength(getCell(), cell);
			if(dist <= minDist && dist >= 0)
			{
				minDist = dist;
				closestCell = cell;
			}
			if(getCell() == cell)
			{
				minDist = 0;
				closestCell = cell;
			}
		}
		return true;
	}
	return false;//obstacle
}

/**
 * Fonction qui renvoie la cellule la plus proche pour tirer inline
 */
function getClosestInlinePosition(enemyCell, minRange, maxRange)
{
	var enemyCellX = getCellX(enemyCell);
	var enemyCellY = getCellY(enemyCell);
	var closestCell = null;
	var cell = getCell();
	var minDist = 1000;
	for(var i =1; i<=maxRange; i++)
	{
		cell = getCellFromXY(enemyCellX - i, enemyCellY);
		if(!isCellBetter(i, cell, closestCell, minDist, minRange))
			break;
	}
	for(var i =1; i<=maxRange; i++)
	{
		cell = getCellFromXY(enemyCellX, enemyCellY + i);
		if(!isCellBetter(i, cell, closestCell, minDist, minRange))
			break;
	}
	for(var i =1; i<=maxRange; i++)
	{
		cell = getCellFromXY(enemyCellX, enemyCellY - i);
		if(!isCellBetter(i, cell, closestCell, minDist, minRange))
			break;
	}
	for(var i =1; i<=maxRange; i++)
	{
		cell = getCellFromXY(enemyCellX +i, enemyCellY);
		if(!isCellBetter(i, cell, closestCell, minDist, minRange))
			break;
	}
	debug("closestCell " + closestCell + " dist " + minDist);
	return closestCell;
}

