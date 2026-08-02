package kit_habilidades;

import tools.EfectosDeHabilidad;
import tools.Habilidad;
import tools.Interfaz_kits.Kit;

/**
 * Kit de habilidades específico para el personaje {@link Chrollo}.
 * 
 * Esta clase implementa la interfaz {@link Kit} y define las habilidades que el personaje
 * puede usar en el juego, incluyendo su habilidad definitiva (ulti).
 * 
 */
public class Kit_Chrollo implements Kit {

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
	 * Constructor que inicializa todas las habilidades de Chrollo con sus efectos, daños y costos. 
	 */
	public Kit_Chrollo() {
		H1 = new Habilidad("Ben's Knife", 60.0, 40, EfectosDeHabilidad.SLOW, 45);
		H2 = new Habilidad("Sun and Moon", 75.0, 60, EfectosDeHabilidad.NINGUNO, 0);
		H3 = new Habilidad("Judgment Fishes", 50.0, 70, EfectosDeHabilidad.DOS_TURNOS, 0);
		Ulti = new Habilidad("Skill Hunter", 0.0, 100, EfectosDeHabilidad.ROBAR_ULTI, 0);
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
