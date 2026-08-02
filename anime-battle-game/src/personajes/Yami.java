package personajes;

import kit_habilidades.Kit_Chrollo;
import kit_habilidades.Kit_Yami;
import tools.Personaje;

/**
 * Clase que representa al personaje Yami Sukeiro.
 * 
 * Esta clase encapsula los atributos básicos del personaje mediante la clase {@link Personaje}
 * y sus habilidades especiales mediante {@link Kit_Yami}.
 * 
 */
public class Yami {
	
	/** Instancia del personaje Yami con sus atributos básicos. */
	private Personaje Yami;
	/** Instancia del kit de habilidades específico de Yami. */
	private Kit_Yami habilidades;
	
	/**
	 * Constructor que inicializa al personaje Yami con sus atributos predeterminados
	 * y su kit de habilidades correspondiente.
	 */
	public Yami() {
		Yami = new Personaje("Yami Sukeiro", 450.0, 400, 15.0, 38);
		habilidades = new Kit_Yami();
	}
	
	/** * Obtiene la instancia de {@link Personaje} que representa a Yami.
	 *  
	 * @return el objeto {@link Personaje} de Yami.
	 */
	public Personaje getYami() {
		return Yami;
	}
	
	/** 
	 * Obtiene el kit de habilidades de Yami. 
	 * 
	 * @return el objeto {@link Kit_Yami} con las habilidades del personaje. 
	 */
	public Kit_Yami getHabilidades() {
		return habilidades;
	}
}
