package tools;

/**
 * Representa una habilidad que un personaje puede utilizar durante el combate.
 * <p>
 * Cada habilidad contiene:
 * <ul>
 *     <li>Un nombre identificativo</li>
 *     <li>Un daño base</li>
 *     <li>Un coste de maná</li>
 *     <li>Un tipo de efecto especial</li>
 *     <li>Un valor asociado a dicho efecto</li>
 * </ul>
 * Los efectos especiales están definidos en el enumerado
 * {@link EfectosDeHabilidad} y permiten modificar el flujo del combate
 * aplicando estados, bonus o acciones adicionales.
 */
public class Habilidad {
	
	/** Nombre identificativo de la habilidad. */
	private String nombre;
	/** Daño base que inflige esta habilidad. */
	private double danyo;
	/** Cantidad de maná que consume al usarse. */
	private int mana;
	/** Tipo de efecto adicional que provoca esta habilidad. */
	private EfectosDeHabilidad tipoEfecto;
    /**
     * Valor numérico del efecto especial. Su significado depende del tipo:
     * <ul>
     *     <li>Porcentaje (SLOW, BONUS_VELOCIDAD...)</li>
     *     <li>Duración o daño por turno (DOS_TURNOS)</li>
     *     <li>Curación (HEAL)</li>
     *     <li>Puntos de escudo (ESCUDO)</li>
     * </ul>
     */
	private int valorEfecto;
	
    /**
     * Construye una habilidad con todos sus atributos configurados.
     *
     * @param nombre       Nombre de la habilidad.
     * @param danyo        Daño base que inflige.
     * @param mana         Maná necesario para usarla.
     * @param tipoEfecto   Tipo de efecto adicional.
     * @param valorEfecto  Valor asociado al efecto especial.
     */
	public Habilidad (String nombre, double danyo, int mana, EfectosDeHabilidad tipoEfecto, int valorEfecto) {
		this.nombre = nombre;
		this.danyo = danyo;
		this.mana = mana;
		this.tipoEfecto = tipoEfecto;
		this.valorEfecto = valorEfecto;
	}
	
    /**
     * Devuelve una representación completa de la habilidad en texto.
     *
     * @return Cadena con nombre, daño, maná y efecto.
     */
    @Override
	public String toString() {
	    return nombre + 
	           " | Daño: " + danyo +
	           " | Maná: " + mana +
	           " | Efecto: " + tipoEfecto +
	           " | Valor efecto: " + valorEfecto;
	}

	
	
	//--GETETRS Y SETETRS--
    
    
    /** @return Nombre de la habilidad. */
    public String getNombre() {
        return nombre;
    }

    /** @param nombre Nuevo nombre para la habilidad. */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /** @return Daño base infligido por la habilidad. */
    public double getDanyo() {
        return danyo;
    }

    /** @param danyo Nuevo daño base. */
    public void setDanyo(double danyo) {
        this.danyo = danyo;
    }

    /** @return Coste de maná de la habilidad. */
    public int getMana() {
        return mana;
    }

    /** @param mana Nuevo coste de maná. */
    public void setMana(int mana) {
        this.mana = mana;
    }

    /** @return Tipo de efecto especial asociado. */
    public EfectosDeHabilidad getTipoEfecto() {
        return tipoEfecto;
    }

    /** @param tipoEfecto Nuevo efecto para esta habilidad. */
    public void setTipoEfecto(EfectosDeHabilidad tipoEfecto) {
        this.tipoEfecto = tipoEfecto;
    }

    /** @return Valor numérico del efecto especial. */
    public int getValorEfecto() {
        return valorEfecto;
    }
    
    /** @param valorEfecto Nuevo valor para el efecto especial. */
	public void setValorEfecto(int valorEfecto) {
		this.valorEfecto = valorEfecto;
	}

	
}
