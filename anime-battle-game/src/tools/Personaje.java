package tools;

/**
 * Representa a un personaje jugable dentro de Anime Arena.
 * <p>
 * Cada personaje posee estadísticas básicas como vida, maná,
 * velocidad y daño base. Además, incluye métodos fundamentales
 * utilizados durante el combate como recibir daño o realizar
 * un ataque básico.
 */
public class Personaje {
	
	/** Nombre del personaje. */
	private String nombre;
	/** Vida actual del personaje. Cuando llega a 0, el personaje muere.*/
	private double vida;
	/** Cantidad actual de maná disponible para usar habilidades. */
	private int mana;
	/** Velocidad base del personaje, determina el orden de turnos. */
	private double velocidad;
	/** Daño base que inflige el ataque básico. */
	private int danyoBase;

	
    /**
     * Construye un nuevo personaje con las estadísticas especificadas.
     *
     * @param nombre nombre del personaje
     * @param vida vida máxima y actual del personaje
     * @param mana cantidad inicial de maná
     * @param velocidad valor de velocidad base
     * @param danyoBase daño del ataque básico
     */
	public Personaje (String nombre, double vida, int mana, double velocidad, int danyoBase) {
		this.nombre = nombre;
		this.vida = vida;
		this.mana = mana;
		this.velocidad = velocidad;
		this.danyoBase = danyoBase;
	}
	


    /**
     * Indica si el personaje sigue vivo.
     *
     * @return {@code true} si la vida es mayor que 0, {@code false} si ha muerto.
     */
	public boolean estaVivo() {
		return vida > 0;
	}
	
	 /**
     * Realiza un ataque básico basado en el daño base del personaje.
     *
     * @return daño infligido por el ataque básico
     */
	public int ataqueBasico() {
		return danyoBase;
	}
	
	/**
     * Reduce la vida del personaje al recibir daño.
     * <p>
     * La vida nunca baja de 0, gracias al uso de {@link Math#max(double, double)}.
     *
     * @param danyoRival cantidad de daño recibido
     * @return la vida restante después del golpe
     */
	public double recibirDanyo(double danyoRival) {
		vida = Math.max(0, vida - danyoRival);
		//devuelve el valor más alto, si lo matan devuelve 0.
		return vida;
	}
	
	/**
     * Devuelve una representación textual con todas las estadísticas del personaje.
     *
     * @return cadena con nombre, vida, maná, velocidad y daño base
     */
	public String getStats() {
	    return "Nombre: " + nombre +
	           "\nVida: " + vida +
	           "\nManá: " + mana +
	           "\nVelocidad: " + velocidad +
	           "\nDaño base: " + danyoBase;
	}



	//--GETTERS Y SETTERS--
	
	 /** @return nombre del personaje */
    public String getNombre() {
        return nombre;
    }

    /** @param nombre nuevo nombre del personaje */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /** @return vida actual del personaje */
    public double getVida() {
        return vida;
    }

    /** @param vida vida nueva del personaje */
    public void setVida(double vida) {
        this.vida = vida;
    }

    /** @return maná actual */
    public int getMana() {
        return mana;
    }

    /** @param mana nuevo valor de maná */
    public void setMana(int mana) {
        this.mana = mana;
    }

    /** @return velocidad base */
    public double getVelocidad() {
        return velocidad;
    }

    /** @param velocidad nueva velocidad */
    public void setVelocidad(double velocidad) {
        this.velocidad = velocidad;
    }

    /** @return daño base del ataque simple */
    public int getDanyoBase() {
        return danyoBase;
    }

    /** @param danyoBase nuevo valor del daño base */
    public void setDanyoBase(int danyoBase) {
        this.danyoBase = danyoBase;
    }
	
}
