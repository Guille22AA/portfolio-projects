package personajes;

import kit_habilidades.Kit_Chrollo;
import kit_habilidades.Kit_Kurapika;
import tools.Personaje;

/**
 * Clase que representa al personaje Kurapika.
 * 
 * Esta clase encapsula los atributos básicos del personaje mediante la clase {@link Personaje}
 * y sus habilidades especiales mediante {@link Kit_Kurapika}.
 * 
 */
public class Kurapika {
	
	/** Instancia del personaje Kurapika con sus atributos básicos. */
	private Personaje Kurapika;
	/** Instancia del kit de habilidades específico de Kurapika. */
	private Kit_Kurapika habilidades;
	
	/**
	 * Constructor que inicializa al personaje Kurapika con sus atributos predeterminados
	 * y su kit de habilidades correspondiente.
	 */
	public Kurapika() {
		Kurapika = new Personaje("Kurapika", 400.0, 425, 18.0, 20);
		habilidades = new Kit_Kurapika();
	}
	
	/** * Obtiene la instancia de {@link Personaje} que representa a Kurapika.
	 *  
	 * @return el objeto {@link Personaje} de Kurapika.
	 */
	public Personaje getKurapika() {
		return Kurapika;
	}
	public Kit_Kurapika getHabilidades() {
		return habilidades;
	}
}
