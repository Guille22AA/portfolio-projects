package personajes;

import kit_habilidades.Kit_Chrollo;
import tools.Personaje;

/**
 * Clase que representa al personaje Chrollo Lucilfer.
 * 
 * Esta clase encapsula los atributos básicos del personaje mediante la clase {@link Personaje}
 * y sus habilidades especiales mediante {@link Kit_Chrollo}.
 * 
 */
public class Chrollo {
	
	/** Instancia del personaje Chrollo con sus atributos básicos. */
	private Personaje chrollo;
	/** Instancia del kit de habilidades específico de Chrollo. */
	private Kit_Chrollo habilidades;
	
	/**
	 * Constructor que inicializa al personaje Chrollo con sus atributos predeterminados
	 * y su kit de habilidades correspondiente.
	 */
	public Chrollo() {
		chrollo = new Personaje("Chrollo Lucilfer", 415.0, 400, 25.0, 32);
		habilidades = new Kit_Chrollo();
	}
	
	/** * Obtiene la instancia de {@link Personaje} que representa a Chrollo.
	 *  
	 * @return el objeto {@link Personaje} de Chrollo.
	 */
	public Personaje getChrollo() {
		return chrollo;
	}
	
	/** 
	 * Obtiene el kit de habilidades de Chrollo. 
	 * 
	 * @return el objeto {@link Kit_Chrollo} con las habilidades del personaje. 
	 */
	public Kit_Chrollo getHabilidades() {
		return habilidades;
	}
	

}
