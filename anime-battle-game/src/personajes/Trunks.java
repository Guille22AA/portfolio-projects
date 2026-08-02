package personajes;

import kit_habilidades.Kit_Chrollo;
import kit_habilidades.Kit_Trunks;
import tools.Personaje;

/**
 * Clase que representa al personaje Trunks Brief.
 * 
 * Esta clase encapsula los atributos básicos del personaje mediante la clase {@link Personaje}
 * y sus habilidades especiales mediante {@link Kit_Trunks}.
 * 
 */
public class Trunks {
	
	/** Instancia del personaje Trunks con sus atributos básicos. */
	private Personaje Trunks;
	/** Instancia del kit de habilidades específico de Trunks. */
	private Kit_Trunks habilidades;
	
	/**
	 * Constructor que inicializa al personaje Trunks con sus atributos predeterminados
	 * y su kit de habilidades correspondiente.
	 */
	public Trunks() {
		Trunks = new Personaje("Trunks Brief", 435.0, 370, 20.0, 28);
		habilidades = new Kit_Trunks();
	}
	
	/** * Obtiene la instancia de {@link Personaje} que representa a Trunks.
	 *  
	 * @return el objeto {@link Personaje} de Trunks.
	 */
	public Personaje getTrunks() {
		return Trunks;
	}
	
	/** 
	 * Obtiene el kit de habilidades de Trunks. 
	 * 
	 * @return el objeto {@link Kit_Trunks} con las habilidades del personaje. 
	 */
	public Kit_Trunks getHabilidades() {
		return habilidades;
	}
}
