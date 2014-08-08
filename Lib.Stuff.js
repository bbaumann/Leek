// Generated: Thu Aug 07 2014 23:28:21 GMT+0200 (Romance Standard Time)
global STUFFS = null;
global STUFF_COOLDOWN = 0;
global STUFF_COST = 1;
global STUFF_DURATION = 2;
global STUFF_RADIUS = 3;
global STUFF_FAILS = 4;
global STUFF_DAMAGE = 5;
global STUFF_DAMAGEOVERTIME = 6;
global STUFF_HEAL = 7;
global STUFF_ABSOLUTE = 8;
global STUFF_RELATIVE = 9;
global STUFF_AGILITY = 10;
global STUFF_STRENGTH = 11;
global STUFF_TP = 12;
global STUFF_MP = 13;
global STUFF_LIBERATION = 14;
global STUFF_SCOPE = 15;
global STUFF_VALUE_AVERAGE = 0;
global STUFF_VALUE_MIN = 1;
global STUFF_VALUE_MAX = 2;
global STUFF_SCOPE_MIN = 0;
global STUFF_SCOPE_MAX = 1;
global STUFF_SCOPE_INLINE = 2;
if (STUFFS === null) {
  STUFFS = [];
  STUFFS[WEAPON_PISTOL] = [0, 3, 1, 0, 5, [17.5, 15, 20], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [1, 7, false]];
  STUFFS[WEAPON_MACHINE_GUN] = [0, 4, 1, 0, 7, [22, 20, 24], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [1, 6, true]];
  STUFFS[WEAPON_DOUBLE_GUN] = [0, 4, 2, 0, 6, [21.5, 18, 25], [6.5, 5, 8], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 7, false]];
  STUFFS[WEAPON_SHOTGUN] = [0, 5, 1, 0, 10, [38, 33, 43], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [1, 5, true]];
  STUFFS[WEAPON_MAGNUM] = [0, 5, 1, 0, 4, [32.5, 25, 40], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [1, 8, false]];
  STUFFS[WEAPON_LASER] = [0, 6, 1, 0, 9, [51, 43, 59], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 7, true]];
  STUFFS[WEAPON_GRENADE_LAUNCHER] = [0, 6, 1, 2, 7, [49, 45, 53], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [4, 7, false]];
  STUFFS[WEAPON_FLAME_THROWER] = [0, 7, 3, 0, 10, [37.5, 35, 40], [14, 14, 14], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 7, true]];
  STUFFS[WEAPON_DESTROYER] = [0, 6, 1, 0, 6, [50, 40, 60], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [1, 6, false]];
  STUFFS[WEAPON_GAZOR] = [0, 7, 4, 3, 9, [17.5, 15, 20], [17.5, 15, 20], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 7, true]];
  STUFFS[WEAPON_ELECTRISOR] = [0, 6, 1, 1, 12, [82.5, 70, 95], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [6, 8, false]];
  STUFFS[WEAPON_M_LASER] = [0, 8, 1, 0, 8, [95, 90, 100], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 15, true]];
  STUFFS[-CHIP_SHOCK] = [0, 2, 1, 0, 30, [6, 5, 7], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [0, 6, false]];
  STUFFS[-CHIP_PEBBLE] = [1, 2, 1, 0, 9, [9.5, 2, 17], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [0, 5, false]];
  STUFFS[-CHIP_SPARK] = [0, 3, 1, 0, 4, [12, 8, 16], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [0, 10, false]];
  STUFFS[-CHIP_ICE] = [0, 4, 1, 0, 5, [18, 17, 19], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [0, 8, false]];
  STUFFS[-CHIP_BANDAGE] = [1, 2, 1, 0, 5, [0, 0, 0], [0, 0, 0], [12.5, 10, 15], 0, 0, 0, 0, 0, 0, false, [0, 6, false]];
  STUFFS[-CHIP_HELMET] = [4, 4, 3, 0, 10, [0, 0, 0], [0, 0, 0], [0, 0, 0], 15, 0, 0, 0, 0, 0, false, [0, 4, false]];
  STUFFS[-CHIP_ROCK] = [1, 5, 1, 0, 8, [30.5, 30, 31], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 6, false]];
  STUFFS[-CHIP_STRETCHING] = [3, 3, 2, 0, 5, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 50, 0, 0, 0, false, [0, 5, false]];
  STUFFS[-CHIP_WALL] = [5, 4, 2, 0, 6, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 15, 0, 0, 0, 0, false, [0, 3, false]];
  STUFFS[-CHIP_PROTEIN] = [3, 3, 2, 0, 6, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 50, 0, 0, false, [0, 4, false]];
  STUFFS[-CHIP_SHIELD] = [3, 3, 2, 0, 5, [0, 0, 0], [0, 0, 0], [0, 0, 0], 8, 0, 0, 0, 0, 0, false, [0, 4, false]];
  STUFFS[-CHIP_CURE] = [2, 4, 1, 0, 8, [0, 0, 0], [0, 0, 0], [39, 35, 43], 0, 0, 0, 0, 0, 0, false, [0, 5, false]];
  STUFFS[-CHIP_MOTIVATION] = [3, 3, 2, 0, 6, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 1, 0, false, [0, 5, false]];
  STUFFS[-CHIP_FLASH] = [1, 4, 1, 1, 1, [21.5, 19, 24], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [1, 7, true]];
  STUFFS[-CHIP_LEATHER_BOOTS] = [3, 3, 2, 0, 5, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 1, false, [0, 5, false]];
  STUFFS[-CHIP_FLAME] = [0, 4, 1, 0, 10, [26, 25, 27], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 7, false]];
  STUFFS[-CHIP_STEROID] = [4, 6, 3, 0, 5, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 100, 0, 0, false, [0, 4, false]];
  STUFFS[-CHIP_RAMPART] = [4, 6, 3, 0, 5, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 25, 0, 0, 0, 0, false, [2, 7, false]];
  STUFFS[-CHIP_DRIP] = [3, 5, 1, 2, 7, [0, 0, 0], [0, 0, 0], [37.5, 35, 40], 0, 0, 0, 0, 0, 0, false, [2, 6, false]];
  STUFFS[-CHIP_WARM_UP] = [4, 6, 3, 0, 8, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 100, 0, 0, 0, false, [0, 4, false]];
  STUFFS[-CHIP_STALACTITE] = [3, 6, 1, 0, 20, [65.5, 64, 67], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 7, false]];
  STUFFS[-CHIP_ARMOR] = [5, 6, 4, 0, 8, [0, 0, 0], [0, 0, 0], [0, 0, 0], 25, 0, 0, 0, 0, 0, false, [0, 4, false]];
  STUFFS[-CHIP_WINGED_BOOTS] = [4, 4, 3, 1, 10, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 1, false, [0, 3, false]];
  STUFFS[-CHIP_VACCINE] = [3, 6, 3, 0, 7, [0, 0, 0], [0, 0, 0], [31, 30, 32], 0, 0, 0, 0, 0, 0, false, [0, 6, false]];
  STUFFS[-CHIP_LIGHTNING] = [0, 4, 1, 2, 7, [41, 35, 47], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [2, 6, true]];
  STUFFS[-CHIP_FORTRESS] = [4, 8, 3, 0, 6, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 40, 0, 0, 0, 0, false, [0, 3, false]];
  STUFFS[-CHIP_ADRENALINE] = [4, 5, 3, 1, 8, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 1, 0, false, [0, 5, false]];
  STUFFS[-CHIP_ROCKFALL] = [1, 7, 1, 2, 8, [52, 48, 56], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [5, 7, false]];
  STUFFS[-CHIP_LIBERATION] = [5, 5, 1, 0, 7, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, true, [0, 6, false]];
  STUFFS[-CHIP_ICEBERG] = [3, 7, 1, 2, 5, [76, 72, 80], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [3, 5, true]];
  STUFFS[-CHIP_RESURRECTION] = [0, 8, 1, 0, 25, [0, 0, 0], [0, 0, 0], [200, 200, 200], 0, 0, 0, 0, 0, 0, false, [0, 3, false]];
  STUFFS[-CHIP_METEORITE] = [3, 8, 1, 2, 4, [75, 70, 80], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 0, false, [4, 8, false]];
  STUFFS[-CHIP_REFLEXES] = [5, 8, 4, 0, 6, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 200, 0, 0, 0, false, [0, 3, false]];
  STUFFS[-CHIP_DOPING] = [5, 7, 4, 0, 14, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 200, 0, 0, false, [0, 5, false]];
  STUFFS[-CHIP_SEVEN_LEAGUE_BOOTS] = [5, 6, 4, 0, 7, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 0, 2, false, [0, 2, false]];
  STUFFS[-CHIP_RAGE] = [5, 7, 4, 0, 12, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0, 0, 0, 0, 2, 0, false, [0, 3, false]];
}

