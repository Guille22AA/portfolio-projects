package kit_habilidades;

import tools.EfectosDeHabilidad;
import tools.Habilidad;
import tools.Interfaz_kits.Kit;

/**
 * Kit de habilidades específico para el personaje {@link Kurapika}.
 * 
 * Esta clase implementa la interfaz {@link Kit} y define las habilidades que el personaje
 * puede usar en el juego, incluyendo su habilidad definitiva (ulti).
 * 
 */
public class Kit_Kurapika implements Kit {
	
	/** Primera habilidad del kit. */
	private Habilidad H1;
	/** Segunda habilidad del kit. */
	private Habilidad H2;
	/** Tercera habilidad del kit. */
	private Habilidad H3;
	/** Habilidad definitiva (Ultimate) del personaje. */
	private Habilidad Ulti;
	/** Estado que indica si la Uliamte ya ha sido utilizada. */
	private boolean ultiUsada = false;
	
	/** 
	 * Constructor que inicializa todas las habilidades de Kurapika con sus efectos, daños y costos. 
	 */
	public Kit_Kurapika() {
		H1 = new Habilidad("Dowsing Chain", 60.0, 50, EfectosDeHabilidad.NINGUNO, 0);
		H2 = new Habilidad("Holy Chain", 0.0, 60, EfectosDeHabilidad.HEAL, 45);
		H3 = new Habilidad("Chain Jail", 50.0, 65, EfectosDeHabilidad.STUN, 0);
		Ulti = new Habilidad("Judgment Jail", 90.0, 110, EfectosDeHabilidad.EJECUTAR, 15); 
	}
	
	/**
	 * Devuelve todas las habilidades del kit en un array.
	 * @return array de {@link Habilidad}.
	 */
    public Habilidad[] mostrarHabilidades() {
        return new Habilidad[]{H1, H2, H3, Ulti};
    }
	
    /**
     * {@inheritDoc}
     */
	@Override
	public Habilidad[] getHabilidades() {
		return new Habilidad[]{H1, H2, H3, Ulti};
	}
	
	/**
     * {@inheritDoc}
     */
	@Override
	public boolean isUltiUsada() {
	    return ultiUsada;
	}

	/**
     * {@inheritDoc}
     */
	@Override
	public void marcarUltiUsada() {
	    ultiUsada = true;
	}
}
