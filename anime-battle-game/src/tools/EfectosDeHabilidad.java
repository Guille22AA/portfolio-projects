package tools;

/**
 * Enumeración que define todos los tipos de efectos especiales que una habilidad
 * puede aplicar durante el combate.  
 * 
 * Cada valor representa una mecánica distinta que modifica el estado del jugador
 * o del enemigo, ya sea alterando estadísticas, aplicando daño adicional o
 * estableciendo condiciones especiales que afectan a turnos posteriores.
 *
 * <p>Lista de efectos disponibles:</p>
 *
 * <ul>
 *     <li><b>SLOW</b>: Reduce la velocidad del objetivo un turno en un porcentaje.</li>
 *     <li><b>STUN</b>: Inmoviliza al objetivo haciéndole perder su siguiente turno.</li>
 *     <li><b>ESCUDO</b>: Otorga un escudo temporal que absorbe una cantidad fija de daño.</li>
 *     <li><b>HEAL</b>: Restaura una cantidad fija de puntos de vida.</li>
 *     <li><b>BONUS_VELOCIDAD</b>: Aumenta la velocidad del usuario durante un turno en un porcentaje.</li>
 *     <li><b>BONUS_DANYO_BASERIVAL</b>: Otorga daño adicional igual a un porcentaje del daño base del enemigo.</li>
 *     <li><b>EJECUTAR</b>: El ataque elimina instantáneamente al rival si su vida está por debajo de una cantidad específica de vida.</li>
 *     <li><b>DOS_TURNOS</b>: Aplica daño prolongado (DOT) durante dos turnos consecutivos.</li>
 *     <li><b>ROBAR_ULTI</b>: Permite ejecutar la habilidad ultimate del enemigo en el mismo turno.</li>
 *     <li><b>SIN_EFECTO</b>: Indica que la habilidad no aplica ningún efecto adicional.</li>
 * </ul>
 *
 */
public enum EfectosDeHabilidad {
	SLOW,
	ESCUDO,
	HEAL,
	DOS_TURNOS,
	STUN,
	BONUS_VELOCIDAD,
	ROBAR_ULTI,
	EJECUTAR,
	BONUS_DANYO_BASERIVAL,
	NINGUNO;
}
