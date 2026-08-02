package kit_habilidades;

import tools.EfectosDeHabilidad;
import tools.Habilidad;
import tools.Interfaz_kits.Kit;

/**
 * Kit de habilidades específico para el personaje {@link Trunks}.
 * 
 * Esta clase implementa la interfaz {@link Kit} y define las habilidades que el personaje
 * puede usar en el juego, incluyendo su habilidad definitiva (ulti).
 * 
 */
public class Kit_Trunks implements Kit {

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
	 * Constructor que inicializa todas las habilidades de Trunks con sus efectos, daños y costos. 
	 */
	public Kit_Trunks() {
		H1 = new Habilidad("Blade Thrust", 65.0, 50, EfectosDeHabilidad.NINGUNO, 0);
		H2 = new Habilidad("Fast Slash", 45.0, 40, EfectosDeHabilidad.BONUS_VELOCIDAD, 50);
		H3 = new Habilidad("Warp Shift", 80.0, 70, EfectosDeHabilidad.NINGUNO, 0);
		Ulti = new Habilidad("Ki Skirmish", 120.0, 100, EfectosDeHabilidad.HEAL, 25);
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