function estimateHeal(chip)
{
		return (min(100-STUFFS[-1*chip][STUFF_FAILS]+getCores(),99)/100) *
		STUFFS[-1*chip][STUFF_HEAL][STUFF_VALUE_AVERAGE] * (1 + getAgility()/100);
}

function estimateChipDamage(chip,leek)
{
		return (min(100-STUFFS[-1*chip][STUFF_FAILS]+getCores(),99)/100) *
		(STUFFS[-1*chip][STUFF_DAMAGE][STUFF_VALUE_AVERAGE] * (1 + getForce()/100)
		 * (1-getRelativeShield(leek)) - getAbsoluteShield(leek));
}

function estimateWeaponDamage(weapon,leek)
{
		return (min(100-STUFFS[weapon][STUFF_FAILS]+getCores(),99)/100) *
		(STUFFS[weapon][STUFF_DAMAGE][STUFF_VALUE_AVERAGE] * (1 + getForce()/100)
		 * (1-getRelativeShield(leek)) - getAbsoluteShield(leek));
}

function estimateProtection(chip)
{
		return (min(100-STUFFS[-1*chip][STUFF_FAILS]+getCores(),99)/100) *
		STUFFS[-1*chip][STUFF_ABSOLUTE] * (1 + getAgility()/100);
}
