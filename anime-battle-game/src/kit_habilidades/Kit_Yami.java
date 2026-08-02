package kit_habilidades;

import tools.EfectosDeHabilidad;
import tools.Habilidad;
import tools.Interfaz_kits.Kit;

/**
 * Kit de habilidades específico para el personaje {@link Yami}.
 * 
 * Esta clase implementa la interfaz {@link Kit} y define las habilidades que el personaje
 * puede usar en el juego, incluyendo su habilidad definitiva (ulti).
 * 
 */
public class Kit_Yami implements Kit {

	private Habilidad H1;
	private Habilidad H2;
	private Habilidad H3;
	private Habilidad Ulti;
	private boolean ultiUsada = false;
	
	//constructor
	public Kit_Yami() {
		H1 = new Habilidad("Dark Cloak Slash", 70.0, 60, EfectosDeHabilidad.NINGUNO, 0);
		H2 = new Habilidad("Black Cocoan", 0.0, 55, EfectosDeHabilidad.ESCUDO, 50);
		H3 = new Habilidad("Avidya's Sword Slash", 50.0, 65, EfectosDeHabilidad.BONUS_DANYO_BASERIVAL, 60);
		Ulti = new Habilidad("Avidya's Reverse Sword Slash", 140.0, 120, EfectosDeHabilidad.NINGUNO, 0);
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
